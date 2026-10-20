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

async function syncWithCloudKv(
  action: "get" | "set",
  destinations?: StoredDestination[]
): Promise<StoredDestination[] | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return null;

  try {
    if (action === "get") {
      const res = await fetch(`${kvUrl}/get/ceylon_destinations`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const result = json.result;
        if (typeof result === "string") return JSON.parse(result);
        if (Array.isArray(result)) return result;
      }
    } else if (action === "set" && destinations) {
      await fetch(`${kvUrl}/set/ceylon_destinations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(destinations)),
      });
    }
  } catch (err) {
    console.warn("KV destinations sync notice:", err);
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

  if (memoryStore.size === 0) {
    const cloud = await syncWithCloudKv("get");
    if (cloud && Array.isArray(cloud)) {
      for (const d of cloud) {
        memoryStore.set(d.id, d);
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
