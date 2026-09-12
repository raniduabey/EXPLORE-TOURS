import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      phone,
      country,
      travelDates,
      duration,
      budget,
      travelers,
      accommodation,
      transportation,
      destinations,
      interests,
      specialNotes,
    } = await req.json();

    const tripReq = await prisma.customTripRequest.create({
      data: {
        name,
        email,
        phone,
        country: country || "Unknown",
        travelDates: travelDates || "Flexible",
        duration: duration || "7 Days",
        budget: budget || "Comfort",
        travelers: travelers || "2 Adults",
        accommodation: accommodation || "Boutique",
        transportation: transportation || "Private AC Vehicle",
        destinations: destinations || "[]",
        interests: interests || "[]",
        specialNotes,
      },
    });

    return NextResponse.json({ success: true, id: tripReq.id });
  } catch (error) {
    console.error("Trip planner API error", error);
    return NextResponse.json({ error: "Failed to save trip request" }, { status: 500 });
  }
}
