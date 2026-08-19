"use client";

import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { FormEvent, useState } from "react";

type DeleteAccountFormProps = {
  hasPassword: boolean;
};

export default function DeleteAccountForm({ hasPassword }: DeleteAccountFormProps) {
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmation === "DELETE" && (!hasPassword || password.length > 0);

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canDelete || deleting) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation, password: hasPassword ? password : undefined }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.message ?? "We could not delete your account. Please try again.");
        return;
      }

      await signOut({ callbackUrl: "/account-deletion?deleted=1" });
    } catch {
      setError("We could not connect to Dhaga. Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={deleteAccount} className="mt-8 space-y-5">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-900">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
          <p>
            This permanently removes your profile and associated Dhaga data. Active booking information
            connected to your account will also be removed. This action cannot be undone.
          </p>
        </div>
      </div>

      {hasPassword && (
        <div>
          <label htmlFor="delete-password" className="mb-2 block text-sm font-semibold text-stone-800">
            Current password
          </label>
          <input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="delete-confirmation" className="mb-2 block text-sm font-semibold text-stone-800">
          Type <span className="font-extrabold text-red-700">DELETE</span> to confirm
        </label>
        <input
          id="delete-confirmation"
          type="text"
          autoComplete="off"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder="DELETE"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
          required
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canDelete || deleting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {deleting ? <LoaderCircle className="animate-spin" size={19} /> : <Trash2 size={19} />}
        {deleting ? "Deleting account…" : "Permanently delete my account"}
      </button>
    </form>
  );
}
