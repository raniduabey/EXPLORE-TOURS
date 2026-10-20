import fs from "fs";
import path from "path";

export interface StoredTourImage {
  id?: string;
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
  order?: number;
}

export interface StoredItineraryItem {
  id?: string;
  stepNumber: number;
  title: string;
  description: string;
  location?: string | null;
  duration?: string | null;
}

export interface StoredTour {
  id: string;
  title: string;
  slug: string;
  location: string;
  destinationId?: string | null;
  categoryId?: string | null;
  duration: string;
  durationHours: number;
  price: number;
  previousPrice?: number | null;
  adultPrice?: number | null;
  childPrice?: number | null;
  tourType: string;
  badge?: string | null;
  freeCancellation: boolean;
  instantBook: boolean;
  pickupAvailable: boolean;
  guideIncluded: boolean;
  liveGuide: string;
  languages: string;
  minTravellers: number;
  maxTravellers: number;
  description: string;
  highlights?: string | null;
  includes?: string | null;
  excludes?: string | null;
  importantInfo?: string | null;
  whatToBring?: string | null;
  cancellationPolicy?: string | null;
  featured: boolean;
  status: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  rating?: number;
  reviewCount?: number;
  bookedCount?: number;
  images?: StoredTourImage[];
  itinerary?: StoredItineraryItem[];
  destination?: { id: string; name: string; slug: string } | null;
  category?: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

declare global {
  var __ceylonToursCache: Map<string, StoredTour> | undefined;
}

if (!global.__ceylonToursCache) {
  global.__ceylonToursCache = new Map<string, StoredTour>();
}

const memoryStore = global.__ceylonToursCache;

function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-tours-backup.json"),
    path.join(process.cwd(), "prisma", "tours-backup.json"),
    path.join(process.cwd(), "tours-backup.json"),
    path.join(__dirname, "..", "..", "prisma", "tours-backup.json"),
    path.join(__dirname, "tours-backup.json"),
  ];
}

export function cleanTourId(rawId: any): string {
  if (!rawId) return "";
  if (typeof rawId === "object" && rawId !== null && rawId.id) {
    return cleanTourId(rawId.id);
  }
  let s = String(rawId).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export function readBackupFile(): StoredTour[] {
  const map = new Map<string, StoredTour>();
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

export function writeBackupFile(tours: StoredTour[]): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(tours, null, 2), "utf-8");
    } catch (e) {
      // non-fatal on read-only environments
    }
  }
}

async function syncWithCloudKv(
  action: "get" | "set",
  tours?: StoredTour[]
): Promise<StoredTour[] | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return null;

  try {
    if (action === "get") {
      const res = await fetch(`${kvUrl}/get/ceylon_tours`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const result = json.result;
        if (typeof result === "string") return JSON.parse(result);
        if (Array.isArray(result)) return result;
      }
    } else if (action === "set" && tours) {
      await fetch(`${kvUrl}/set/ceylon_tours`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(tours)),
      });
    }
  } catch (err) {
    console.warn("KV tours sync notice:", err);
  }
  return null;
}

export async function getAllStoredTours(): Promise<StoredTour[]> {
  const disk = readBackupFile();
  for (const t of disk) {
    const existing = memoryStore.get(t.id);
    const diskTime = new Date(t.updatedAt || t.createdAt || 0).getTime();
    const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
    if (!existing || diskTime >= memTime) {
      memoryStore.set(t.id, t);
    }
  }

  if (memoryStore.size === 0) {
    const cloud = await syncWithCloudKv("get");
    if (cloud && Array.isArray(cloud)) {
      for (const t of cloud) {
        memoryStore.set(t.id, t);
      }
      writeBackupFile(Array.from(memoryStore.values()));
    }
  }

  return Array.from(memoryStore.values());
}

export async function getStoredTourByIdOrSlug(idOrSlug: string): Promise<StoredTour | null> {
  const clean = cleanTourId(idOrSlug).toLowerCase();
  const all = await getAllStoredTours();
  return (
    all.find((t) => t.id.toLowerCase() === clean || t.slug.toLowerCase() === clean) || null
  );
}

