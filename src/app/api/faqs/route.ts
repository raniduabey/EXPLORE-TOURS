import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncContentWithDb, getAllStoredFaqs } from "@/lib/contentStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await syncContentWithDb(prisma);

    let faqs: any[] = [];
    try {
      faqs = await prisma.faqItem.findMany({
        where: { active: true },
        orderBy: { orderIndex: "asc" },
      });
    } catch (e) {
      console.warn("Prisma faqs query error:", e);
    }

    if (!faqs || faqs.length === 0) {
      faqs = await getAllStoredFaqs();
    }

    return NextResponse.json(faqs, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Public FAQs API error:", error);
    return NextResponse.json([]);
  }
}
