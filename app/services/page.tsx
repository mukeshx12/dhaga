import T from "../components/LocalizedText";

export default function ServicesPage() {
  return (
    <main className="p-10">
      <h1 className="text-5xl font-bold"><T en="Services" hi="सेवाएं" /></h1>
      <p className="mt-4 text-gray-600">
        This page will show all tailoring services.
      </p>
    </main>
  );
}
