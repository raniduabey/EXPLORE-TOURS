import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  id: "default",
  companyName: siteConfig.name || "Ceylon Explore Tours",
  address: `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
  email: siteConfig.contact.email || "info@ceylonexploretours.com",
  primaryPhone: siteConfig.contact.phone || "+94 77 123 4567",
  secondaryPhone: "+94 11 234 5678",
  whatsapp: siteConfig.contact.whatsapp || "+94 77 123 4567",
  mapsUrl: "https://maps.google.com/?q=No.+45+Temple+Road+Colombo+03+Sri+Lanka",
  operatingHours: siteConfig.contact.operatingHours || "Mon - Sun: 06:00 AM - 10:00 PM (24/7 Hotline)",
};

// GET /api/business-settings - Public endpoint to retrieve current business contact details
export async function GET() {
  try {
    let settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      // Create default if not yet created
      settings = await prisma.businessSettings.create({
        data: DEFAULT_SETTINGS,
      });
    }

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/business-settings error:", error);
    // Return graceful fallback so public pages never break
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

// PUT /api/business-settings - Admin endpoint to update contact information
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      address,
      email,
      primaryPhone,
      secondaryPhone,
      whatsapp,
      mapsUrl,
      operatingHours,
    } = body;

    // Validation
    if (!address || address.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid physical business address (minimum 5 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid business email address (e.g. info@ceylonexploretours.com)." },
        { status: 400 }
      );
    }

    if (!primaryPhone || primaryPhone.trim().length < 7) {
      return NextResponse.json(
        { error: "Please provide a valid primary phone number." },
        { status: 400 }
      );
    }

    if (!whatsapp || whatsapp.trim().length < 7) {
      return NextResponse.json(
        { error: "Please provide a valid WhatsApp contact number with country code." },
        { status: 400 }
      );
    }

    const updated = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: {
        companyName: (companyName || DEFAULT_SETTINGS.companyName).trim(),
        address: address.trim(),
        email: email.trim().toLowerCase(),
        primaryPhone: primaryPhone.trim(),
        secondaryPhone: secondaryPhone ? secondaryPhone.trim() : "",
        whatsapp: whatsapp.trim(),
        mapsUrl: mapsUrl ? mapsUrl.trim() : DEFAULT_SETTINGS.mapsUrl,
        operatingHours: (operatingHours || DEFAULT_SETTINGS.operatingHours).trim(),
      },
      create: {
        id: "default",
        companyName: (companyName || DEFAULT_SETTINGS.companyName).trim(),
        address: address.trim(),
        email: email.trim().toLowerCase(),
        primaryPhone: primaryPhone.trim(),
        secondaryPhone: secondaryPhone ? secondaryPhone.trim() : "",
        whatsapp: whatsapp.trim(),
        mapsUrl: mapsUrl ? mapsUrl.trim() : DEFAULT_SETTINGS.mapsUrl,
        operatingHours: (operatingHours || DEFAULT_SETTINGS.operatingHours).trim(),
      },
    });

    // Record audit log
    try {
      await prisma.auditLog.create({
        data: {
          adminEmail: "admin@ceylonexploretours.com",
          action: "UPDATE_BUSINESS_SETTINGS",
          entityType: "BusinessSettings",
          entityId: "default",
          details: `Updated contact settings: email=${email}, primaryPhone=${primaryPhone}, whatsapp=${whatsapp}`,
        },
      });
    } catch (e) {
      // audit log failure non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Business information and contact settings successfully updated.",
      settings: updated,
    });
  } catch (error) {
    console.error("PUT /api/business-settings error:", error);
    return NextResponse.json(
      { error: "Failed to update business contact information. Please try again." },
      { status: 500 }
    );
  }
}
