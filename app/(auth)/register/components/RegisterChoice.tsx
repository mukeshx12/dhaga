type Props = {
  onChoosePhone: () => void;
  onChooseEmail: () => void;
};

export default function RegisterChoice({
  onChoosePhone,
  onChooseEmail,
}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Join Dhaga
          </span>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Create Customer Account
          </h1>

          <p className="mt-3 text-gray-600">
            Choose how you would like to register.
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
          className="w-full rounded-xl border-2 border-gray-800 bg-white py-4 font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          Continue with Email
        </button>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-amber-700 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}