import fs from "fs";
import path from "path";

export interface StoredDestination {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc?: string | null;
  image: string;
  thumbnail?: string | null;
  gallery?: string | null;
  startingPrice: number;
  popularAttractions?: string | null;
  bestTimeToVisit?: string | null;
  featured: boolean;
  status: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

declare global {
  var __ceylonDestinationsCache: Map<string, StoredDestination> | undefined;
}

if (!global.__ceylonDestinationsCache) {
  global.__ceylonDestinationsCache = new Map<string, StoredDestination>();
}

const memoryStore = global.__ceylonDestinationsCache;

function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-destinations-backup.json"),
    path.join(process.cwd(), "prisma", "destinations-backup.json"),
    path.join(process.cwd(), "destinations-backup.json"),
    path.join(__dirname, "..", "..", "prisma", "destinations-backup.json"),
    path.join(__dirname, "destinations-backup.json"),
  ];
}

export function readBackupFile(): StoredDestination[] {
  const map = new Map<string, StoredDestination>();
  for (const filePath of getBackupPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && (item.id || item.slug)) {
              const key = item.id || item.slug;
              const existing = map.get(key);
              const itemTime = new Date(item.updatedAt || item.createdAt || 0).getTime();
              const existingTime = existing
                ? new Date(existing.updatedAt || existing.createdAt || 0).getTime()
                : 0;
              if (!existing || itemTime >= existingTime) {
                map.set(key, item);
              }
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return Array.from(map.values());
}

export function writeBackupFile(destinations: StoredDestination[]): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(destinations, null, 2), "utf-8");
    } catch (e) {
      // ignore
    }
  }
}

let lastDestinationsCloudSyncTime = 0;
const DESTINATIONS_CLOUD_SYNC_TTL_MS = 2000;

async function syncWithCloudKv(
  action: "get" | "set",
  destinations?: StoredDestination[]
): Promise<StoredDestination[] | null> {
  const kvUrl = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      if (action === "get") {
        const cmdRes = await fetch(kvUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["GET", "ceylon_destinations"]),
          cache: "no-store",
        });

        if (cmdRes.ok) {
          const json = await cmdRes.json();
          let raw = json?.result;
          while (typeof raw === "string") {
            try {
              raw = JSON.parse(raw);
            } catch (e) {
              break;
            }
          }
          if (Array.isArray(raw) && raw.length > 0) return raw;
        }

        const pathRes = await fetch(`${kvUrl}/get/ceylon_destinations`, {
          headers: { Authorization: `Bearer ${kvToken}` },
          cache: "no-store",
        });
        if (pathRes.ok) {
          const json = await pathRes.json();
          let raw = json?.result;
          while (typeof raw === "string") {
            try {
              raw = JSON.parse(raw);
            } catch (e) {
              break;
            }
          }
          if (Array.isArray(raw) && raw.length > 0) return raw;
        }
      } else if (action === "set" && destinations) {
        const payload = JSON.stringify(destinations);
        await fetch(kvUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["SET", "ceylon_destinations", payload]),
        }).catch(() => {});

        await fetch(`${kvUrl}/set/ceylon_destinations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: payload,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("KV destinations sync notice:", err);
    }
  }

  // Tier 2: Vercel Blob Storage Fallback
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      if (action === "get") {
        const listRes = await fetch("https://blob.vercel-storage.com/?prefix=ceylon_destinations_backup.json", {
          headers: { Authorization: `Bearer ${blobToken}` },
          cache: "no-store",
        });
        if (listRes.ok) {
          const listJson = await listRes.json();
          const blobs = listJson.blobs || [];
          if (blobs.length > 0 && blobs[0].downloadUrl) {
            const dataRes = await fetch(blobs[0].downloadUrl, { cache: "no-store" });
            if (dataRes.ok) {
              const data = await dataRes.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
          }
        }
      } else if (action === "set" && destinations) {
        await fetch("https://blob.vercel-storage.com/ceylon_destinations_backup.json", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${blobToken}`,
            "x-api-version": "7",
            "content-type": "application/json",
            "x-add-random-suffix": "false",
          },
          body: JSON.stringify(destinations),
        }).catch(() => {});
      }
    } catch (blobErr) {
      console.warn("Blob destinations sync notice:", blobErr);
    }
  }

  return null;
}

