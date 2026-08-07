import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
  where: {
    customerId: session.user.id,
  },
  include: {
    tailor: {
      select: {
        id: true,
        shopName: true,
        city: true,
        phone: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json(
    {
      message: "Please login first",
    },
    {
      status: 401,
    }
  );
}

      const customerIsTailor = await prisma.tailorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (customerIsTailor) {
      return NextResponse.json(
        { message: "Tailor accounts cannot book other tailors." },
        { status: 403 }
      );
    }

    const {
      tailorId,
      bookingDate,
      address,
      notes,
    } = body;

    if (!tailorId || !bookingDate || !address) {
      return NextResponse.json(
        {
          message: "All required fields are missing",
        },
        {
          status: 400,
        }
      );
    }

    const requestedDate = new Date(bookingDate);
    if (Number.isNaN(requestedDate.getTime()) || requestedDate <= new Date()) {
      return NextResponse.json({ message: "Please choose a future booking date." }, { status: 400 });
    }

    const availableTailor = await prisma.tailorProfile.findFirst({
      where: { id: tailorId, status: "VERIFIED", isVerified: true, user: { accountStatus: "ACTIVE" } },
      select: { id: true },
    });
    if (!availableTailor) {
      return NextResponse.json({ message: "This tailor is not currently available for booking." }, { status: 404 });
    }

    const activeBookingCount = await prisma.booking.count({
  where: {
    customerId: session.user.id,
    tailorId,
    status: {
      in: ["PENDING", "ACCEPTED", "QUOTATION_SENT", "CONFIRMED", "IN_PROGRESS"],
    },
  },
});

if (activeBookingCount >= 3) {
  return NextResponse.json(
    {
      message:
        "You can have up to 3 active bookings with this tailor.",
    },
    {
      status: 400,
    }
  );
}

    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        tailorId,
        bookingDate: requestedDate,
        address,
        notes,
      },
    });

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
  console.error("BOOKING ERROR:", error);

  return NextResponse.json(
    {
      message: "Something went wrong",
      error: String(error),
    },
    {
      status: 500,
    }
  );
}
}
