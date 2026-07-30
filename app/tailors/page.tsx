import { prisma } from "@/lib/prisma";
import TailorsClient from "./TailorsClient";

type Props = {
  searchParams: Promise<{
    city?: string;
    service?: string;
  }>;
};

export default async function TailorsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const city = params.city;
  const service = params.service;

  const tailors = await prisma.tailorProfile.findMany({
    where: {
      status: { notIn: ["SUSPENDED", "REJECTED"] },
      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(service
        ? {
            services: {
              some: {
                serviceName: {
                  contains: service,
                  mode: "insensitive" as const,
                },
              },
            },
          }
        : {}),
    },
    include: { services: true },
    orderBy: { createdAt: "desc" },
  });

  const serializedTailors = tailors.map((tailor) => ({
    ...tailor,
    services: tailor.services.map((tailorService) => ({
      ...tailorService,
      price: Number(tailorService.price),
    })),
  }));

  return (
    <TailorsClient initialTailors={serializedTailors} />
  );
}