export async function saveTourToStore(tour: any): Promise<void> {
  if (!tour || (!tour.id && !tour.slug)) return;
  const cleanId = cleanTourId(tour.id) || tour.slug;
  const now = new Date().toISOString();

  const existing = memoryStore.get(cleanId);
  const normalized: StoredTour = {
    ...existing,
    ...tour,
    id: cleanId,
    slug: tour.slug || existing?.slug || "",
    title: tour.title || existing?.title || "",
    location: tour.location || existing?.location || "Sri Lanka",
    duration: tour.duration || existing?.duration || "Full Day",
    durationHours: Number(tour.durationHours) || existing?.durationHours || 8,
    price: Number(tour.price) ?? existing?.price ?? 0,
    previousPrice: tour.previousPrice !== undefined ? tour.previousPrice : existing?.previousPrice,
    adultPrice: tour.adultPrice !== undefined ? tour.adultPrice : existing?.adultPrice,
    childPrice: tour.childPrice !== undefined ? tour.childPrice : existing?.childPrice,
    tourType: tour.tourType || existing?.tourType || "Private Tour",
    badge: tour.badge !== undefined ? tour.badge : existing?.badge,
    freeCancellation: tour.freeCancellation !== undefined ? Boolean(tour.freeCancellation) : (existing?.freeCancellation ?? true),
    instantBook: tour.instantBook !== undefined ? Boolean(tour.instantBook) : (existing?.instantBook ?? true),
    pickupAvailable: tour.pickupAvailable !== undefined ? Boolean(tour.pickupAvailable) : (existing?.pickupAvailable ?? true),
    guideIncluded: tour.guideIncluded !== undefined ? Boolean(tour.guideIncluded) : (existing?.guideIncluded ?? true),
    liveGuide: tour.liveGuide || existing?.liveGuide || "English",
    languages: tour.languages || existing?.languages || "English",
    minTravellers: Number(tour.minTravellers) || existing?.minTravellers || 1,
    maxTravellers: Number(tour.maxTravellers) || existing?.maxTravellers || 15,
    description: tour.description || existing?.description || "",
    highlights: typeof tour.highlights === "object" ? JSON.stringify(tour.highlights) : (tour.highlights || existing?.highlights),
    includes: typeof tour.includes === "object" ? JSON.stringify(tour.includes) : (tour.includes || existing?.includes),
    excludes: typeof tour.excludes === "object" ? JSON.stringify(tour.excludes) : (tour.excludes || existing?.excludes),
    importantInfo: tour.importantInfo !== undefined ? tour.importantInfo : existing?.importantInfo,
    whatToBring: typeof tour.whatToBring === "object" ? JSON.stringify(tour.whatToBring) : (tour.whatToBring || existing?.whatToBring),
    cancellationPolicy: tour.cancellationPolicy !== undefined ? tour.cancellationPolicy : existing?.cancellationPolicy,
    featured: tour.featured !== undefined ? Boolean(tour.featured) : (existing?.featured ?? false),
    status: tour.status || existing?.status || "PUBLISHED",
    seoTitle: tour.seoTitle !== undefined ? tour.seoTitle : existing?.seoTitle,
    seoDescription: tour.seoDescription !== undefined ? tour.seoDescription : existing?.seoDescription,
    images: Array.isArray(tour.images) ? tour.images : existing?.images,
    itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : existing?.itinerary,
    destination: tour.destination || existing?.destination,
    category: tour.category || existing?.category,
    createdAt: existing?.createdAt || tour.createdAt || now,
    updatedAt: now,
  };

  memoryStore.set(cleanId, normalized);
  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
  syncWithCloudKv("set", all).catch(() => {});
}

export async function syncToursWithDb(prisma: any): Promise<void> {
  try {
    // 1. Fetch current tours from SQLite
    const dbTours = await prisma.tour.findMany({
      include: {
        images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
        itinerary: { orderBy: { stepNumber: "asc" } },
        destination: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { bookedCount: "desc" },
    });

    const dbMap = new Map<string, any>();
    for (const d of dbTours) {
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

    // 2. Check if disk backups or cloud have newer versions than freshly-copied SQLite
    const diskTours = readBackupFile();
    for (const stored of diskTours) {
      const dbTour = dbMap.get(stored.id);
      const storedTime = new Date(stored.updatedAt || stored.createdAt || 0).getTime();
      const dbTime = dbTour ? new Date(dbTour.updatedAt || dbTour.createdAt || 0).getTime() : 0;

      // If stored tour is newer than the DB record, update SQLite to ensure consistency
      if (dbTour && storedTime > dbTime + 1000) {
        try {
          await prisma.tour.update({
            where: { id: stored.id },
            data: {
              title: stored.title,
              slug: stored.slug,
              location: stored.location,
              duration: stored.duration,
              durationHours: stored.durationHours,
              price: stored.price,
              previousPrice: stored.previousPrice,
              adultPrice: stored.adultPrice,
              childPrice: stored.childPrice,
              tourType: stored.tourType,
              badge: stored.badge,
              freeCancellation: stored.freeCancellation,
              instantBook: stored.instantBook,
              pickupAvailable: stored.pickupAvailable,
              guideIncluded: stored.guideIncluded,
              liveGuide: stored.liveGuide,
              languages: stored.languages,
              minTravellers: stored.minTravellers,
              maxTravellers: stored.maxTravellers,
              description: stored.description,
              highlights: typeof stored.highlights === "object" ? JSON.stringify(stored.highlights) : stored.highlights,
              includes: typeof stored.includes === "object" ? JSON.stringify(stored.includes) : stored.includes,
              excludes: typeof stored.excludes === "object" ? JSON.stringify(stored.excludes) : stored.excludes,
              importantInfo: stored.importantInfo,
              whatToBring: typeof stored.whatToBring === "object" ? JSON.stringify(stored.whatToBring) : stored.whatToBring,
              cancellationPolicy: stored.cancellationPolicy,
              featured: stored.featured,
              status: stored.status,
              seoTitle: stored.seoTitle,
              seoDescription: stored.seoDescription,
            },
          });
          memoryStore.set(stored.id, stored);
        } catch (updateErr) {
          console.warn("Could not sync stored tour to SQLite:", updateErr);
        }
      }
    }

    // Ensure memory store has all items written to backup
    const all = Array.from(memoryStore.values());
    writeBackupFile(all);
  } catch (err) {
    console.warn("syncToursWithDb error:", err);
  }
}
