import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, BadgeCheck, BriefcaseBusiness, Scissors } from "lucide-react";
import BookMeasurementButton from "./BookMeasurementButton";
import SaveTailorButton from "./SaveTailorButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import T from "@/app/components/LocalizedText";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TailorProfilePage({ params }: Props) {
  
  
  const { id } = await params;

  const tailor = await prisma.tailorProfile.findFirst({
    where: { id, status: "VERIFIED", isVerified: true, user: { accountStatus: "ACTIVE" } },
    select: {
      id: true,
      shopName: true,
      city: true,
      experience: true,
      description: true,
      isVerified: true,
      shopPhoto: true,
      workPhotos: true,
      services: {
        orderBy: { createdAt: "asc" },
        select: { id: true, serviceName: true, price: true },
      },
    },
  });

  if (!tailor) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserTailor = session?.user?.id
    ? await prisma.tailorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;
  const savedTailor = session?.user?.id && !currentUserTailor
    ? await prisma.savedTailor.findUnique({
        where: {
          userId_tailorId: { userId: session.user.id, tailorId: tailor.id },
        },
        select: { id: true },
      })
    : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF7F2] px-4 pb-28 pt-6 text-slate-950 sm:px-6 sm:py-12 md:pb-14">

      <article className="mx-auto grid min-w-0 max-w-6xl gap-6 overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white p-4 shadow-[0_22px_60px_rgba(120,53,15,0.10)] sm:p-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-9">

        <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-stone-100 sm:h-80 lg:h-[520px]">
          <Image
            src={tailor.shopPhoto || "/images/tailor1.png"}
            alt={tailor.shopName}
            fill
            sizes="(max-width: 1023px) 100vw, 46vw"
            unoptimized={Boolean(tailor.shopPhoto)}
            loading="eager"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 py-1 text-slate-900 sm:py-2">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            <T en="Tailor profile" hi="दर्जी प्रोफ़ाइल" />
          </p>

          <div className="mt-2 flex min-w-0 items-start gap-2.5">

            <h1 className="min-w-0 break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">
              {tailor.shopName}
            </h1>

            {tailor.isVerified && (
              <BadgeCheck className="mt-1 shrink-0 text-blue-600" size={26} aria-label="Verified tailor" />
            )}

          </div>

          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600 sm:text-base">
            <MapPin className="shrink-0 text-amber-700" size={19} />
            <span className="break-words">{tailor.city}</span>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50 p-4 text-slate-900 sm:p-5">

            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-amber-700 shadow-sm"><BriefcaseBusiness size={21} /></span>
            <div>
              <h3 className="text-sm font-semibold text-slate-600"><T en="Experience" hi="अनुभव" /></h3>
              <p className="mt-0.5 text-lg font-bold text-slate-950">{tailor.experience} <T en="Years" hi="वर्ष" /></p>
            </div>

          </div>

          <section className="mt-7">

            <h2 className="text-lg font-bold text-slate-950 sm:text-xl">
              <T en="About" hi="परिचय" />
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              {tailor.description || <T en="This tailor has not added a description yet." hi="इस दर्जी ने अभी परिचय नहीं जोड़ा है।" />}
            </p>

          </section>

          <section className="mt-7">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-amber-700"><Scissors size={18} /></span>
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl"><T en="Services & Pricing" hi="सेवाएं और कीमतें" /></h2>
            </div>

            {tailor.services.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-slate-500"><T en="No services added yet." hi="अभी कोई सेवा नहीं जोड़ी गई है।" /></p>
            ) : (
              <div className="mt-4 grid gap-3">
                {tailor.services.map((service) => (
                  <div key={service.id} className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                    <span className="min-w-0 break-words text-sm font-semibold text-slate-900 sm:text-base">{service.serviceName}</span>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-amber-700 shadow-sm">₹{Number(service.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className={`mt-7 grid gap-3 ${session?.user?.id && !currentUserTailor ? "sm:grid-cols-2" : ""}`}>
            <BookMeasurementButton tailorId={tailor.id} className="w-full" />
            {session?.user?.id && !currentUserTailor && (
              <SaveTailorButton tailorId={tailor.id} initiallySaved={Boolean(savedTailor)} className="w-full" />
            )}
          </div>

        </div>

      </article>

      {tailor.workPhotos.length > 0 && (
        <section className="mx-auto mt-10 max-w-6xl sm:mt-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            <T en="Portfolio" hi="कार्य संग्रह" />
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
            <T en="Work and designs" hi="काम और डिज़ाइन" />
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tailor.workPhotos.map((photo, index) => (
              <div key={`${photo.slice(-24)}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm">
                <Image
                  src={photo}
                  alt={`${tailor.shopName} work example ${index + 1}`}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
