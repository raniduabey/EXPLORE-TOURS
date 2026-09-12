import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { id, title, price, primaryImage } = await req.json();

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        title,
        price: Number(price),
      },
    });

    if (primaryImage) {
      const primary = await prisma.tourImage.findFirst({
        where: { tourId: id, isPrimary: true },
      });
      if (primary) {
        await prisma.tourImage.update({
          where: { id: primary.id },
          data: { url: primaryImage },
        });
      } else {
        await prisma.tourImage.create({
          data: {
            tourId: id,
            url: primaryImage,
            isPrimary: true,
          },
        });
      }
    }

    return NextResponse.json({ success: true, tour });
  } catch (error) {
    console.error("Update tour image admin error", error);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}
