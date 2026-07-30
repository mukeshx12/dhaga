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

    const { action } = await req.json();

    if (!action) {
      return NextResponse.json(
        { message: "Action is required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        customerId: session.user.id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    if (!booking.quotationPrice) {
      return NextResponse.json(
        { message: "Quotation has not been sent yet." },
        { status: 400 }
      );
    }

    let newStatus = booking.status;

    if (action === "ACCEPT") {
      newStatus = "CONFIRMED";
    } else if (action === "REJECT") {
      newStatus = "CANCELLED";
    } else {
      return NextResponse.json(
        { message: "Invalid action." },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: newStatus,
      },
    });

    return NextResponse.json(updatedBooking);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}