import TailorBookings from "@/app/tailor-dashboard/components/TailorBookings";
import TailorServices from "@/app/components/dashboard/TailorServices";

export default function TailorDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-10">

        <h1 className="font-semibold text-black text-4xl">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your tailoring business and customer bookings.
        </p>

        <TailorBookings />
        <TailorServices />

      </div>
    </main>
  );
}