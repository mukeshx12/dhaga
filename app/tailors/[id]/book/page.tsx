import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import T from "@/app/components/LocalizedText";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookMeasurementPage({ params }: Props) {
  const { id } = await params;
  const tailor = await prisma.tailorProfile.findUnique({
    where: { id },
    select: { id: true, shopName: true },
  });

  if (!tailor) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-lg">

        <h1 className="text-4xl font-bold text-gray-900">
          <T en="Book Measurement" hi="माप बुक करें" />
        </h1>

        <p className="mt-3 text-gray-600">
          <T en="Booking with" hi="बुकिंग:" />{" "}
          <span className="font-semibold">
            {tailor.shopName}
          </span>
        </p>
        <BookingForm tailorId={tailor.id} tailorName={tailor.shopName} />

      </div>
    </main>
  );
}
