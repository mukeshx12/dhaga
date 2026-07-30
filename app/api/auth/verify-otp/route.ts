import { NextRequest, NextResponse } from "next/server";
import { twilioClient, verifyServiceSid } from "@/lib/otp/twilio";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and OTP are required",
        },
        { status: 400 }
      );
    }

    const verificationCheck = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    return NextResponse.json({
      success: verificationCheck.status === "approved",
      status: verificationCheck.status,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}