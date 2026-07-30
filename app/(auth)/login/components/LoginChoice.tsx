"use client";

type LoginChoiceProps = {
  onChoosePhone: () => void;
  onChooseEmail: () => void;
};

export default function LoginChoice({
  onChoosePhone,
  onChooseEmail,
}: LoginChoiceProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Welcome Back
          </span>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Login to Dhaga
          </h1>

          <p className="mt-3 text-gray-600">
            Choose how you'd like to sign in.
          </p>
        </div>

        <button
          type="button"
          onClick={onChoosePhone}
          className="mt-8 w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800"
        >
          Continue with Phone
        </button>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="px-4 text-sm font-medium text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={onChooseEmail}
          className="w-full rounded-xl border-2 border-gray-900 bg-white py-4 font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          Continue with Email
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-amber-700 hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </main>
  );
}