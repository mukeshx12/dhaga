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

    let orderBy = {};

switch (sort) {
  case "experience_desc":
    orderBy = {
      experience: "desc",
    };
    break;

  case "experience_asc":
    orderBy = {
      experience: "asc",
    };
    break;

  default:
    orderBy = {
      createdAt: "desc",
    };
}

const allServices = await prisma.tailorService.findMany();

console.log(
  "All DB services:",
  allServices.map((s) => s.serviceName)
);

const matched = await prisma.tailorService.findMany({
  where: {
    serviceName: {
      contains: service,
      mode: "insensitive",
    },
  },
});

console.log("Matched services:", matched);



    const tailors = await prisma.tailorProfile.findMany({
  where: {
    ...(search.trim()
      ? {
          shopName: {
            contains: search.trim(),
            mode: "insensitive",
          },
        }
      : {}),

    ...(city.trim()
      ? {
          city: {
            equals: city.trim(),
            mode: "insensitive",
          },
        }
      : {}),

    ...(service.trim()
      ? {
          services: {
            some: {
              serviceName: {
                contains: service.trim(),
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

  include: {
    user: {
      select: {
        name: true,
        email: true,
      },
    },
    services: true,
  },

  orderBy,
});

    console.log("Search:", search);
    console.log("City:", city);
    console.log("Tailors found:", tailors.length);
    console.log("Service:", service);

    console.log("Tailors:", tailors);
    return NextResponse.json(tailors);
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