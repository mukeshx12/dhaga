import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

const deletionSchema = z.object({
  confirmation: z.literal("DELETE"),
  password: z.string().max(128).optional(),
});

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Please sign in to delete your account." }, { status: 401 });
  }

  const parsed = deletionSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Type "DELETE" exactly to confirm account deletion.' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ message: "Account not found." }, { status: 404 });
  }

  if (user.role === "ADMIN") {
    return NextResponse.json(
      { message: "Administrator accounts must be removed through an authorised administrative process." },
      { status: 403 },
    );
  }

  if (user.password) {
    if (!parsed.data.password || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return NextResponse.json({ message: "Your current password is incorrect." }, { status: 400 });
    }
  }

  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ message: "Your Dhaga account and associated data have been deleted." });
}
