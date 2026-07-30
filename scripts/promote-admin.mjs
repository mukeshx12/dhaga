import { PrismaClient } from "@prisma/client";

const email = process.argv[2]?.toLowerCase().trim();
if (!email) {
  console.error("Usage: npm run admin:promote -- admin@example.com");
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN", accountStatus: "ACTIVE" },
    select: { id: true, name: true, email: true, role: true },
  });
  console.log(`Admin access granted to ${user.email}.`);
} catch {
  console.error("Could not promote this user. Confirm the email is already registered.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
