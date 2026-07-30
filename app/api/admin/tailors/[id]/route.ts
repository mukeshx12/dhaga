import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { action } = await request.json();
  const updates = {
    APPROVE: { status: "VERIFIED" as const, isVerified: true },
    REJECT: { status: "REJECTED" as const, isVerified: false },
    SUSPEND: { status: "SUSPENDED" as const, isVerified: false },
    REACTIVATE: { status: "PENDING" as const, isVerified: false },
  };
  const data = updates[action as keyof typeof updates];

  if (!data) return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  const tailor = await prisma.tailorProfile.update({ where: { id }, data });
  return NextResponse.json(tailor);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.tailorProfile.delete({ where: { id } });
  return NextResponse.json({ removed: true });
}
