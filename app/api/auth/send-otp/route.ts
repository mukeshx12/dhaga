import { NextRequest, NextResponse } from "next/server";
import { twilioClient, verifyServiceSid } from "@/lib/otp/twilio";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    console.log("===== TWILIO DEBUG =====");
    console.log("Phone:", phone);
    console.log("Account SID:", process.env.TWILIO_ACCOUNT_SID);
    console.log("Verify SID ENV:", process.env.TWILIO_VERIFY_SERVICE_SID);
    console.log("verifyServiceSid:", verifyServiceSid);
    console.log("Verify SID Length:", verifyServiceSid?.length);

    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    return NextResponse.json({
      success: true,
      status: verification.status,
    });
  } catch (error: any) {
    console.error("FULL ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}