export async function getAllStoredDestinations(): Promise<StoredDestination[]> {
  const disk = readBackupFile();
  for (const d of disk) {
    const existing = memoryStore.get(d.id);
    const diskTime = new Date(d.updatedAt || d.createdAt || 0).getTime();
    const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
    if (!existing || diskTime >= memTime) {
      memoryStore.set(d.id, d);
    }
  }

  const now = Date.now();
  if (now - lastDestinationsCloudSyncTime > DESTINATIONS_CLOUD_SYNC_TTL_MS) {
    lastDestinationsCloudSyncTime = now;
    const cloud = await syncWithCloudKv("get");
    if (cloud && Array.isArray(cloud)) {
      for (const d of cloud) {
        if (!d || !d.id) continue;
        const existing = memoryStore.get(d.id);
        const cloudTime = new Date(d.updatedAt || d.createdAt || 0).getTime();
        const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
        if (!existing || cloudTime >= memTime) {
          memoryStore.set(d.id, d);
        }
      }
      writeBackupFile(Array.from(memoryStore.values()));
    }
  }

  return Array.from(memoryStore.values());
}

export async function saveDestinationToStore(destination: any): Promise<void> {
  if (!destination || (!destination.id && !destination.slug)) return;
  const cleanId = String(destination.id || destination.slug).trim();
  const now = new Date().toISOString();

  const existing = memoryStore.get(cleanId);
  const normalized: StoredDestination = {
    ...existing,
    ...destination,
    id: cleanId,
    name: destination.name || existing?.name || "",
    slug: destination.slug || existing?.slug || "",
    shortDesc: destination.shortDesc || existing?.shortDesc || "",
    longDesc: destination.longDesc !== undefined ? destination.longDesc : existing?.longDesc,
    image: destination.image || existing?.image || "",
    thumbnail: destination.thumbnail !== undefined ? destination.thumbnail : existing?.thumbnail,
    gallery: typeof destination.gallery === "object" ? JSON.stringify(destination.gallery) : (destination.gallery || existing?.gallery),
    startingPrice: Number(destination.startingPrice) ?? existing?.startingPrice ?? 0,
    popularAttractions: typeof destination.popularAttractions === "object" ? JSON.stringify(destination.popularAttractions) : (destination.popularAttractions || existing?.popularAttractions),
    bestTimeToVisit: destination.bestTimeToVisit || existing?.bestTimeToVisit || "Year-round",
    featured: destination.featured !== undefined ? Boolean(destination.featured) : (existing?.featured ?? false),
    status: destination.status || existing?.status || "PUBLISHED",
    seoTitle: destination.seoTitle !== undefined ? destination.seoTitle : existing?.seoTitle,
    seoDescription: destination.seoDescription !== undefined ? destination.seoDescription : existing?.seoDescription,
    createdAt: existing?.createdAt || destination.createdAt || now,
    updatedAt: now,
  };

  memoryStore.set(cleanId, normalized);
  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
  syncWithCloudKv("set", all).catch(() => {});
}

export async function syncDestinationsWithDb(prisma: any): Promise<void> {
  try {
    const dbDests = await prisma.destination.findMany({
      orderBy: { name: "asc" },
    });

    const dbMap = new Map<string, any>();
    for (const d of dbDests) {
      dbMap.set(d.id, d);
      const existing = memoryStore.get(d.id);
      const dbTime = new Date(d.updatedAt || d.createdAt || 0).getTime();
      const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
      if (!existing || dbTime >= memTime) {
        memoryStore.set(d.id, {
          ...d,
          createdAt: d.createdAt?.toISOString?.() || String(d.createdAt),
          updatedAt: d.updatedAt?.toISOString?.() || String(d.updatedAt),
        });
      }
    }

    const diskDests = readBackupFile();
    for (const stored of diskDests) {
      const dbDest = dbMap.get(stored.id);
      const storedTime = new Date(stored.updatedAt || stored.createdAt || 0).getTime();
      const dbTime = dbDest ? new Date(dbDest.updatedAt || dbDest.createdAt || 0).getTime() : 0;

      if (dbDest && storedTime > dbTime + 1000) {
        try {
          await prisma.destination.update({
            where: { id: stored.id },
            data: {
              name: stored.name,
              slug: stored.slug,
              shortDesc: stored.shortDesc,
              longDesc: stored.longDesc,
              image: stored.image,
              thumbnail: stored.thumbnail,
              gallery: stored.gallery,
              startingPrice: stored.startingPrice,
              popularAttractions: stored.popularAttractions,
              bestTimeToVisit: stored.bestTimeToVisit,
              featured: stored.featured,
              status: stored.status,
              seoTitle: stored.seoTitle,
              seoDescription: stored.seoDescription,
            },
          });
          memoryStore.set(stored.id, stored);
        } catch (err) {
          console.warn("Could not sync stored destination to SQLite:", err);
        }
      }
    }

    const all = Array.from(memoryStore.values());
    writeBackupFile(all);
  } catch (err) {
    console.warn("syncDestinationsWithDb error:", err);
  }
}
