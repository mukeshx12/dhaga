import { prisma } from "@/lib/prisma";
import TailorsClient from "./TailorsClient";
import { buildTailorServiceFilter } from "@/lib/service-search";

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

  const serviceFilter = service ? buildTailorServiceFilter(service) : undefined;
  const loadTailors = (includeServiceFilter: boolean) => prisma.tailorProfile.findMany({
    where: {
      status: "VERIFIED",
      isVerified: true,
      user: { accountStatus: "ACTIVE" },
      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive" as const,
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
    orderBy: { createdAt: "desc" },
  });

  let tailors = await loadTailors(true);
  const initialServiceFallback = Boolean(service && tailors.length === 0);
  if (initialServiceFallback) tailors = await loadTailors(false);

  const serializedTailors = tailors.map((tailor) => ({
    ...tailor,
    services: tailor.services.map((tailorService) => ({
      ...tailorService,
      price: Number(tailorService.price),
    })),
  }));

  return (
    <TailorsClient initialTailors={serializedTailors} initialServiceFallback={initialServiceFallback} />
  );
}
