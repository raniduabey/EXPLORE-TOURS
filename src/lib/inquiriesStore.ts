import fs from "fs";
import path from "path";

export interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  travelDates: string;
  duration: string;
  budget: string;
  travelers: string;
  accommodation: string;
  transportation: string;
  destinations: string;
  interests: string;
  specialNotes?: string | null;
  status: string; // "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED"
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Global in-memory cache to survive across module reloads in the same runtime
declare global {
  var __ceylonInquiriesCache: Map<string, StoredInquiry> | undefined;
}

if (!global.__ceylonInquiriesCache) {
  global.__ceylonInquiriesCache = new Map<string, StoredInquiry>();
}

const memoryStore = global.__ceylonInquiriesCache;

// Candidate persistent JSON backup paths
function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-inquiries-backup.json"),
    path.join(process.cwd(), "prisma", "inquiries-backup.json"),
    path.join(process.cwd(), "inquiries-backup.json"),
    path.join(__dirname, "..", "..", "prisma", "inquiries-backup.json"),
    path.join(__dirname, "inquiries-backup.json"),
  ];
}

export function cleanInquiryId(rawId: any): string {
  if (!rawId) return "";
  if (typeof rawId === "object" && rawId !== null) {
    if (rawId.id) return cleanInquiryId(rawId.id);
  }
  let s = String(rawId).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

// Read inquiries from all available JSON backup files on disk and merge by id
export function readBackupFile(): StoredInquiry[] {
  const map = new Map<string, StoredInquiry>();
  for (const filePath of getBackupPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id) {
              const cleanId = cleanInquiryId(item.id);
              if (cleanId) {
                const existing = map.get(cleanId);
                const itemTime = new Date(item.updatedAt || item.createdAt || 0).getTime();
                const existingTime = existing
                  ? new Date(existing.updatedAt || existing.createdAt || 0).getTime()
                  : 0;
                if (!existing || itemTime >= existingTime) {
                  map.set(cleanId, {
                    ...item,
                    id: cleanId,
                    status: (item.status || "NEW").toUpperCase(),
                  });
                }
              }
            }
          }
        }
      }
    } catch (err) {
      // Continue to next path
    }
  }
  return Array.from(map.values());
}

// Write inquiries to disk backup files
export function writeBackupFile(inquiries: StoredInquiry[]): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2), "utf-8");
    } catch (err) {
      // Non-fatal on read-only environments
    }
  }
}

