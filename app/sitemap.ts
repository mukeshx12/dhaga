import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = "https://www.joindhaga.com";

const publicPages: MetadataRoute.Sitemap = [
  { url: siteUrl, changeFrequency: "weekly", priority: 1 },
  { url: `${siteUrl}/tailors`, changeFrequency: "daily", priority: 0.9 },
  { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${siteUrl}/how-it-works`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const tailors = await prisma.tailorProfile.findMany({
      where: {
        status: "VERIFIED",
        isVerified: true,
        user: { accountStatus: "ACTIVE" },
      },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    return [
      ...publicPages,
      ...tailors.map((tailor) => ({
        url: `${siteUrl}/tailors/${tailor.id}`,
        lastModified: tailor.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    console.error("Unable to include tailor profiles in sitemap:", error);
    return publicPages;
  }
}
