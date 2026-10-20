import fs from "fs";
import path from "path";

export interface StoredBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  readTime: string;
  featured: boolean;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

declare global {
  var __ceylonBlogCache: Map<string, StoredBlogPost> | undefined;
}

if (!global.__ceylonBlogCache) {
  global.__ceylonBlogCache = new Map<string, StoredBlogPost>();
}

const memoryStore = global.__ceylonBlogCache;

function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-blog-backup.json"),
    path.join(process.cwd(), "prisma", "blog-backup.json"),
    path.join(process.cwd(), "blog-backup.json"),
    path.join(__dirname, "..", "..", "prisma", "blog-backup.json"),
    path.join(__dirname, "blog-backup.json"),
  ];
}

export function readBackupFile(): StoredBlogPost[] {
  const map = new Map<string, StoredBlogPost>();
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

export function writeBackupFile(posts: StoredBlogPost[]): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf-8");
    } catch (e) {
      // ignore
    }
  }
}

export async function getAllStoredBlogPosts(): Promise<StoredBlogPost[]> {
  const disk = readBackupFile();
  for (const p of disk) {
    const existing = memoryStore.get(p.id);
    const diskTime = new Date(p.updatedAt || p.createdAt || 0).getTime();
    const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
    if (!existing || diskTime >= memTime) {
      memoryStore.set(p.id, p);
    }
  }
  return Array.from(memoryStore.values());
}

export async function saveBlogPostToStore(post: any): Promise<void> {
  if (!post || (!post.id && !post.slug)) return;
  const cleanId = String(post.id || post.slug).trim();
  const now = new Date().toISOString();

  const existing = memoryStore.get(cleanId);
  const normalized: StoredBlogPost = {
    ...existing,
    ...post,
    id: cleanId,
    title: post.title || existing?.title || "",
    slug: post.slug || existing?.slug || "",
    excerpt: post.excerpt || existing?.excerpt || "",
    content: post.content || existing?.content || "",
    image: post.image || existing?.image || "",
    category: post.category || existing?.category || "Travel Guide",
    author: post.author || existing?.author || "Ceylon Explore Tours Editorial",
    readTime: post.readTime || existing?.readTime || "5 min read",
    featured: post.featured !== undefined ? Boolean(post.featured) : (existing?.featured ?? false),
    status: post.status || existing?.status || "PUBLISHED",
    publishedAt: post.publishedAt || existing?.publishedAt || now,
    createdAt: existing?.createdAt || post.createdAt || now,
    updatedAt: now,
  };

  memoryStore.set(cleanId, normalized);
  const all = Array.from(memoryStore.values());
  writeBackupFile(all);
}

export async function syncBlogWithDb(prisma: any): Promise<void> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });

    const dbMap = new Map<string, any>();
    for (const p of dbPosts) {
      dbMap.set(p.id, p);
      const existing = memoryStore.get(p.id);
      const dbTime = new Date(p.updatedAt || p.createdAt || 0).getTime();
      const memTime = existing ? new Date(existing.updatedAt || existing.createdAt || 0).getTime() : 0;
      if (!existing || dbTime >= memTime) {
        memoryStore.set(p.id, {
          ...p,
          publishedAt: p.publishedAt?.toISOString?.() || String(p.publishedAt),
          createdAt: p.createdAt?.toISOString?.() || String(p.createdAt),
          updatedAt: p.updatedAt?.toISOString?.() || String(p.updatedAt),
        });
      }
    }

    const diskPosts = readBackupFile();
    for (const stored of diskPosts) {
      const dbPost = dbMap.get(stored.id);
      const storedTime = new Date(stored.updatedAt || stored.createdAt || 0).getTime();
      const dbTime = dbPost ? new Date(dbPost.updatedAt || dbPost.createdAt || 0).getTime() : 0;

      if (dbPost && storedTime > dbTime + 1000) {
        try {
          await prisma.blogPost.update({
            where: { id: stored.id },
            data: {
              title: stored.title,
              slug: stored.slug,
              excerpt: stored.excerpt,
              content: stored.content,
              image: stored.image,
              category: stored.category,
              author: stored.author,
              readTime: stored.readTime,
              featured: stored.featured,
              status: stored.status,
            },
          });
          memoryStore.set(stored.id, stored);
        } catch (err) {
          console.warn("Could not sync stored blog post to SQLite:", err);
        }
      }
    }

    const all = Array.from(memoryStore.values());
    writeBackupFile(all);
  } catch (err) {
    console.warn("syncBlogWithDb error:", err);
  }
}
