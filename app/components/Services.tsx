import Link from "next/link";
import {
  Shirt,
  Scissors,
  Ruler,
  Sparkles,
  House,
  BadgeCheck,
} from "lucide-react";
import T from "./LocalizedText";

const services = [
  {
    title: "Blouse Stitching",
    titleHi: "ब्लाउज़ सिलाई",
    search: "Blouse Stitching",
    icon: Shirt,
    desc: "Designer & bridal blouse stitching.",
    descHi: "डिज़ाइनर और ब्राइडल ब्लाउज़ सिलाई।",
  },
  {
    title: "Suit Stitching",
    titleHi: "सूट सिलाई",
    search: "Suit Extra Design",
    icon: Sparkles,
    desc: "Custom salwar suit stitching.",
    descHi: "कस्टम सलवार सूट सिलाई।",
  },
  {
    title: "Lehenga Stitching",
    titleHi: "लहंगा सिलाई",
    search: "Lehenga Stitching", // when you add it to DB
    icon: BadgeCheck,
    desc: "Wedding & festive lehengas.",
    descHi: "शादी और त्योहार के लहंगे।",
  },
  {
    title: "Alterations",
    titleHi: "कपड़ों में सुधार",
    search: "Alterations",
    icon: Scissors,
    desc: "Perfect fitting for existing dresses.",
    descHi: "मौजूदा कपड़ों की सही फिटिंग।",
  },
  {
    title: "Home Measurement",
    titleHi: "घर पर माप",
    search: "Home Measurement",
    icon: House,
    desc: "Book a tailor at your home.",
    descHi: "अपने घर पर दर्जी बुक करें।",
  },
  {
    title: "Fall & Pico",
    titleHi: "फॉल और पिको",
    search: "Saare Fall",
    icon: Ruler,
    desc: "Quick saree finishing service.",
    descHi: "त्वरित साड़ी फिनिशिंग सेवा।",
  },
];
export default function Services() {
  return (
    <section id="popular-services" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-gray-900">
          <T en="Popular Services" hi="लोकप्रिय सेवाएं" />
        </h2>

        <p className="mt-4 text-center text-gray-600">
          <T en="Everything you need for women’s tailoring in one place." hi="महिलाओं की सिलाई से जुड़ी हर सेवा एक ही स्थान पर।" />
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-amber-500 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex rounded-xl bg-amber-100 p-4">
                  <Icon className="h-8 w-8 text-amber-700" />
                </div>

                <h3 className="text-2xl font-semibold">
                  <T en={service.title} hi={service.titleHi} />
                </h3>

                <p className="mt-3 text-gray-600">
                  <T en={service.desc} hi={service.descHi} />
                </p>

                <Link
  href={`/tailors?service=${encodeURIComponent(service.search)}`}
  className="mt-6 inline-flex items-center font-semibold text-amber-700 transition hover:gap-3"
>
  <T en="Book Now →" hi="अभी बुक करें →" />
</Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
