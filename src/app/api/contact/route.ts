import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveInquiryToStore } from "@/lib/inquiriesStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      country,
      travelDate,
      travellers,
      message,
      honeypot,
    } = body;

    // Anti-spam honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Inquiry received" });
    }

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full Name, Email, and Message are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save inquiry to CustomTripRequest in DB and persistent store
    const newInquiry = await prisma.customTripRequest.create({
      data: {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "Not provided",
        country: country ? country.trim() : "International",
        travelDates: travelDate || "Flexible",
        duration: "Standard Contact Inquiry",
        budget: "Inquiry",
        travelers: travellers ? String(travellers) : "1",
        accommodation: "Standard",
        transportation: "Inquiry",
        destinations: "General Inquiry",
        interests: "General Contact",
        specialNotes: message.trim(),
        status: "NEW",
      },
    });

    await saveInquiryToStore({
      id: newInquiry.id,
      name: newInquiry.name,
      email: newInquiry.email,
      phone: newInquiry.phone,
      country: newInquiry.country,
      travelDates: newInquiry.travelDates,
      duration: newInquiry.duration,
      budget: newInquiry.budget,
      travelers: newInquiry.travelers,
      accommodation: newInquiry.accommodation,
      transportation: newInquiry.transportation,
      destinations: newInquiry.destinations,
      interests: newInquiry.interests,
      specialNotes: newInquiry.specialNotes,
      status: "NEW",
      createdAt: newInquiry.createdAt ? new Date(newInquiry.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: newInquiry.updatedAt ? new Date(newInquiry.updatedAt).toISOString() : new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: newInquiry.id,
      message: "Thank you! Your inquiry has been sent successfully. Our local team will respond within 2-4 hours.",
    });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json(
      { error: "Failed to send message. Please reach out via WhatsApp or email directly." },
      { status: 500 }
    );
  }
}
