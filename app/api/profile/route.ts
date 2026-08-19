import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp/verifyOtp";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        tailorProfile: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isTailor: Boolean(user.tailorProfile),
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true },
    });
    if (!currentUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const requestedPhone = typeof body.phone === "string" ? body.phone.replace(/\s+/g, "").trim() : null;
    if (requestedPhone && requestedPhone !== currentUser.phone) {
      if (!/^\+91\d{10}$/.test(requestedPhone)) {
        return NextResponse.json({ message: "Enter a valid Indian phone number." }, { status: 400 });
      }
      if (!body.otp || !body.challenge || !(await verifyOtp(requestedPhone, String(body.otp), String(body.challenge)))) {
        return NextResponse.json({ message: "Verify the new phone number with OTP before saving." }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: body.name,
        phone: requestedPhone,
        address: body.address,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
