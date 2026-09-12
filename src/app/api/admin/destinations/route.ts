import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Fetch destinations admin error", error);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, shortDesc, image, startingPrice } = await req.json();

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name,
        shortDesc,
        image,
        startingPrice: Number(startingPrice),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update destination admin error", error);
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}
