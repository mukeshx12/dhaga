import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


const tailorSchema = z.object({
  shopName: z.string().min(2),
  phone: z.string().min(10),
  city: z.string().min(2),
  address: z.string().min(5),
  experience: z.coerce.number().min(0),
  description: z.string().optional(),
});

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
    } = result.data;

    // Temporary user until authentication is connected
    const session = await getServerSession(authOptions);
    console.log("======== Tailor API ========");
console.log("Session:", session);
console.log("Cookies:", req.cookies.getAll());

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
console.log("Session User ID:", session.user.id);
console.log("Database User ID:", user.id);

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
  },
  create: {
    userId: user.id,
    shopName,
    phone,
    city,
    address,
    experience,
    description,
  },
});

console.log("Profile:", profile);
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