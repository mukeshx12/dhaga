import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const publicMessage =
  "If an account exists with that email, a password-reset link has been sent.";

export async function POST(request: NextRequest) {
  try {
    const result = requestSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
      select: { id: true, email: true, password: true, accountStatus: true },
    });

    if (!user?.email || !user.password || user.accountStatus === "SUSPENDED") {
      return NextResponse.json({ success: true, message: publicMessage });
    }

    const oneMinuteAgo = new Date(Date.now() - 60_000);
    const recentRequest = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id, createdAt: { gte: oneMinuteAgo } },
      select: { id: true },
    });

    if (recentRequest) {
      return NextResponse.json({ success: true, message: publicMessage });
    }

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const resetRecord = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60_000),
      },
      select: { id: true },
    });

    const configuredUrl =
      process.env.APP_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
    const appUrl = configuredUrl || request.nextUrl.origin;
    const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password/${token}`;

    try {
      await sendPasswordResetEmail({ to: user.email, resetUrl });
    } catch (error) {
      await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
      console.error(
        "Password reset email error:",
        error instanceof Error ? error.message : "Unknown email error"
      );
    }

    return NextResponse.json({ success: true, message: publicMessage });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to process the request right now." },
      { status: 500 }
    );
  }
}
