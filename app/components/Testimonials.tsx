import { Star } from "lucide-react";
import Image from "next/image";
import T from "./LocalizedText";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Delhi",
    image: "/images/customer1.png",
    rating: 5,
    review:
      "The fitting was absolutely perfect! Booking a tailor from home was so convenient. Highly recommended.",
    reviewHi: "फिटिंग बिल्कुल सही थी! घर से दर्जी बुक करना बहुत सुविधाजनक था।",
  },
  {
    id: 2,
    name: "Sneha Patel",
    city: "Ahmedabad",
    image: "/images/customer2.png",
    rating: 5,
    review:
      "Loved the stitching quality. The tailor understood every detail of my design and delivered on time.",
    reviewHi: "सिलाई की गुणवत्ता बहुत अच्छी थी। दर्जी ने डिज़ाइन की हर बात समझी और समय पर दिया।",
  },
  {
    id: 3,
    name: "Ananya Gupta",
    city: "Lucknow",
    image: "/images/customer3.png",
    rating: 5,
    review:
      "Finally a platform where I can compare ratings and prices before booking. Amazing experience!",
    reviewHi: "आखिर ऐसा मंच मिला जहां बुकिंग से पहले रेटिंग और कीमत की तुलना कर सकती हूं। शानदार अनुभव!",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <T en="Happy Customers" hi="संतुष्ट ग्राहक" />
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            <T en="Loved by Women Across India" hi="भारत भर की महिलाओं का भरोसा" />
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            <T en="Thousands of women trust Dhaga for quality tailoring services." hi="हजारों महिलाएं गुणवत्तापूर्ण सिलाई सेवाओं के लिए Dhaga पर भरोसा करती हैं।" />
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-gray-200 bg-[#FFF8F0] p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">

                <Image
                  src={review.image}
                  alt={review.name}
                  width={70}
                  height={70}
                  className="rounded-full object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    {review.name}
                  </h3>

                  <p className="text-gray-500">
                    {review.city}
                  </p>
                </div>

              </div>

              <div className="mt-5 flex">
                {[...Array(review.rating)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    fill="#FBBF24"
                    className="text-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                &ldquo;<T en={review.review} hi={review.reviewHi} />&rdquo;
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
