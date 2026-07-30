import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const statuses = ["PENDING", "ACCEPTED", "IN_PROGRESS", "QUOTATION_SENT", "CONFIRMED", "COMPLETED", "REJECTED", "CANCELLED"] as const;

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status } = await request.json();
  if (!statuses.includes(status)) return NextResponse.json({ message: "Invalid booking status" }, { status: 400 });

  const booking = await prisma.booking.update({ where: { id }, data: { status } });
  return NextResponse.json(booking);
}