// Optional Cloud KV Sync
async function syncWithCloudKv(
  action: "get" | "set",
  inquiries?: StoredInquiry[]
): Promise<StoredInquiry[] | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) return null;

  try {
    if (action === "get") {
      const res = await fetch(`${kvUrl}/get/ceylon_inquiries`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const result = json.result;
        if (typeof result === "string") return JSON.parse(result);
        if (Array.isArray(result)) return result;
      }
    } else if (action === "set" && inquiries) {
      await fetch(`${kvUrl}/set/ceylon_inquiries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(inquiries)),
      });
    }
  } catch (err) {
    console.warn("KV storage sync notice for inquiries:", err);
  }
  return null;
}

// Get all stored inquiries
export async function getAllStoredInquiries(): Promise<StoredInquiry[]> {
  const disk = readBackupFile();
  for (const item of disk) {
    if (!memoryStore.has(item.id)) {
      memoryStore.set(item.id, item);
    }
  }

  // Attempt cloud KV if empty
  if (memoryStore.size === 0) {
    const cloud = await syncWithCloudKv("get");
    if (cloud && cloud.length > 0) {
      for (const item of cloud) {
        memoryStore.set(item.id, item);
      }
      writeBackupFile(cloud);
    }
  }

  return Array.from(memoryStore.values());
}

// Look up a specific inquiry
export async function getInquiryFromStore(rawId: string): Promise<StoredInquiry | null> {
  const cleanId = cleanInquiryId(rawId);
  if (!cleanId) return null;

  if (memoryStore.has(cleanId)) return memoryStore.get(cleanId)!;

  const all = await getAllStoredInquiries();
  for (const item of all) {
    if (item.id === cleanId || item.id.toLowerCase() === cleanId.toLowerCase()) {
      return item;
    }
  }
  return null;
}

// Save or update an inquiry in persistent store
export async function saveInquiryToStore(inquiry: StoredInquiry): Promise<void> {
  const cleanId = cleanInquiryId(inquiry.id);
  if (!cleanId) return;

  const normalized: StoredInquiry = {
    ...inquiry,
    id: cleanId,
    status: (inquiry.status || "NEW").toUpperCase(),
    updatedAt: inquiry.updatedAt || new Date().toISOString(),
  };

  memoryStore.set(cleanId, normalized);
  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
  syncWithCloudKv("set", all).catch(() => {});
}

// Idempotency check: find duplicate submission from same email in past seconds
export async function findRecentDuplicateInquiry(
  email: string,
  specialNotes?: string | null,
  windowSeconds = 60
): Promise<StoredInquiry | null> {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const cleanNotes = (specialNotes || "").trim().toLowerCase();
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;

  const all = await getAllStoredInquiries();
  for (const item of all) {
    if (item.email.trim().toLowerCase() === cleanEmail) {
      const itemTime = new Date(item.createdAt).getTime();
      if (itemTime > cutoff) {
        const itemNotes = (item.specialNotes || "").trim().toLowerCase();
        if (!cleanNotes || itemNotes === cleanNotes) {
          return item;
        }
      }
    }
  }
  return null;
}

// Synchronize all inquiries between Prisma SQLite and our store
export async function syncInquiriesWithDb(prisma: any): Promise<void> {
  try {
    // 1. Fetch all inquiries from SQLite
    const dbInquiries = await prisma.customTripRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    const dbMap = new Map<string, any>();
    for (const d of dbInquiries) {
      dbMap.set(d.id, d);
      memoryStore.set(d.id, {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        country: d.country,
        travelDates: d.travelDates,
        duration: d.duration,
        budget: d.budget,
        travelers: d.travelers,
        accommodation: d.accommodation,
        transportation: d.transportation,
        destinations: d.destinations,
        interests: d.interests,
        specialNotes: d.specialNotes,
        status: (d.status || "NEW").toUpperCase(),
        adminNotes: d.adminNotes,
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
      });
    }

    // 2. Any inquiries in the persistent store missing from SQLite (e.g. submitted in a different lambda instance)
    const allStored = await getAllStoredInquiries();
    for (const stored of allStored) {
      if (!dbMap.has(stored.id)) {
        try {
          await prisma.customTripRequest.upsert({
            where: { id: stored.id },
            create: {
              id: stored.id,
              name: stored.name,
              email: stored.email,
              phone: stored.phone || "Not specified",
              country: stored.country || "International",
              travelDates: stored.travelDates || "Flexible",
              duration: stored.duration || "Custom",
              budget: stored.budget || "Comfort",
              travelers: stored.travelers || "2 Adults",
              accommodation: stored.accommodation || "Boutique",
              transportation: stored.transportation || "Private AC Vehicle",
              destinations: stored.destinations || "[]",
              interests: stored.interests || "[]",
              specialNotes: stored.specialNotes || null,
              status: (stored.status || "NEW").toUpperCase(),
              adminNotes: stored.adminNotes || null,
              createdAt: new Date(stored.createdAt),
              updatedAt: new Date(stored.updatedAt),
            },
            update: {
              status: (stored.status || "NEW").toUpperCase(),
              adminNotes: stored.adminNotes || null,
            },
          });
        } catch (upsertErr) {
          console.warn("Prisma restore warning for stored inquiry:", upsertErr);
        }
      }
    }
  } catch (err) {
    console.error("syncInquiriesWithDb error:", err);
  }
}
