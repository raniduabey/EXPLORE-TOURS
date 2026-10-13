import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/admin/blog error", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, image, category, author, readTime, featured, status } =
      body;

    if (!title || !image) {
      return NextResponse.json({ error: "Title and cover image required" }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: excerpt || "",
        content: content || excerpt || "",
        image,
        category: category || "Travel Guide",
        author: author || "Ceylon Explore Tours Editorial",
        readTime: readTime || "5 min read",
        featured: Boolean(featured),
        status: status || "PUBLISHED",
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: auth.payload?.sub || "admin@ceylonexploretours.com",
          action: "CREATE_BLOG_POST",
          entityType: "BlogPost",
          entityId: post.id,
          details: `Created blog article: ${post.title}`,
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("POST /api/admin/blog error", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      author,
      readTime,
      featured,
      status,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(slug && { slug: slug.trim() }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(image && { image }),
        ...(category && { category }),
        ...(author && { author }),
        ...(readTime && { readTime }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("PUT /api/admin/blog error", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/blog error", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
