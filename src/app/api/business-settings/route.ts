import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import {
  syncSettingsWithDb,
  saveSettingsToStore,
  getStoredSettings,
} from "@/lib/settingsStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    await syncSettingsWithDb(prisma);

    let settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await getStoredSettings();
    }

    return NextResponse.json(settings || DEFAULT_SETTINGS, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET /api/business-settings error:", error);
    const stored = await getStoredSettings().catch(() => DEFAULT_SETTINGS);
    return NextResponse.json(stored);
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
    if (!companyName || !companyName.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }
    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: "Business address is required." },
        { status: 400 }
      );
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid business email address is required." },
        { status: 400 }
      );
    }
    if (!primaryPhone || !primaryPhone.trim()) {
      return NextResponse.json(
        { error: "Primary telephone number is required." },
        { status: 400 }
      );
    }
    if (!whatsapp || !whatsapp.trim()) {
      return NextResponse.json(
        { error: "WhatsApp contact number is required." },
        { status: 400 }
      );
    }

    const updated = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: {
        companyName: companyName.trim(),
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

    try {
      await saveSettingsToStore(updated);
      revalidatePath("/", "page");
      revalidatePath("/contact", "page");
      revalidatePath("/admin", "page");
    } catch (e) {}

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
    } catch (e) {}

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
