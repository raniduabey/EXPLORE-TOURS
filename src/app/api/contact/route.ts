import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Save inquiry to CustomTripRequest or inquiries table in DB
    try {
      await prisma.customTripRequest.create({
        data: {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : "",
          country: country ? country.trim() : "Not specified",
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
    } catch (dbErr) {
      console.error("Database save failed for contact inquiry", dbErr);
    }

    return NextResponse.json({
      success: true,
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
