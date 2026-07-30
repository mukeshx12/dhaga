"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";

type Listing = {
  shopName: string;
  phone: string;
  city: string;
  address: string;
  experience: number;
  description: string | null;
  shopPhoto: string | null;
  workPhotos: string[];
  isVerified: boolean;
};

type Props = {
  initialListing: Listing;
};

export default function TailorListing({ initialListing }: Props) {
  const [form, setForm] = useState({
    shopName: initialListing.shopName,
    phone: initialListing.phone,
    city: initialListing.city,
    address: initialListing.address,
    experience: String(initialListing.experience),
    description: initialListing.description ?? "",
    shopPhoto: initialListing.shopPhoto,
    workPhotos: initialListing.workPhotos,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function readImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        reject(new Error("Only JPG, PNG and WebP images are supported."));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        reject(new Error("Each image must be 2 MB or smaller."));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read this image."));
      reader.readAsDataURL(file);
    });
  }

  async function selectShopPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await readImage(file);
      setForm((current) => ({ ...current, shopPhoto: image }));
      setError("");
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Invalid image.");
    }
    event.target.value = "";
  }

  async function selectWorkPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const remainingSlots = 5 - form.workPhotos.length;

    if (files.length > remainingSlots) {
      setError(`You can add ${remainingSlots} more work photo${remainingSlots === 1 ? "" : "s"}.`);
      event.target.value = "";
      return;
    }

    try {
      const images = await Promise.all(files.map(readImage));
      setForm((current) => ({
        ...current,
        workPhotos: [...current.workPhotos, ...images],
      }));
      setError("");
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Invalid image.");
    }
    event.target.value = "";
  }

  async function saveListing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/tailor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          experience: Number(form.experience),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Could not update your listing.");
        return;
      }

      setMessage("Your business listing has been updated.");
    } catch (saveError) {
      console.error(saveError);
      setError("Could not update your listing.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Business listing
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Your tailor profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            These details are shown to customers on your public listing.
          </p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          initialListing.isVerified
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-800"
        }`}>
          {initialListing.isVerified ? "Verified" : "Verification pending"}
        </span>
      </div>

      {message && (
        <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={saveListing} className="mt-6 grid gap-5 md:grid-cols-2">
        {[
          ["shopName", "Shop name", "Priya Boutique"],
          ["phone", "Business phone", "+91 9876543210"],
          ["city", "City", "Bengaluru"],
          ["experience", "Years of experience", "5"],
        ].map(([name, label, placeholder]) => (
          <label key={name} className="text-sm font-medium text-gray-700">
            {label}
            <input
              required
              min={name === "experience" ? 0 : undefined}
              type={name === "experience" ? "number" : "text"}
              name={name}
              value={String(
                form[name as "shopName" | "phone" | "city" | "experience"]
              )}
              onChange={updateField}
              placeholder={placeholder}
              className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-700"
            />
          </label>
        ))}

        <label className="text-sm font-medium text-gray-700 md:col-span-2">
          Shop address
          <input
            required
            name="address"
            value={form.address}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-700"
          />
        </label>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-700">Shop photo</p>
          <p className="mt-1 text-xs text-gray-500">JPG, PNG or WebP, maximum 2 MB.</p>

          <div className="mt-3 flex flex-wrap items-start gap-4">
            {form.shopPhoto && (
              <div className="relative h-40 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <Image
                  src={form.shopPhoto}
                  alt="Shop preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, shopPhoto: null }))}
                  aria-label="Remove shop photo"
                  className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )}

            <label className="flex h-40 w-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 text-center text-amber-800 hover:bg-amber-100">
              <ImagePlus size={28} />
              <span className="mt-2 text-sm font-semibold">
                {form.shopPhoto ? "Replace shop photo" : "Upload shop photo"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={selectShopPhoto}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-700">Work and design gallery</p>
          <p className="mt-1 text-xs text-gray-500">Upload up to five examples, maximum 2 MB each.</p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {form.workPhotos.map((photo, index) => (
              <div key={`${photo.slice(-24)}-${index}`} className="relative h-44 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <Image
                  src={photo}
                  alt={`Work design ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((current) => ({
                    ...current,
                    workPhotos: current.workPhotos.filter((_, photoIndex) => photoIndex !== index),
                  }))}
                  aria-label={`Remove work photo ${index + 1}`}
                  className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}

            {form.workPhotos.length < 5 && (
              <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 text-center text-amber-800 hover:bg-amber-100">
                <ImagePlus size={28} />
                <span className="mt-2 text-sm font-semibold">Add work photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectWorkPhotos}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>

        <label className="text-sm font-medium text-gray-700 md:col-span-2">
          About your work
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-700"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-50 md:col-span-2"
        >
          {saving ? "Saving..." : "Save listing"}
        </button>
      </form>
    </section>
  );
}
