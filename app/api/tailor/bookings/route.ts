import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the tailor profile belonging to the logged-in user
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

    // Get all bookings assigned to this tailor
    const bookings = await prisma.booking.findMany({
      where: {
        tailorId: tailor.id,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        bookingDate: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
