import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveInquiryToStore, findRecentDuplicateInquiry } from "@/lib/inquiriesStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
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
    } = body;

    // Strict validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanNotes = specialNotes ? String(specialNotes).trim() : null;

    // Idempotency protection: Prevent duplicate submissions within 60s
    const duplicate = await findRecentDuplicateInquiry(cleanEmail, cleanNotes, 60);
    if (duplicate) {
      return NextResponse.json({
        success: true,
        id: duplicate.id,
        message: "Your itinerary request was already received and is being processed by our travel curators.",
        duplicate: true,
      });
    }

    // Normalize all required string fields to avoid Prisma SQLite constraint exceptions
    const normalizedPhone = (phone && typeof phone === "string" ? phone.trim() : "") || "Not provided";
    const normalizedCountry = (country && typeof country === "string" ? country.trim() : "") || "International";
    const normalizedTravelDates = (travelDates && typeof travelDates === "string" ? travelDates.trim() : "") || "Flexible";
    const normalizedDuration = (duration && typeof duration === "string" ? duration.trim() : "") || "Custom Itinerary";
    const normalizedBudget = (budget && typeof budget === "string" ? budget.trim() : "") || "Comfort";
    const normalizedTravelers = (travelers && typeof travelers === "string" ? travelers.trim() : "") || "2 Adults";
    const normalizedAccommodation = (accommodation && typeof accommodation === "string" ? accommodation.trim() : "") || "Boutique & Heritage";
    const normalizedTransportation = (transportation && typeof transportation === "string" ? transportation.trim() : "") || "Private AC Vehicle";
    const normalizedDestinations = typeof destinations === "object" && destinations !== null
      ? JSON.stringify(destinations)
      : String(destinations || "[]");
    const normalizedInterests = typeof interests === "object" && interests !== null
      ? JSON.stringify(interests)
      : String(interests || "[]");

    // Insert into persistent database
    const tripReq = await prisma.customTripRequest.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: normalizedPhone,
        country: normalizedCountry,
        travelDates: normalizedTravelDates,
        duration: normalizedDuration,
        budget: normalizedBudget,
        travelers: normalizedTravelers,
        accommodation: normalizedAccommodation,
        transportation: normalizedTransportation,
        destinations: normalizedDestinations,
        interests: normalizedInterests,
        specialNotes: cleanNotes,
        status: "NEW",
      },
    });

    // Also persist to cross-lambda store
    await saveInquiryToStore({
      id: tripReq.id,
      name: tripReq.name,
      email: tripReq.email,
      phone: tripReq.phone,
      country: tripReq.country,
      travelDates: tripReq.travelDates,
      duration: tripReq.duration,
      budget: tripReq.budget,
      travelers: tripReq.travelers,
      accommodation: tripReq.accommodation,
      transportation: tripReq.transportation,
      destinations: tripReq.destinations,
      interests: tripReq.interests,
      specialNotes: tripReq.specialNotes,
      status: "NEW",
      createdAt: tripReq.createdAt ? new Date(tripReq.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: tripReq.updatedAt ? new Date(tripReq.updatedAt).toISOString() : new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: tripReq.id,
      message: "Itinerary request confirmed and safely stored.",
    });
  } catch (error: any) {
    console.error("Trip planner API error:", error);
    return NextResponse.json(
      { error: "Database error saving itinerary request. Please try again." },
      { status: 500 }
    );
  }
}
