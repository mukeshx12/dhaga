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

  console.log("City:", city);
  console.log("Service:", service);

  const tailors = await prisma.tailorProfile.findMany({
  where: {
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
  },

  include: {
    services: true,
  },
});

console.log(tailors.map(t => ({
  shop: t.shopName,
  city: t.city,
})));

const serializedTailors = tailors.map((tailor) => ({
  ...tailor,
  services: tailor.services.map((service) => ({
    ...service,
    price: Number(service.price),
  })),
}));



  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {(city || service) && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-amber-800 font-medium">
            Showing results
            {city && (
              <>
                {" "}
                in <strong>{city}</strong>
              </>
            )}
            {service && (
              <>
                {" "}
                for <strong>{service}</strong>
              </>
            )}
          </p>
        </div>
      )}

      {tailors.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow">
          <h2 className="text-3xl font-bold text-gray-900">
            No Tailors Found
          </h2>

          <p className="mt-3 text-gray-500">
            Try another city or service.
          </p>
        </div>
      ) : (
        <TailorsClient initialTailors={serializedTailors} />
      )}
    </main>
  );
}