import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  House,
  Ruler,
  Scissors,
  Shirt,
  Sparkles,
} from "lucide-react";
import T from "../components/LocalizedText";

const services = [
  {
    name: "Blouse Stitching",
    nameHi: "ब्लाउज़ सिलाई",
    description: "Daily wear, designer and bridal blouses tailored to your measurements.",
    descriptionHi: "आपके माप के अनुसार डेली वियर, डिज़ाइनर और ब्राइडल ब्लाउज़।",
    query: "Blouse",
    icon: Shirt,
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Suit Stitching",
    nameHi: "सूट सिलाई",
    description: "Custom salwar suits, kurtas and coordinated sets for every occasion.",
    descriptionHi: "हर अवसर के लिए कस्टम सलवार सूट, कुर्ते और मैचिंग सेट।",
    query: "Suit",
    icon: Sparkles,
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Alterations",
    nameHi: "कपड़ों में सुधार",
    description: "Resize, repair and improve the fit of clothes you already love.",
    descriptionHi: "अपने पसंदीदा कपड़ों का आकार, मरम्मत और फिटिंग बेहतर कराएं।",
    query: "Alteration",
    icon: Scissors,
    color: "bg-sky-100 text-sky-700",
  },
  {
    name: "Lehenga Stitching",
    nameHi: "लहंगा सिलाई",
    description: "Wedding and festive lehengas finished for comfort and movement.",
    descriptionHi: "आराम और सही फिटिंग के साथ शादी और त्योहार के लहंगे।",
    query: "Lehenga",
    icon: BadgeCheck,
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Fall & Pico",
    nameHi: "फॉल और पिको",
    description: "Neat saree finishing with quick fall and pico services.",
    descriptionHi: "त्वरित फॉल और पिको के साथ साफ-सुथरी साड़ी फिनिशिंग।",
    query: "Fall",
    icon: Ruler,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Home Measurement",
    nameHi: "घर पर माप",
    description: "Choose a convenient time and have a tailor measure you at home.",
    descriptionHi: "सुविधाजनक समय चुनें और दर्जी से घर पर माप करवाएं।",
    query: "Home",
    icon: House,
    color: "bg-orange-100 text-orange-700",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f3] pb-8 text-slate-950">
      <header className="bg-gradient-to-br from-amber-800 via-amber-700 to-orange-600 px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] text-white md:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-100">
            <ArrowLeft size={18} /> <T en="Back to home" hi="होम पर वापस" />
          </Link>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            <T en="Dhaga services" hi="Dhaga सेवाएं" />
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight md:text-5xl">
            <T en="What would you like stitched?" hi="आप क्या सिलवाना चाहते हैं?" />
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-50 md:text-base">
            <T en="Choose a service to compare nearby tailors, their prices and available options." hi="आस-पास के दर्जियों, उनकी कीमतों और उपलब्ध विकल्पों की तुलना करने के लिए सेवा चुनें।" />
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 md:px-8 md:py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.name}
                href={`/tailors?service=${encodeURIComponent(service.query)}`}
                className="group flex items-start gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition active:scale-[.98] md:p-6 md:hover:-translate-y-1 md:hover:shadow-lg"
              >
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${service.color}`}>
                  <Icon size={25} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-extrabold md:text-lg">
                    <T en={service.name} hi={service.nameHi} />
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 md:text-sm md:leading-6">
                    <T en={service.description} hi={service.descriptionHi} />
                  </span>
                  <span className="mt-3 inline-flex text-xs font-bold text-amber-700">
                    <T en="Find tailors →" hi="दर्जी खोजें →" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-xl md:flex md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
              <T en="Most booked" hi="सबसे ज्यादा बुक" />
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              <T en="Measurement at your doorstep" hi="आपके घर पर माप" />
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              <T en="Pick a convenient time and let a local tailor visit you for an accurate fitting." hi="सुविधाजनक समय चुनें और सही फिटिंग के लिए स्थानीय दर्जी को घर बुलाएं।" />
            </p>
          </div>
          <Link href="/tailors?service=Home" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 md:mt-0">
            <CalendarDays size={18} /> <T en="Book measurement" hi="माप बुक करें" />
          </Link>
        </div>
      </section>
    </main>
  );
}
