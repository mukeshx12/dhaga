import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch the logged-in user
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  // Check if the user is also a tailor
  const tailorProfile = await prisma.tailorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: tailorProfile ? "Tailor" : "Customer",
    isTailor: !!tailorProfile,
    tailorId: tailorProfile?.id ?? null,
  });
}