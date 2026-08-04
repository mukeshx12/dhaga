import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp/twoFactor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone =
      typeof body.phone === "string"
        ? body.phone.replace(/\s+/g, "").trim()
        : "";

    if (!/^\+91\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid Indian phone number." },
        { status: 400 }
      );
    }

    const { challenge } = await sendOtp(phone);

    return NextResponse.json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error(
      "Send OTP error:",
      error instanceof Error ? error.message : "Unknown provider error"
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send OTP right now. Please try again shortly.",
      },
      { status: 502 }
    );
  }
}
