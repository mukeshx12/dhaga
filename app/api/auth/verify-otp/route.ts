import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp/verifyOtp";
import { normalizeIndianPhone } from "@/lib/phone/india";

export async function POST(req: NextRequest) {
  try {
    const { phone: suppliedPhone, otp, challenge } = await req.json();
    const phone = normalizeIndianPhone(typeof suppliedPhone === "string" ? suppliedPhone : "");

    if (!phone || !otp || !challenge) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone, OTP and challenge are required",
        },
        { status: 400 }
      );
    }

    const approved = await verifyOtp(phone, otp, challenge);

    return NextResponse.json({
      success: approved,
      status: approved ? "approved" : "denied",
    });
  } catch (error) {
    console.error("Verify OTP route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify OTP.",
      },
      { status: 500 }
    );
  }
}
