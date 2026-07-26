import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

    const tailor = await prisma.tailorProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!tailor) {
      return NextResponse.json(
        { message: "Tailor profile not found." },
        { status: 404 }
      );
    }

    const { id } = await params;

    const { quotationPrice, quotationNotes } =
      await req.json();

    if (!quotationPrice || Number(quotationPrice) <= 0) {
      return NextResponse.json(
        {
          message:
            "Quotation price must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        tailorId: tailor.id,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          message:
            "Quotation can only be sent for accepted bookings.",
        },
        { status: 400 }
      );
    }

    const updatedBooking =
      await prisma.booking.update({
        where: {
          id,
        },
        data: {
    quotationPrice,
    quotationNotes,
    status: "QUOTATION_SENT",
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