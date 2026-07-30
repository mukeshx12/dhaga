import { twilioClient, verifyServiceSid } from "./twilio";

export async function verifyOtp(phone: string, otp: string) {
  try {
    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    return verification.status === "approved";
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return false;
  }
}