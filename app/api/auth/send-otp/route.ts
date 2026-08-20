import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp/twoFactor";
import { consumeOtpLimit } from "@/lib/otp/rateLimit";
import { normalizeIndianPhone } from "@/lib/phone/india";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone =
      typeof body.phone === "string"
        ? body.phone
        : "";
    const phone = normalizeIndianPhone(rawPhone);
    const purpose = body.purpose === "login" || body.purpose === "register" || body.purpose === "profile"
      ? body.purpose
      : null;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Enter a valid Indian phone number." },
        { status: 400 }
      );
    }

    if (purpose === "login" || purpose === "register") {
      const existingUser = await prisma.user.findUnique({
        where: { phone },
        select: { id: true, accountStatus: true },
      });

      if (purpose === "login" && !existingUser) {
        return NextResponse.json(
          { success: false, message: "No account exists with this phone number. Please register first." },
          { status: 404 },
        );
      }

      if (purpose === "login" && existingUser?.accountStatus !== "ACTIVE") {
        return NextResponse.json(
          { success: false, message: "This account has been suspended." },
          { status: 403 },
        );
      }

      if (purpose === "register" && existingUser) {
        return NextResponse.json(
          { success: false, message: "An account already exists with this phone number. Please login." },
          { status: 409 },
        );
      }
    }

    if (purpose === "profile") {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Please sign in again." }, { status: 401 });
      }
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")?.trim()
      || "unknown";
    if (!(await consumeOtpLimit(phone, ip))) {
      return NextResponse.json(
        { success: false, message: "Too many OTP requests. Please wait 10 minutes and try again." },
        { status: 429, headers: { "Retry-After": "600" } }
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
