import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import TailorServices from "@/app/tailor-dashboard/components/TailorServices";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tailor = await prisma.tailorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!tailor) {
    redirect("/become-tailor");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-black-900">
        My Services
      </h1>

      <p className="mt-2 text-gray-500">
        Manage the services you provide.
      </p>

      <TailorServices />
    </main>
  );
}
