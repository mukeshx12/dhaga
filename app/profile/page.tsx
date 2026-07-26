"use client";

import { useEffect, useState } from "react";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setProfile({
       name: data.name ?? "",
       email: data.email ?? "",
       phone: data.phone ?? "",
       address: data.address ?? "",
       });

      setLoading(false);
    }

    fetchProfile();
  }, []);

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

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-gray-50 py-12">
    <div className="mx-auto max-w-5xl px-6">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your personal information and keep your account up to date.
        </p>
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
              Customer
            </span>

          </div>

          <div className="mt-8 space-y-5 border-t pt-6">

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-medium text-gray-900">
                {profile.phone || "Not Added"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="font-medium text-gray-900">
                {profile.address || "Not Added"}
              </p>
            </div>

          </div>

        </div>

        {/* Right Form */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-10 shadow">

          <h2 className="text-2xl font-bold text-gray-900">
            Edit Profile
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Full Name
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
                Email Address
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
                Phone Number
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
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Address
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
                placeholder="Enter your address"
                className="w-full rounded-xl border border-gray-300 bg-white p-4 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-amber-700 px-8 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  </main>
);

}