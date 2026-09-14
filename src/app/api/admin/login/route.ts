import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminToken,
  checkLoginRateLimit,
  resetLoginAttempts,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const rateCheck = checkLoginRateLimit(ip);

    if (!rateCheck.allowed) {
      const mins = Math.ceil((rateCheck.waitTimeMs || 60000) / 60000);
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${mins} minutes before trying again.`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    // Reset rate limits upon successful login
    resetLoginAttempts(ip);

    const token = createAdminToken(email, "SUPER_ADMIN");

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
    });

    response.cookies.set({
      name: "ceylon_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login API error", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
