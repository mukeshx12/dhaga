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

    console.log("Session User ID:", session.user.id);
console.log("Session User Email:", session.user.email);

    const bookings = await prisma.booking.findMany({
  where: {
    customerId: session.user.id,
  },
  include: {
    tailor: {
      select: {
        shopName: true,
        city: true,
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

     console.log(body);

    console.log({
      tailorId,
      bookingDate,
      address,
      notes,
    });

    const existingBooking = await prisma.booking.findFirst({
  where: {
    customerId: session.user.id,
    tailorId,
    status: {
      in: ["PENDING", "ACCEPTED"],
    },
  },
});

if (existingBooking) {
  return NextResponse.json(
    {
      message:
        "You already have an active booking with this tailor.",
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
        bookingDate: new Date(bookingDate),
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
