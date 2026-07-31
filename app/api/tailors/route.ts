import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const city = (searchParams.get("city") || "").trim();
    const service = (searchParams.get("service") || "").trim();
    const sort = searchParams.get("sort") || "newest";
    const verified = searchParams.get("verified") === "true";

    const orderBy =
      sort === "experience_desc"
        ? { experience: "desc" as const }
        : sort === "experience_asc"
          ? { experience: "asc" as const }
          : sort === "name"
            ? { shopName: "asc" as const }
            : { createdAt: "desc" as const };

    const tailors = await prisma.tailorProfile.findMany({
      where: {
        status: { notIn: ["SUSPENDED", "REJECTED"] },
    ...(search
      ? {
          shopName: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),

    ...(city
      ? {
          city: {
            contains: city,
            mode: "insensitive",
          },
        }
      : {}),

    ...(service
      ? {
          services: {
            some: {
              serviceName: {
                contains: service,
                mode: "insensitive",
              },
            },
          },
        }
      : {}),

    ...(verified
      ? {
          isVerified: true,
        }
      : {}),
  },

  select: {
    id: true,
    shopName: true,
    city: true,
    description: true,
    experience: true,
    isVerified: true,
    shopPhoto: true,
    services: { select: { id: true, serviceName: true, price: true } },
  },

  orderBy,
});

    return NextResponse.json(
      tailors.map((tailor) => ({
        ...tailor,
        services: tailor.services.map((tailorService) => ({
          ...tailorService,
          price: Number(tailorService.price),
        })),
      })),
    );
  } catch (error) {
    console.error("API ERROR:", error);

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
