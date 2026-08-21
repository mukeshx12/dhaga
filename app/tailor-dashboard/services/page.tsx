import TailorServices from "@/app/tailor-dashboard/components/TailorServices";


export default function ServicesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f4ef] px-4 pb-28 pt-7 sm:p-8 md:pb-8">
      <h1 className="text-3xl font-extrabold text-black-950">
        My Services
      </h1>

      <p className="mt-2 text-gray-500">
        Manage the services you provide.
      </p>

      <TailorServices />
    </main>
  );
}
