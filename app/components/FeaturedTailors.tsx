import TailorCard from "./TailorCard";

type Props = {
  tailors: any[];
};

export default function FeaturedTailors({ tailors }: Props) {
  return (
    <section className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Featured Tailors
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Meet Our Top Rated Tailors
          </h2>

          <p className="mt-4 text-gray-600">
            Skilled professionals trusted by hundreds of happy customers.
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
                No Tailors Found
              </h3>

              <p className="mt-3 text-gray-500">
                Tailors will appear here once they register.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}