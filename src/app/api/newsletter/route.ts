import { NextResponse } from "next/server";

// In-memory or fallback storage for newsletter subscribers
const subscribers: string[] = [];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!subscribers.includes(cleanEmail)) {
      subscribers.push(cleanEmail);
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully to Ceylon Explore Tours travel guides.",
    });
  } catch (error) {
    console.error("Newsletter API error", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
