import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const resetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const result = resetSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Use a password containing at least 8 characters." },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(result.data.token)
      .digest("hex");
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true },
    });

    if (!resetToken || resetToken.expiresAt <= new Date()) {
      if (resetToken) {
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      }
      return NextResponse.json(
        { success: false, message: "This reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const password = await bcrypt.hash(result.data.password, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to reset the password right now." },
      { status: 500 }
    );
  }
}
