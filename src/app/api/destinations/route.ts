import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncDestinationsWithDb, getAllStoredDestinations } from "@/lib/destinationsStore";
import { DESTINATIONS_CATALOG } from "@/data/destinationsData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Synchronize across serverless environments
    await syncDestinationsWithDb(prisma);

    let destinations: any[] = [];
    try {
      destinations = await prisma.destination.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { name: "asc" },
      });
    } catch (e) {
      console.warn("Prisma destinations query error:", e);
    }

    if (!destinations || destinations.length === 0) {
      const stored = await getAllStoredDestinations();
      if (stored && stored.length > 0) {
        destinations = stored.filter((d) => d.status === "PUBLISHED");
      }
    }

    if (!destinations || destinations.length === 0) {
      destinations = DESTINATIONS_CATALOG;
    }

    return NextResponse.json(destinations, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Public destinations API error:", error);
    return NextResponse.json(DESTINATIONS_CATALOG);
  }
}
