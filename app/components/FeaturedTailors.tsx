import TailorCard from "./TailorCard";
import T from "./LocalizedText";

type Props = {
  tailors: Array<{
    id: string;
    shopName: string;
    city: string;
    description: string | null;
    experience: number;
    isVerified: boolean;
    shopPhoto: string | null;
    services: Array<{ id: string; serviceName: string; price: number }>;
  }>;
};

export default function FeaturedTailors({ tailors }: Props) {
  return (
    <section className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <T en="Featured Tailors" hi="विशेष दर्जी" />
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            <T en="Meet Our Top Rated Tailors" hi="हमारे उच्च रेटिंग वाले दर्जियों से मिलें" />
          </h2>

          <p className="mt-4 text-gray-600">
            <T en="Skilled professionals trusted by hundreds of happy customers." hi="सैकड़ों संतुष्ट ग्राहकों द्वारा भरोसेमंद कुशल पेशेवर।" />
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tailors.length > 0 ? (
            tailors.map((tailor) => (
              <TailorCard
                key={tailor.id}
                tailor={tailor}
              />
            ))
          ) : (
            <div className="col-span-full rounded-2xl bg-white p-10 text-center shadow">
              <h3 className="text-2xl font-semibold text-gray-900">
                <T en="No Tailors Found" hi="कोई दर्जी नहीं मिला" />
              </h3>

              <p className="mt-3 text-gray-500">
                <T en="Tailors will appear here once they register." hi="पंजीकरण के बाद दर्जी यहां दिखाई देंगे।" />
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
