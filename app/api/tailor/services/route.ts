import { NextRequest, NextResponse } from "next/server";
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

    const tailor = await prisma.tailorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!tailor) {
      return NextResponse.json(
        { message: "Tailor profile not found" },
        { status: 404 }
      );
    }

    const services = await prisma.tailorService.findMany({
      where: { tailorId: tailor.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
        { message: "Tailor profile not found" },
        { status: 404 }
      );
    }

    const { serviceName, price } = await req.json();

if (!serviceName?.trim()) {
  return NextResponse.json(
    { message: "Service name is required." },
    { status: 400 }
  );
}

if (serviceName.trim().length < 3) {
  return NextResponse.json(
    {
      message:
        "Service name must contain at least 3 characters.",
    },
    { status: 400 }
  );
}

if (!price || Number(price) <= 0) {
  return NextResponse.json(
    {
      message: "Price must be greater than zero.",
    },
    { status: 400 }
  );
}

const existing = await prisma.tailorService.findFirst({
  where: {
    tailorId: tailor.id,
    serviceName: serviceName.trim(),
  },
});

if (existing) {
  return NextResponse.json(
    {
      message: "This service already exists.",
    },
    {
      status: 409,
    }
  );
}
    const service = await prisma.tailorService.create({
      data: {
        tailorId: tailor.id,
        serviceName,
        price,
      },
    });

    return NextResponse.json(service, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
