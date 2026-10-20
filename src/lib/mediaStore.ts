import fs from "fs";
import path from "path";

export interface StoredMediaAsset {
  id: string;
  url: string;
  filename: string;
  title?: string | null;
  altText?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  data?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
}

declare global {
  var __ceylonMediaCache: Map<string, StoredMediaAsset> | undefined;
}

if (!global.__ceylonMediaCache) {
  global.__ceylonMediaCache = new Map<string, StoredMediaAsset>();
}

const memoryStore = global.__ceylonMediaCache;

function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-media-backup.json"),
    path.join(process.cwd(), "prisma", "media-backup.json"),
  ];
}

export function cleanMediaId(rawId: any): string {
  if (!rawId) return "";
  if (typeof rawId === "object" && rawId !== null) {
    if (rawId.id) return cleanMediaId(rawId.id);
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

export function readBackupFile(): StoredMediaAsset[] {
  const map = new Map<string, StoredMediaAsset>();
  for (const filePath of getBackupPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id) {
              const cleanId = cleanMediaId(item.id);
              if (cleanId) {
                const existing = map.get(cleanId);
                const itemTime = new Date(item.updatedAt || item.createdAt || 0).getTime();
                const existingTime = existing
                  ? new Date(existing.updatedAt || existing.createdAt || 0).getTime()
                  : 0;
                if (!existing || itemTime >= existingTime) {
                  map.set(cleanId, { ...item, id: cleanId });
                }
              }
            }
          }
        }
      }
    } catch (err) {
      // Continue
    }
  }
  return Array.from(map.values());
}

export function writeBackupFile(assets: StoredMediaAsset[]): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(assets, null, 2), "utf-8");
    } catch (err) {
      // Non-fatal
    }
  }
}

async function syncWithCloudKv(
  action: "get" | "set",
  assets?: StoredMediaAsset[]
): Promise<StoredMediaAsset[] | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) return null;

  try {
    if (action === "get") {
      const res = await fetch(`${kvUrl}/get/ceylon_media`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const result = json.result;
        if (typeof result === "string") return JSON.parse(result);
        if (Array.isArray(result)) return result;
      }
    } else if (action === "set" && assets) {
      await fetch(`${kvUrl}/set/ceylon_media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(assets)),
      });
    }
  } catch (err) {
    console.warn("KV storage sync notice for media:", err);
  }
  return null;
}

export async function getAllStoredMedia(): Promise<StoredMediaAsset[]> {
  const disk = readBackupFile();
  for (const item of disk) {
    if (!memoryStore.has(item.id)) {
      memoryStore.set(item.id, item);
    }
  }

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

export async function getMediaFromStore(rawIdOrUrl: string): Promise<StoredMediaAsset | null> {
  const query = cleanMediaId(rawIdOrUrl);
  if (!query) return null;

  if (memoryStore.has(query)) return memoryStore.get(query)!;

  const all = await getAllStoredMedia();
  for (const item of all) {
    if (
      item.id === query ||
      item.id.toLowerCase() === query.toLowerCase() ||
      item.url === query ||
      item.url === `/api/media/${query}` ||
      item.url.endsWith(`/${query}`)
    ) {
      return item;
    }
  }
  return null;
}

export async function saveMediaToStore(asset: StoredMediaAsset): Promise<void> {
  const cleanId = cleanMediaId(asset.id);
  if (!cleanId) return;

  const normalized: StoredMediaAsset = {
    ...asset,
    id: cleanId,
    updatedAt: asset.updatedAt || new Date().toISOString(),
  };

  memoryStore.set(cleanId, normalized);
  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
  syncWithCloudKv("set", all).catch(() => {});
}

export async function removeMediaFromStore(rawId: string): Promise<void> {
  const cleanId = cleanMediaId(rawId);
  if (!cleanId) return;

  memoryStore.delete(cleanId);
  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
  syncWithCloudKv("set", all).catch(() => {});
}

export async function syncMediaWithDb(prisma: any): Promise<void> {
  try {
    const dbAssets = await prisma.mediaAsset.findMany();
    const dbMap = new Map<string, any>();
    for (const a of dbAssets) {
      dbMap.set(a.id, a);
      memoryStore.set(a.id, {
        id: a.id,
        url: a.url,
        filename: a.filename,
        title: a.title,
        altText: a.altText,
        fileSize: a.fileSize,
        mimeType: a.mimeType,
        data: a.data,
        width: a.width,
        height: a.height,
        createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : new Date().toISOString(),
      });
    }

    const allStored = await getAllStoredMedia();
    for (const stored of allStored) {
      if (!dbMap.has(stored.id)) {
        try {
          await prisma.mediaAsset.upsert({
            where: { id: stored.id },
            create: {
              id: stored.id,
              url: stored.url,
              filename: stored.filename,
              title: stored.title || stored.filename,
              altText: stored.altText || `${stored.filename} travel photo`,
              fileSize: stored.fileSize || null,
              mimeType: stored.mimeType || "image/jpeg",
              data: stored.data || null,
              width: stored.width || null,
              height: stored.height || null,
              createdAt: new Date(stored.createdAt),
              updatedAt: new Date(stored.updatedAt),
            },
            update: {
              url: stored.url,
              title: stored.title || stored.filename,
              altText: stored.altText || `${stored.filename} travel photo`,
              data: stored.data || undefined,
            },
          });
        } catch (upsertErr) {
          console.warn("Prisma restore warning for stored media asset:", upsertErr);
        }
      }
    }
  } catch (err) {
    console.error("syncMediaWithDb error:", err);
  }
}
