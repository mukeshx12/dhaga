import { Mail, Phone, MapPin } from "lucide-react";
import T from "./LocalizedText";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[#FAF7F2] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            <T en="Contact Us" hi="हमसे संपर्क करें" />
          </h2>

          <p className="mt-4 text-gray-600">
            <T en="Have questions? We’d love to hear from you." hi="कोई सवाल है? हमें आपसे बात करके खुशी होगी।" />
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-8 shadow">
            <Phone className="text-amber-700" size={30} />
            <h3 className="mt-4 text-xl font-semibold">
              <T en="Phone" hi="फोन" />
            </h3>

            <p className="mt-2 text-gray-600">
              +91 98765 43210
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow">
            <Mail className="text-amber-700" size={30} />
            <h3 className="mt-4 text-xl font-semibold">
              <T en="Email" hi="ईमेल" />
            </h3>

            <p className="mt-2 text-gray-600">
              support@dhaga.com
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow">
            <MapPin className="text-amber-700" size={30} />
            <h3 className="mt-4 text-xl font-semibold">
              <T en="Address" hi="पता" />
            </h3>

            <p className="mt-2 text-gray-600">
              Noida, Uttar Pradesh, India
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
