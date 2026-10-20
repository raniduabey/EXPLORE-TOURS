import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";
import {
  syncContentWithDb,
  saveFaqToStore,
  deleteFaqFromStore,
  saveSlideToStore,
} from "@/lib/contentStore";

export const dynamic = "force-dynamic";

// GET /api/admin/content - fetch faqs, hero slides and key-value content
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // Synchronize across serverless containers and persistent store
    await syncContentWithDb(prisma);

    if (type === "faqs") {
      const faqs = await prisma.faqItem.findMany({
        orderBy: { orderIndex: "asc" },
      });
      return NextResponse.json(faqs);
    }

    if (type === "slides") {
      const slides = await prisma.heroSlide.findMany({
        orderBy: { orderIndex: "asc" },
      });
      return NextResponse.json(slides);
    }

    const content = await prisma.websiteContent.findMany();
    return NextResponse.json(content);
  } catch (error) {
    console.error("GET /api/admin/content error", error);
    return NextResponse.json({ error: "Failed to fetch website content" }, { status: 500 });
  }
}

// POST /api/admin/content - create or update faq or slide
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("ceylon_admin_token")?.value;
    const auth = verifyAdminToken(token || "");

    if (!auth.valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncContentWithDb(prisma);

    const body = await req.json();
    const { type, ...data } = body;

    if (type === "faq") {
      const { id, question, answer, category, orderIndex, active } = data;
      if (id) {
        const updated = await prisma.faqItem.update({
          where: { id },
          data: {
            question,
            answer,
            category: category || "General",
            orderIndex: Number(orderIndex) || 0,
            active: active !== false,
          },
        });
        await saveFaqToStore(updated);
        try {
          revalidatePath("/", "page");
          revalidatePath("/faq", "page");
          revalidatePath("/admin", "page");
        } catch (e) {}
        return NextResponse.json({ success: true, faq: updated });
      } else {
        const created = await prisma.faqItem.create({
          data: {
            question,
            answer,
            category: category || "General",
            orderIndex: Number(orderIndex) || 0,
            active: active !== false,
          },
        });
        await saveFaqToStore(created);
        try {
          revalidatePath("/", "page");
          revalidatePath("/faq", "page");
          revalidatePath("/admin", "page");
        } catch (e) {}
        return NextResponse.json({ success: true, faq: created });
      }
    }

    if (type === "setting") {
      const { key, value, category } = data;
      const setting = await prisma.websiteContent.upsert({
        where: { key },
        update: { value: String(value), category: category || "general" },
        create: { key, value: String(value), category: category || "general" },
      });
      try {
        revalidatePath("/", "page");
        revalidatePath("/admin", "page");
      } catch (e) {}
      return NextResponse.json({ success: true, setting });
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/content error", error);
    return NextResponse.json({ error: "Failed to save website content" }, { status: 500 });
  }
}

// DELETE /api/admin/content - delete faq
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
    const type = searchParams.get("type");

    if (type === "faq" && id) {
      await prisma.faqItem.delete({ where: { id } });
      await deleteFaqFromStore(id);
      try {
        revalidatePath("/", "page");
        revalidatePath("/faq", "page");
        revalidatePath("/admin", "page");
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
  } catch (error) {
    console.error("DELETE /api/admin/content error", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
