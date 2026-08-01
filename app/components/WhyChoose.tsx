import {
  ShieldCheck,
  Ruler,
  Truck,
  Star,
} from "lucide-react";
import T from "./LocalizedText";

const features = [
  {
    title: "Verified Tailors",
    titleHi: "सत्यापित दर्जी",
    description:
      "Every tailor is verified before joining Dhaga to ensure quality and trust.",
    icon: ShieldCheck,
    descriptionHi: "गुणवत्ता और भरोसा सुनिश्चित करने के लिए हर दर्जी का सत्यापन किया जाता है।",
  },
  {
    title: "Home Measurement",
    titleHi: "घर पर माप",
    description:
      "Book a tailor to visit your home for accurate measurements and convenience.",
    icon: Ruler,
    descriptionHi: "सटीक माप और सुविधा के लिए दर्जी को घर बुलाएं।",
  },
  {
    title: "Doorstep Pickup & Delivery",
    titleHi: "घर से पिकअप और डिलीवरी",
    description:
      "Get your fabric picked up and your stitched outfit delivered to your doorstep.",
    icon: Truck,
    descriptionHi: "कपड़ा घर से पिकअप करवाएं और सिला हुआ परिधान घर पर पाएं।",
  },
  {
    title: "Top Rated Service",
    titleHi: "उच्च रेटिंग वाली सेवा",
    description:
      "Compare ratings, reviews, and pricing before choosing the perfect tailor.",
    icon: Star,
    descriptionHi: "सही दर्जी चुनने से पहले रेटिंग, समीक्षा और कीमत की तुलना करें।",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#FAF7F2] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <T en="Why Choose Dhaga?" hi="Dhaga क्यों चुनें?" />
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            <T en="Tailoring Made Simple & Trusted" hi="सिलाई अब आसान और भरोसेमंद" />
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            <T en="From home measurements to doorstep delivery, Dhaga connects you with skilled ladies’ tailors for a seamless stitching experience." hi="घर पर माप से लेकर डिलीवरी तक, Dhaga आपको कुशल महिला दर्जियों से जोड़ता है।" />
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Icon className="h-8 w-8 text-amber-700" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  <T en={feature.title} hi={feature.titleHi} />
                </h3>

                <p className="mt-3 text-gray-600 leading-7">
                  <T en={feature.description} hi={feature.descriptionHi} />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
