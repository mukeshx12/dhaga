import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await req.json();

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    // Find logged-in tailor
    const tailor = await prisma.tailorProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!tailor) {
      return NextResponse.json(
        { message: "Tailor profile not found" },
        { status: 404 }
      );
    }

    // Verify booking belongs to this tailor
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        tailorId: tailor.id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    const transitions: Record<string, string[]> = {
      PENDING: ["ACCEPTED", "REJECTED"],
      ACCEPTED: ["QUOTATION_SENT", "IN_PROGRESS", "CANCELLED"],
      QUOTATION_SENT: ["CANCELLED"],
      CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["COMPLETED"],
    };
    if (!transitions[booking.status]?.includes(status)) {
      return NextResponse.json(
        { message: `Booking cannot move from ${booking.status} to ${status}.` },
        { status: 409 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedBooking);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
