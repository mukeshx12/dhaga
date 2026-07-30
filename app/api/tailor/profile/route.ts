import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";


const tailorSchema = z.object({
  shopName: z.string().min(2),
  phone: z.string().min(10),
  city: z.string().min(2),
  address: z.string().min(5),
  experience: z.coerce.number().min(0),
  description: z.string().optional(),
  shopPhoto: z.string().max(3_000_000).nullable().optional(),
  workPhotos: z.array(z.string().max(3_000_000)).max(5).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await prisma.tailorProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        shopName: true,
        phone: true,
        city: true,
        address: true,
        experience: true,
        description: true,
        shopPhoto: true,
        workPhotos: true,
        isVerified: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Tailor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Tailor Profile GET Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = tailorSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      shopName,
      phone,
      city,
      address,
      experience,
      description,
      shopPhoto,
      workPhotos,
    } = result.data;

    const imageDataPattern = /^data:image\/(jpeg|png|webp);base64,/;
    const images = [shopPhoto, ...(workPhotos ?? [])].filter(
      (image): image is string => Boolean(image)
    );

    if (images.some((image) => !imageDataPattern.test(image))) {
      return NextResponse.json(
        { message: "Only JPG, PNG and WebP images are supported." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return NextResponse.json(
    {
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

const user = await prisma.user.findUnique({
  where: {
    id: session.user.id,
  },
});

if (!user) {
  return NextResponse.json(
    {
      message: "User not found",
    },
    { status: 404 }
  );
}
   const profile = await prisma.tailorProfile.upsert({
  where: {
    userId: user.id,
  },
  update: {
    shopName,
    phone,
    city,
    address,
    experience,
    description,
    shopPhoto,
    workPhotos,
  },
  create: {
    userId: user.id,
    shopName,
    phone,
    city,
    address,
    experience,
    description,
    shopPhoto: shopPhoto ?? null,
    workPhotos: workPhotos ?? [],
  },
});

    return NextResponse.json(
      {
        message: "Tailor profile created successfully",
        profile,
      },
      { status: 201 }
    );
  } catch (error) {
  console.error("Tailor Profile API Error:", error);

  return NextResponse.json(
    {
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
    );
  }
}
