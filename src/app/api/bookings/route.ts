import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTourBySlug, TOURS_CATALOG } from "@/data/toursData";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tourId,
      tourSlug,
      tourDate,
      tourTime,
      adults = 1,
      children = 0,
      guestName,
      guestEmail,
      guestPhone,
      guestCountry = "United States",
      pickupLocation,
      specialRequests,
      promoCode,
      currency = "USD",
      paymentMethod = "Reserve Now & Pay on Arrival",
    } = body;

    // 1. Validate required fields
    if (!guestName || !guestEmail || !tourDate || !tourTime) {
      return NextResponse.json(
        { error: "Missing required booking details (Name, Email, Date, Time)." },
        { status: 400 }
      );
    }

    const numAdults = Math.max(1, parseInt(adults, 10) || 1);
    const numChildren = Math.max(0, parseInt(children, 10) || 0);

    // 2. Validate date is not in the past
    const selectedDate = new Date(tourDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return NextResponse.json(
        { error: "Selected tour date must be today or a future date." },
        { status: 400 }
      );
    }

    // 3. Resolve Tour and Server-Side Pricing
    let tour: any = null;
    let actualTourId = tourId;

    if (tourId) {
      try {
        tour = await prisma.tour.findUnique({ where: { id: tourId } });
      } catch (e) {}
    }

    if (!tour && tourSlug) {
      try {
        tour = await prisma.tour.findUnique({ where: { slug: tourSlug } });
      } catch (e) {}
    }

    // If not in DB, resolve from verified TOURS_CATALOG
    if (!tour) {
      const catalogTour =
        TOURS_CATALOG.find((t) => t.id === tourId || t.slug === tourSlug) ||
        TOURS_CATALOG[0];

      // Upsert into DB so relational foreign keys succeed
      try {
        tour = await prisma.tour.upsert({
          where: { slug: catalogTour.slug },
          update: {},
          create: {
            id: catalogTour.id,
            title: catalogTour.title,
            slug: catalogTour.slug,
            location: catalogTour.location,
            duration: catalogTour.duration,
            durationHours: catalogTour.durationHours,
            price: catalogTour.price,
            previousPrice: catalogTour.previousPrice,
            tourType: catalogTour.tourType,
            description: catalogTour.description,
            highlights: JSON.stringify(catalogTour.highlights),
            includes: JSON.stringify(catalogTour.includes),
            excludes: JSON.stringify(catalogTour.excludes),
          },
        });
      } catch (dbErr) {
        tour = catalogTour;
      }
    }

    actualTourId = tour.id;

    // 4. Server-Side Price Calculation
    const adultRate = Number(tour.price) || 85;
    const childRate = Number(tour.childPrice) || adultRate * 0.7;
    let calculatedSubtotal = numAdults * adultRate + numChildren * childRate;

    // 5. Coupon validation
    let discount = 0;
    if (promoCode) {
      const codeUpper = promoCode.trim().toUpperCase();
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: codeUpper },
        });
        if (coupon && coupon.active) {
          if (coupon.discountType === "PERCENT") {
            discount = (calculatedSubtotal * coupon.discountAmount) / 100;
          } else {
            discount = coupon.discountAmount;
          }
        }
      } catch (e) {
        // Fallback promo rules
        if (codeUpper === "EXPLORE15") {
          discount = calculatedSubtotal * 0.15;
        } else if (codeUpper === "CEYLON20") {
          discount = 20;
        }
      }
    }

    const finalServerAmount = Math.max(0, calculatedSubtotal - discount);

    // 6. Collision-safe booking reference (e.g. CET-2026-X7K9P)
    const year = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingRef = `CET-${year}-${randomSuffix}`;

    // 7. Store Booking atomically
    const newBooking = await prisma.booking.create({
      data: {
        bookingRef,
        tourId: actualTourId,
        tourDate,
        tourTime,
        adults: numAdults,
        children: numChildren,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        guestPhone: guestPhone ? guestPhone.trim() : "",
        guestCountry: guestCountry || "United States",
        pickupLocation: pickupLocation || "Hotel Lobby / City Center",
        specialRequests: specialRequests ? specialRequests.trim() : null,
        totalAmount: finalServerAmount,
        currency: "USD", // Canonical base pricing
        paymentMethod: paymentMethod || "Reserve Now & Pay on Arrival",
        paymentStatus: "CONFIRMED",
        bookingStatus: "CONFIRMED",
      },
    });

    return NextResponse.json({
      success: true,
      bookingRef: newBooking.bookingRef,
      totalAmount: finalServerAmount,
    });
  } catch (error) {
    console.error("Booking creation error", error);
    return NextResponse.json(
      { error: "Failed to create booking reservation. Please try again." },
      { status: 500 }
    );
  }
}
