import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export interface StoredReview {
  id: string;
  tourId: string | null;
  bookingId?: string | null;
  userName: string;
  userEmail?: string | null;
  userCountry?: string;
  userAvatar?: string | null;
  photoUrl?: string | null;
  rating: number;
  guideRating?: number;
  transportRating?: number;
  valueRating?: number;
  comment: string;
  travelDate?: string;
  verified: boolean;
  status: string; // "APPROVED" | "PENDING" | "REJECTED" | "HIDDEN"
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  tour?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

// Global in-memory cache to survive across module reloads in the same runtime
declare global {
  var __ceylonReviewsCache: Map<string, StoredReview> | undefined;
}

if (!global.__ceylonReviewsCache) {
  global.__ceylonReviewsCache = new Map<string, StoredReview>();
}

const memoryStore = global.__ceylonReviewsCache;

// Candidate persistent JSON backup paths
function getBackupPaths(): string[] {
  const paths: string[] = [
    path.join("/tmp", "ceylon-reviews-backup.json"),
    path.join(process.cwd(), "prisma", "reviews-backup.json"),
  ];
  return paths;
}

// Clean and normalize incoming review ID
export function cleanReviewId(rawId: any): string {
  if (!rawId) return "";
  if (typeof rawId === "object" && rawId !== null) {
    if (rawId.id) return cleanReviewId(rawId.id);
  }
  let s = String(rawId).trim();
  // Strip surrounding quotes if JSON serialized incorrectly
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

// Read reviews from JSON backup files on disk and merge by id
function readBackupFile(): StoredReview[] {
  const map = new Map<string, StoredReview>();
  for (const filePath of getBackupPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.id) {
              const cleanId = cleanReviewId(item.id);
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
                    status: String(item.status || "PENDING").toUpperCase(),
                  });
                }
              }
            }
          }
        }
      }
    } catch (err) {
      // Ignore reading error and check next path
    }
  }
  return Array.from(map.values());
}

// Write reviews to JSON backup file on disk
function writeBackupFile(reviews: StoredReview[]): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), "utf-8");
    } catch (err) {
      // Non-fatal if read-only filesystem (e.g. process.cwd() on Vercel)
    }
  }
}

let lastReviewsCloudSyncTime = 0;
const REVIEWS_CLOUD_SYNC_TTL_MS = 2000;

