import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookMeasurementPage({ params }: Props) {
  const { id } = await params;
  const tailor = await prisma.tailorProfile.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!tailor) {
    notFound();
  }
  console.log("Current Tailor:", tailor.id, tailor.shopName);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-lg">

        <h1 className="text-4xl font-bold text-gray-900">
          Book Measurement
        </h1>

        <p className="mt-3 text-gray-600">
          Booking with{" "}
          <span className="font-semibold">
            {tailor.shopName}
          </span>
        </p>
        <BookingForm tailorId={tailor.id} />

      </div>
    </main>
  );
}