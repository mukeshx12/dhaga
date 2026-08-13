import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildTailorServiceFilter } from "@/lib/service-search";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const city = (searchParams.get("city") || "").trim();
    const service = (searchParams.get("service") || "").trim();
    const sort = searchParams.get("sort") || "newest";

    const orderBy =
      sort === "experience_desc"
        ? { experience: "desc" as const }
        : sort === "experience_asc"
          ? { experience: "asc" as const }
          : sort === "name"
            ? { shopName: "asc" as const }
            : { createdAt: "desc" as const };

    const serviceFilter = buildTailorServiceFilter(service);
    const queryTailors = (includeServiceFilter: boolean) => prisma.tailorProfile.findMany({
      where: {
        status: "VERIFIED",
        isVerified: true,
        user: { accountStatus: "ACTIVE" },
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

    ...(includeServiceFilter && serviceFilter ? { services: serviceFilter } : {}),

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

    let tailors = await queryTailors(true);
    const serviceFallback = Boolean(service && tailors.length === 0);
    if (serviceFallback) tailors = await queryTailors(false);

    const response = NextResponse.json(
      tailors.map((tailor) => ({
        ...tailor,
        services: tailor.services.map((tailorService) => ({
          ...tailorService,
          price: Number(tailorService.price),
        })),
      })),
    );
    response.headers.set("X-Dhaga-Service-Fallback", String(serviceFallback));
    return response;
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