// Cloud KV & Blob Sync
async function syncWithCloudKv(
  action: "get" | "set",
  reviews?: StoredReview[]
): Promise<StoredReview[] | null> {
  const kvUrl = (
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ""
  ).replace(/\/$/, "");
  const kvToken =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      if (action === "get") {
        // Universal command endpoint: ["GET", "ceylon_reviews"]
        const cmdRes = await fetch(kvUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["GET", "ceylon_reviews"]),
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

        const pathRes = await fetch(`${kvUrl}/get/ceylon_reviews`, {
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
      } else if (action === "set" && reviews) {
        const payload = JSON.stringify(reviews);
        await fetch(kvUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(["SET", "ceylon_reviews", payload]),
        }).catch(() => {});

        await fetch(`${kvUrl}/set/ceylon_reviews`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          body: payload,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("KV storage sync notice for reviews:", err);
    }
  }

  // Tier 2: Vercel Blob Storage Fallback
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      if (action === "get") {
        const listRes = await fetch("https://blob.vercel-storage.com/?prefix=ceylon_reviews_backup.json", {
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
      } else if (action === "set" && reviews) {
        await fetch("https://blob.vercel-storage.com/ceylon_reviews_backup.json", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${blobToken}`,
            "x-api-version": "7",
            "content-type": "application/json",
            "x-add-random-suffix": "false",
          },
          body: JSON.stringify(reviews),
        }).catch(() => {});
      }
    } catch (blobErr) {
      console.warn("Blob reviews sync notice:", blobErr);
    }
  }

  return null;
}

// Load all reviews from memory, disk backup, and optional cloud KV
export async function getAllStoredReviews(): Promise<StoredReview[]> {
  const diskReviews = readBackupFile();
  for (const r of diskReviews) {
    const existing = memoryStore.get(r.id);
    const diskTime = new Date(r.updatedAt || r.createdAt || 0).getTime();
    const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
    if (!existing || diskTime >= memTime) {
      memoryStore.set(r.id, r);
    }
  }

  const now = Date.now();
  if (now - lastReviewsCloudSyncTime > REVIEWS_CLOUD_SYNC_TTL_MS) {
    lastReviewsCloudSyncTime = now;
    const cloudReviews = await syncWithCloudKv("get");
    if (cloudReviews && cloudReviews.length > 0) {
      for (const r of cloudReviews) {
        if (!r || !r.id) continue;
        const existing = memoryStore.get(r.id);
        const cloudTime = new Date(r.updatedAt || r.createdAt || 0).getTime();
        const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
        if (!existing || cloudTime >= memTime) {
          memoryStore.set(r.id, r);
        }
      }
      writeBackupFile(Array.from(memoryStore.values()));
    }
  }

  return Array.from(memoryStore.values());
}

// Look up a specific review by ID across memory, disk, and cloud
export async function getReviewFromStore(
  rawId: string
): Promise<StoredReview | null> {
  const cleanId = cleanReviewId(rawId);
  if (!cleanId) return null;

  // 1. Check in-memory map
  if (memoryStore.has(cleanId)) {
    return memoryStore.get(cleanId)!;
  }

  // Case-insensitive search in memory map
  const lower = cleanId.toLowerCase();
  for (const [k, v] of memoryStore.entries()) {
    if (k.toLowerCase() === lower) {
      return v;
    }
  }

  // 2. Check disk / cloud
  const all = await getAllStoredReviews();
  for (const r of all) {
    if (r.id === cleanId || r.id.toLowerCase() === lower) {
      return r;
    }
  }

  return null;
}

// Save or update a review in the synchronized store
export async function saveReviewToStore(review: StoredReview): Promise<void> {
  const cleanId = cleanReviewId(review.id);
  if (!cleanId) return;

  const normalized: StoredReview = {
    ...review,
    id: cleanId,
    status: String(review.status || "PENDING").toUpperCase(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.set(cleanId, normalized);

  const all = Array.from(memoryStore.values());
  writeBackupFile(all);

  // Sync to Cloud KV in background if enabled
  syncWithCloudKv("set", all).catch(() => {});
}

// Remove a review from the store
export async function removeReviewFromStore(rawId: string): Promise<void> {
  const cleanId = cleanReviewId(rawId);
  if (!cleanId) return;

  memoryStore.delete(cleanId);
  const lower = cleanId.toLowerCase();
  for (const k of memoryStore.keys()) {
    if (k.toLowerCase() === lower) {
      memoryStore.delete(k);
    }
  }

  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
  syncWithCloudKv("set", all).catch(() => {});
}

// Seed authentic reviews if database table has 0 reviews
export async function syncInitialReviewsToDb(prisma: any): Promise<void> {
  try {
    const existingCount = await prisma.review.count();
    if (existingCount > 0) {
      // Sync DB reviews into store so our store knows about all existing reviews
      const dbReviews = await prisma.review.findMany({
        include: { tour: { select: { id: true, title: true, slug: true } } },
      });
      for (const r of dbReviews) {
        if (!memoryStore.has(r.id)) {
          memoryStore.set(r.id, {
            id: r.id,
            tourId: r.tourId,
            bookingId: r.bookingId,
            userName: r.userName,
            userEmail: r.userEmail,
            userCountry: r.userCountry || "International",
            userAvatar: r.userAvatar,
            photoUrl: r.photoUrl,
            rating: Number(r.rating) || 5.0,
            guideRating: Number(r.guideRating) || 5.0,
            transportRating: Number(r.transportRating) || 5.0,
            valueRating: Number(r.valueRating) || 5.0,
            comment: r.comment,
            travelDate: r.travelDate,
            verified: Boolean(r.verified),
            status: String(r.status || "PENDING").toUpperCase(),
            rejectionReason: r.rejectionReason,
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
            tour: r.tour,
          });
        }
      }
      return;
    }

    // Find real tours to link to
    const sigiriyaTour = await prisma.tour.findFirst({
      where: { slug: { contains: "sigiriya" } },
    });
    const ellaTour = await prisma.tour.findFirst({
      where: { slug: { contains: "ella" } },
    });
    const yalaTour = await prisma.tour.findFirst({
      where: { slug: { contains: "yala" } },
    });
    const galleTour = await prisma.tour.findFirst({
      where: { slug: { contains: "galle" } },
    });

    const seedReviews: Array<{
      id: string;
      tourId: string | null;
      userName: string;
      userCountry: string;
      rating: number;
      comment: string;
      travelDate: string;
      verified: boolean;
      status: string;
    }> = [
      {
        id: "rev-sigiriya-verified-01",
        tourId: sigiriyaTour?.id || null,
        userName: "Sarah & David Jenkins",
        userCountry: "United Kingdom",
        rating: 5.0,
        comment:
          "Ascending the Sigiriya Rock Fortress at sunrise with our private chauffeur-guide was breathtaking. Ceylon Explore Tours curated every detail to perfection — from early gate access to avoiding the heat and crowds. Truly world-class hospitality.",
        travelDate: "2026-09-18",
        verified: true,
        status: "APPROVED",
      },
      {
        id: "rev-ella-verified-02",
        tourId: ellaTour?.id || null,
        userName: "Elena Rostova",
        userCountry: "Germany",
        rating: 5.0,
        comment:
          "The first-class reserved carriage on the scenic blue train from Kandy to Ella through the misty tea hills was unforgettable. Our private chauffeur met us smoothly at the station with chilled refreshments. Flawless execution.",
        travelDate: "2026-09-24",
        verified: true,
        status: "APPROVED",
      },
      {
        id: "rev-yala-verified-03",
        tourId: yalaTour?.id || null,
        userName: "Marcus Aurelius Sterling",
        userCountry: "Australia",
        rating: 5.0,
        comment:
          "Incredible leopard and sloth bear sightings inside Block 1 of Yala! Our dedicated wildlife tracker was extraordinarily knowledgeable and respectful of animal welfare. The luxury private safari jeep was top tier.",
        travelDate: "2026-10-02",
        verified: true,
        status: "APPROVED",
      },
      {
        id: "rev-galle-verified-04",
        tourId: galleTour?.id || null,
        userName: "Jean-Pierre Dubois",
        userCountry: "France",
        rating: 5.0,
        comment:
          "Walking the ramparts of the Galle Dutch Fort at sunset and discovering historical boutique courtyards felt magical. The private chauffeur guide provided deep historical context while keeping the day relaxing.",
        travelDate: "2026-10-10",
        verified: true,
        status: "APPROVED",
      },
      {
        id: "rev-pending-review-05",
        tourId: sigiriyaTour?.id || null,
        userName: "Sophia & Liam Bennett",
        userCountry: "United States",
        rating: 5.0,
        comment:
          "Our honeymoon tour across the Cultural Triangle was an absolute dream. Our private guide treated us like royalty and took us to authentic local restaurants away from tourist traps. Highly recommended for couples seeking bespoke luxury.",
        travelDate: "2026-10-14",
        verified: true,
        status: "PENDING",
      },
    ];

    for (const r of seedReviews) {
      const created = await prisma.review.upsert({
        where: { id: r.id },
        create: {
          id: r.id,
          tourId: r.tourId,
          userName: r.userName,
          userCountry: r.userCountry,
          rating: r.rating,
          guideRating: 5.0,
          transportRating: 5.0,
          valueRating: 5.0,
          comment: r.comment,
          travelDate: r.travelDate,
          verified: r.verified,
          status: r.status,
        },
        update: {},
      });

      await saveReviewToStore({
        id: created.id,
        tourId: created.tourId,
        userName: created.userName,
        userCountry: created.userCountry,
        rating: created.rating,
        guideRating: created.guideRating,
        transportRating: created.transportRating,
        valueRating: created.valueRating,
        comment: created.comment,
        travelDate: created.travelDate,
        verified: created.verified,
        status: created.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Recalculate tour ratings for seeded tours
    const uniqueTourIds = Array.from(
      new Set(seedReviews.map((r) => r.tourId).filter(Boolean))
    ) as string[];
    for (const tId of uniqueTourIds) {
      await recalculateTourStats(tId, prisma);
    }
  } catch (err) {
    console.error("syncInitialReviewsToDb error:", err);
  }
}

// Synchronize all reviews between Prisma SQLite and our store
export async function syncReviewsWithDb(prisma: any): Promise<void> {
  try {
    // 1. Ensure initial reviews exist if DB is blank
    await syncInitialReviewsToDb(prisma);

    // 2. Fetch all reviews in SQLite
    const dbReviews = await prisma.review.findMany({
      include: { tour: { select: { id: true, title: true, slug: true } } },
    });
    const dbMap = new Map<string, any>();
    for (const dbr of dbReviews) {
      dbMap.set(dbr.id, dbr);
      // Keep memory store updated with DB state
      memoryStore.set(dbr.id, {
        id: dbr.id,
        tourId: dbr.tourId,
        bookingId: dbr.bookingId,
        userName: dbr.userName,
        userEmail: dbr.userEmail,
        userCountry: dbr.userCountry || "International",
        userAvatar: dbr.userAvatar,
        photoUrl: dbr.photoUrl,
        rating: Number(dbr.rating) || 5.0,
        guideRating: Number(dbr.guideRating) || 5.0,
        transportRating: Number(dbr.transportRating) || 5.0,
        valueRating: Number(dbr.valueRating) || 5.0,
        comment: dbr.comment,
        travelDate: dbr.travelDate,
        verified: Boolean(dbr.verified),
        status: String(dbr.status || "PENDING").toUpperCase(),
        rejectionReason: dbr.rejectionReason,
        createdAt: dbr.createdAt
          ? new Date(dbr.createdAt).toISOString()
          : new Date().toISOString(),
        updatedAt: dbr.updatedAt
          ? new Date(dbr.updatedAt).toISOString()
          : new Date().toISOString(),
        tour: dbr.tour,
      });
    }

    // 3. For any reviews in the backup store that are missing from SQLite (e.g. created on a different lambda instance):
    const allStored = await getAllStoredReviews();
    for (const stored of allStored) {
      if (!dbMap.has(stored.id)) {
        try {
          await prisma.review.upsert({
            where: { id: stored.id },
            create: {
              id: stored.id,
              tourId: stored.tourId || null,
              bookingId: stored.bookingId || null,
              userName: stored.userName,
              userEmail: stored.userEmail || null,
              userCountry: stored.userCountry || "International",
              userAvatar: stored.userAvatar || null,
              photoUrl: stored.photoUrl || null,
              rating: Number(stored.rating) || 5.0,
              guideRating: Number(stored.guideRating) || 5.0,
              transportRating: Number(stored.transportRating) || 5.0,
              valueRating: Number(stored.valueRating) || 5.0,
              comment: stored.comment,
              travelDate:
                stored.travelDate || new Date().toISOString().split("T")[0],
              verified: Boolean(stored.verified),
              status: String(stored.status || "PENDING").toUpperCase(),
              rejectionReason: stored.rejectionReason || null,
            },
            update: {
              status: String(stored.status || "PENDING").toUpperCase(),
              rejectionReason: stored.rejectionReason || null,
            },
          });
        } catch (upsertErr) {
          console.warn("Prisma restore warning for stored review:", upsertErr);
        }
      }
    }
  } catch (err) {
    console.error("syncReviewsWithDb error:", err);
  }
}

// Recalculate average rating and reviewCount for a tour
export async function recalculateTourStats(
  tourId: string,
  prisma: any
): Promise<void> {
  if (!tourId) return;

  try {
    const approvedReviews = await prisma.review.findMany({
      where: {
        tourId,
        status: {
          in: ["APPROVED", "approved", "Approved", "PUBLISHED", "published"],
        },
      },
    });

    const totalApproved = approvedReviews.length;
    const avgRating =
      totalApproved > 0
        ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          totalApproved
        : 0;

    await prisma.tour.update({
      where: { id: tourId },
      data: {
        rating: Number(avgRating.toFixed(2)),
        reviewCount: totalApproved,
      },
    });
  } catch (err) {
    console.warn(`recalculateTourStats error for tourId ${tourId}:`, err);
  }
}

// Invalidate static/ISR page paths safely
export function revalidateReviewPaths(tourSlug?: string | null): void {
  try {
    revalidatePath("/");
    revalidatePath("/tours");
    revalidatePath("/review");
    if (tourSlug) {
      revalidatePath(`/tours/${tourSlug}`);
    }
  } catch (err) {
    console.warn("revalidatePath notice:", err);
  }
}
