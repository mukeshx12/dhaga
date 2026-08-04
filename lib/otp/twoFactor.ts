import { createHmac, timingSafeEqual } from "node:crypto";

const TWO_FACTOR_API_BASE = "https://2factor.in/API/V1";
const CHALLENGE_TTL_MS = 10 * 60 * 1000;

type TwoFactorResponse = {
  Status?: string;
  Details?: string;
};

type ChallengePayload = {
  phone: string;
  sessionId: string;
  expiresAt: number;
};

function getApiKey() {
  const apiKey = process.env.TWO_FACTOR_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("TWO_FACTOR_API_KEY is not configured.");
  }

  return apiKey;
}

function getChallengeSecret() {
  const secret =
    process.env.OTP_CHALLENGE_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("OTP_CHALLENGE_SECRET or NEXTAUTH_SECRET is required.");
  }

  return secret;
}

function indianSubscriberNumber(phone: string) {
  if (!/^\+91\d{10}$/.test(phone)) {
    throw new Error("Enter a valid Indian phone number.");
  }

  return phone.slice(3);
}

async function callTwoFactor(path: string): Promise<TwoFactorResponse> {
  const response = await fetch(
    `${TWO_FACTOR_API_BASE}/${encodeURIComponent(getApiKey())}/${path}`,
    {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    }
  );

  const data = (await response.json().catch(() => ({}))) as TwoFactorResponse;

  if (!response.ok || data.Status?.toLowerCase() !== "success") {
    throw new Error(data.Details || "The OTP provider rejected the request.");
  }

  return data;
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getChallengeSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function createChallenge(phone: string, sessionId: string) {
  const payload: ChallengePayload = {
    phone,
    sessionId,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

function readChallenge(challenge: string, phone: string) {
  const [encodedPayload, suppliedSignature] = challenge.split(".");

  if (!encodedPayload || !suppliedSignature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);

  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as ChallengePayload;

    if (
      payload.phone !== phone ||
      !payload.sessionId ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function sendOtp(phone: string) {
  const subscriberNumber = indianSubscriberNumber(phone);
  const templateName = process.env.TWO_FACTOR_TEMPLATE_NAME?.trim();
  const templatePath = templateName
    ? `/AUTOGEN/${encodeURIComponent(templateName)}`
    : "/AUTOGEN";
  const data = await callTwoFactor(
    `SMS/${encodeURIComponent(subscriberNumber)}${templatePath}`
  );

  if (!data.Details) {
    throw new Error("The OTP provider did not return a session ID.");
  }

  return {
    challenge: createChallenge(phone, data.Details),
  };
}

export async function verifyOtp(
  phone: string,
  otp: string,
  challenge: string
) {
  if (!/^\d{4,6}$/.test(otp)) {
    return false;
  }

  const payload = readChallenge(challenge, phone);

  if (!payload) {
    return false;
  }

  try {
    await callTwoFactor(
      `SMS/VERIFY/${encodeURIComponent(payload.sessionId)}/${encodeURIComponent(otp)}`
    );
    return true;
  } catch (error) {
    console.warn(
      "2Factor OTP verification failed:",
      error instanceof Error ? error.message : "Unknown provider error"
    );
    return false;
  }
}
