import "server-only";

import { prisma } from "@/lib/prisma";

const WINDOW_MS = 10 * 60 * 1000;

export async function consumeOtpLimit(phone: string, ip: string) {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "OtpRateLimit" (
      "key" TEXT PRIMARY KEY,
      "count" INTEGER NOT NULL DEFAULT 0,
      "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const limits = [
    { key: `phone:${phone}`, max: 3 },
    { key: `ip:${ip}`, max: 10 },
  ];

  for (const limit of limits) {
    const rows = await prisma.$queryRawUnsafe<Array<{ count: number; windowStart: Date }>>(
      `INSERT INTO "OtpRateLimit" ("key", "count", "windowStart")
       VALUES ($1, 1, $2)
       ON CONFLICT ("key") DO UPDATE SET
         "count" = CASE WHEN "OtpRateLimit"."windowStart" < $3 THEN 1 ELSE "OtpRateLimit"."count" + 1 END,
         "windowStart" = CASE WHEN "OtpRateLimit"."windowStart" < $3 THEN $2 ELSE "OtpRateLimit"."windowStart" END
       RETURNING "count", "windowStart"`,
      limit.key,
      now,
      windowStart
    );
    if ((rows[0]?.count ?? 0) > limit.max) return false;
  }
  return true;
}
