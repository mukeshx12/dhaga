import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ tailorId: string }>;
};

async function customerId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const tailorAccount = await prisma.tailorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  return tailorAccount ? null : session.user.id;
}

export async function POST(_request: NextRequest, { params }: Context) {
  const userId = await customerId();
  if (!userId) {
    return NextResponse.json({ message: "Customer login required." }, { status: 403 });
  }

  const { tailorId } = await params;
  const tailor = await prisma.tailorProfile.findFirst({
    where: { id: tailorId, status: "VERIFIED", isVerified: true, user: { accountStatus: "ACTIVE" } },
    select: { id: true },
  });

  if (!tailor) {
    return NextResponse.json({ message: "Tailor not found." }, { status: 404 });
  }

  await prisma.savedTailor.upsert({
    where: { userId_tailorId: { userId, tailorId } },
    update: {},
    create: { userId, tailorId },
  });

  return NextResponse.json({ saved: true });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const userId = await customerId();
  if (!userId) {
    return NextResponse.json({ message: "Customer login required." }, { status: 403 });
  }

  const { tailorId } = await params;
  await prisma.savedTailor.deleteMany({ where: { userId, tailorId } });
  return NextResponse.json({ saved: false });
}
