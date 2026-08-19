"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Trash2 } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import LogoutButton from "@/app/components/LogoutButton";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  isTailor: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    isTailor: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login?callbackUrl=/profile");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      setProfile({
       name: data.name ?? "",
       email: data.email ?? "",
       phone: data.phone ?? "",
       address: data.address ?? "",
       isTailor: Boolean(data.isTailor),
       });

      setLoading(false);
    }

    fetchProfile();
  }, [router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(hi ? "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई!" : "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(hi ? "कुछ गलत हो गया।" : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p>{hi ? "प्रोफ़ाइल लोड हो रही है..." : "Loading profile..."}</p>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-gray-50 py-12">
    <div className="mx-auto max-w-5xl px-6">

      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {hi ? "मेरी प्रोफ़ाइल" : "My Profile"}
          </h1>

          <p className="mt-2 text-gray-600">
            {hi ? "अपनी व्यक्तिगत जानकारी संभालें और खाता अपडेट रखें।" : "Manage your personal information and keep your account up to date."}
          </p>
        </div>
        <LogoutButton className="w-full sm:w-auto" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left Card */}
        <div className="rounded-3xl bg-white p-8 shadow">

          <div className="flex flex-col items-center">

            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-amber-700 text-4xl font-bold text-white">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-gray-900">
              {profile.name || "Customer"}
            </h2>

            <p className="text-gray-500">
              {profile.email}
            </p>

            <span className="mt-5 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {profile.isTailor ? (hi ? "दर्जी" : "Tailor") : (hi ? "ग्राहक" : "Customer")}
            </span>

          </div>

          <div className="mt-8 space-y-5 border-t pt-6">

            <div>
              <p className="text-sm text-gray-500">
                {hi ? "फोन" : "Phone"}
              </p>

              <p className="font-medium text-gray-900">
                {profile.phone || (hi ? "नहीं जोड़ा गया" : "Not Added")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {hi ? "पता" : "Address"}
              </p>

              <p className="font-medium text-gray-900">
                {profile.address || (hi ? "नहीं जोड़ा गया" : "Not Added")}
              </p>
            </div>

          </div>

        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-10 shadow">

          <h2 className="text-2xl font-bold text-gray-900">
            {hi ? "प्रोफ़ाइल संपादित करें" : "Edit Profile"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                {hi ? "पूरा नाम" : "Full Name"}
              </label>

              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                {hi ? "ईमेल पता" : "Email Address"}
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-gray-300 bg-gray-100 p-4 text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                {hi ? "फोन नंबर" : "Phone Number"}
              </label>

              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                placeholder={hi ? "फोन नंबर दर्ज करें" : "Enter phone number"}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                {hi ? "पता" : "Address"}
              </label>

              <textarea
                rows={5}
                value={profile.address}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    address: e.target.value,
                  })
                }
                placeholder={hi ? "अपना पता दर्ज करें" : "Enter your address"}
                className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-amber-700 px-8 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (hi ? "सहेज रहे हैं..." : "Saving...") : (hi ? "बदलाव सहेजें" : "Save Changes")}
              </button>

            </div>

          </form>

        </div>

      </div>

      <section className="mt-8 rounded-3xl border border-red-200 bg-white p-7 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-700">
              <Trash2 size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-950">
                {hi ? "खाता गोपनीयता और हटाना" : "Account privacy and deletion"}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                {hi
                  ? "अपनी गोपनीयता जानकारी पढ़ें या अपना Dhaga खाता और उससे जुड़ा डेटा स्थायी रूप से हटाएं।"
                  : "Review your privacy information or permanently delete your Dhaga account and associated data."}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/privacy" className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
              <ShieldCheck size={17} /> {hi ? "गोपनीयता नीति" : "Privacy Policy"}
            </Link>
            <Link href="/account/delete" className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800">
              <Trash2 size={17} /> {hi ? "खाता हटाएं" : "Delete Account"}
            </Link>
          </div>
        </div>
      </section>

    </div>
  </main>
);

}
