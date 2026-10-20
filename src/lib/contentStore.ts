import fs from "fs";
import path from "path";

export interface StoredFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoredSlide {
  id: string;
  tagline: string;
  headlineLine1: string;
  headlineHighlight: string;
  subtitle: string;
  image: string;
  mobileImage?: string | null;
  destination: string;
  ctaText: string;
  ctaLink: string;
  orderIndex: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoredContentState {
  faqs: StoredFaq[];
  slides: StoredSlide[];
  content: any[];
}

declare global {
  var __ceylonContentCache: StoredContentState | undefined;
}

if (!global.__ceylonContentCache) {
  global.__ceylonContentCache = { faqs: [], slides: [], content: [] };
}

const memoryStore = global.__ceylonContentCache;

function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-content-backup.json"),
    path.join(process.cwd(), "prisma", "content-backup.json"),
    path.join(process.cwd(), "content-backup.json"),
    path.join(__dirname, "..", "..", "prisma", "content-backup.json"),
    path.join(__dirname, "content-backup.json"),
  ];
}

export function readBackupFile(): StoredContentState {
  for (const filePath of getBackupPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
            slides: Array.isArray(parsed.slides) ? parsed.slides : [],
            content: Array.isArray(parsed.content) ? parsed.content : [],
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return { faqs: [], slides: [], content: [] };
}

export function writeBackupFile(state: StoredContentState): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
    } catch (e) {
      // ignore
    }
  }
}

export async function getAllStoredFaqs(): Promise<StoredFaq[]> {
  if (!memoryStore.faqs || memoryStore.faqs.length === 0) {
    const disk = readBackupFile();
    if (disk.faqs.length > 0) {
      memoryStore.faqs = disk.faqs;
    }
  }
  return memoryStore.faqs.filter((f) => f.active !== false);
}

export async function saveFaqToStore(faq: any): Promise<void> {
  const cleanId = String(faq.id || Date.now()).trim();
  const now = new Date().toISOString();

  const existingIdx = memoryStore.faqs.findIndex((f) => f.id === cleanId);
  const normalized: StoredFaq = {
    id: cleanId,
    question: faq.question || "",
    answer: faq.answer || "",
    category: faq.category || "General",
    orderIndex: Number(faq.orderIndex) || 0,
    active: faq.active !== false,
    updatedAt: now,
  };

  if (existingIdx >= 0) {
    memoryStore.faqs[existingIdx] = { ...memoryStore.faqs[existingIdx], ...normalized };
  } else {
    memoryStore.faqs.push(normalized);
  }

  writeBackupFile(memoryStore);
}

export async function deleteFaqFromStore(id: string): Promise<void> {
  memoryStore.faqs = memoryStore.faqs.filter((f) => f.id !== id);
  writeBackupFile(memoryStore);
}

export async function getAllStoredSlides(): Promise<StoredSlide[]> {
  if (!memoryStore.slides || memoryStore.slides.length === 0) {
    const disk = readBackupFile();
    if (disk.slides.length > 0) {
      memoryStore.slides = disk.slides;
    }
  }
  return memoryStore.slides.filter((s) => s.active !== false);
}

export async function saveSlideToStore(slide: any): Promise<void> {
  const cleanId = String(slide.id || Date.now()).trim();
  const now = new Date().toISOString();

  const existingIdx = memoryStore.slides.findIndex((s) => s.id === cleanId);
  const normalized: StoredSlide = {
    id: cleanId,
    tagline: slide.tagline || "Discover Sri Lanka",
    headlineLine1: slide.headlineLine1 || "Discover Sri Lanka,",
    headlineHighlight: slide.headlineHighlight || "Your Way.",
    subtitle: slide.subtitle || "",
    image: slide.image || "",
    mobileImage: slide.mobileImage || null,
    destination: slide.destination || "Sri Lanka",
    ctaText: slide.ctaText || "Explore Our Journeys",
    ctaLink: slide.ctaLink || "/tours",
    orderIndex: Number(slide.orderIndex) || 0,
    active: slide.active !== false,
    updatedAt: now,
  };

  if (existingIdx >= 0) {
    memoryStore.slides[existingIdx] = { ...memoryStore.slides[existingIdx], ...normalized };
  } else {
    memoryStore.slides.push(normalized);
  }

  writeBackupFile(memoryStore);
}

export async function deleteSlideFromStore(id: string): Promise<void> {
  memoryStore.slides = memoryStore.slides.filter((s) => s.id !== id);
  writeBackupFile(memoryStore);
}

export async function syncContentWithDb(prisma: any): Promise<void> {
  try {
    const [dbFaqs, dbSlides, dbContent] = await Promise.all([
      prisma.faqItem.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []),
      prisma.heroSlide.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []),
      prisma.websiteContent.findMany().catch(() => []),
    ]);

    if (dbFaqs.length > 0) memoryStore.faqs = dbFaqs;
    if (dbSlides.length > 0) memoryStore.slides = dbSlides;
    if (dbContent.length > 0) memoryStore.content = dbContent;

    const disk = readBackupFile();

    // Reconcile FAQs
    if (disk.faqs.length > 0 && dbFaqs.length === 0) {
      for (const f of disk.faqs) {
        try {
          await prisma.faqItem.create({
            data: {
              id: f.id,
              question: f.question,
              answer: f.answer,
              category: f.category,
              orderIndex: f.orderIndex,
              active: f.active,
            },
          });
        } catch (e) {}
      }
    }

    // Reconcile Slides
    if (disk.slides.length > 0 && dbSlides.length === 0) {
      for (const s of disk.slides) {
        try {
          await prisma.heroSlide.create({
            data: {
              id: s.id,
              tagline: s.tagline,
              headlineLine1: s.headlineLine1,
              headlineHighlight: s.headlineHighlight,
              subtitle: s.subtitle,
              image: s.image,
              mobileImage: s.mobileImage,
              destination: s.destination,
              ctaText: s.ctaText,
              ctaLink: s.ctaLink,
              orderIndex: s.orderIndex,
              active: s.active,
            },
          });
        } catch (e) {}
      }
    }

    writeBackupFile(memoryStore);
  } catch (err) {
    console.warn("syncContentWithDb error:", err);
  }
}
