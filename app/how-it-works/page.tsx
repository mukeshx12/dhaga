import T from "../components/LocalizedText";

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-5xl font-bold"><T en="How It Works" hi="यह कैसे काम करता है" /></h1>
      <p className="mt-4 text-gray-600">
        Learn how our platform works.
      </p>
    </main>
  );
}
