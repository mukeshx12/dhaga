import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp/verifyOtp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.replace(/\s+/g, "").trim()
        : "";

    const otp =
      typeof body.otp === "string"
        ? body.otp.trim()
        : "";

    if (!name || !phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone and OTP are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\+91\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid Indian phone number.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account already exists with this phone number. Please login.",
        },
        { status: 409 }
      );
    }

    const isVerified = await verifyOtp(phone, otp);

    if (!isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired OTP.",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Phone registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}