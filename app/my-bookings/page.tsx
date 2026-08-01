import RecentOrders from "../components/dashboard/RecentOrders";
import T from "../components/LocalizedText";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            <T en="My Bookings" hi="मेरी बुकिंग" />
          </h1>

          <p className="mt-2 text-gray-600">
            <T en="View and track all your measurement bookings." hi="अपनी सभी माप बुकिंग देखें और उनकी स्थिति जानें।" />
          </p>
        </div>

        <RecentOrders />

      </div>
    </main>
  );
}
