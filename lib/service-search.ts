const synonymGroups = [
  ["blouse"],
  ["suit", "salwar", "kurta"],
  ["lehenga", "लहंगा"],
  ["alter", "fitting", "resize", "repair"],
  ["home", "measurement", "visit", "measure"],
  ["fall", "pico", "saree", "saare"],
];

export function getServiceSearchTerms(value: string) {
  const normalized = value.trim().toLocaleLowerCase();
  if (!normalized) return [];

  const matchedGroup = synonymGroups.find((group) =>
    group.some((term) => normalized.includes(term))
  );

  return matchedGroup || [normalized];
}

export function buildTailorServiceFilter(value: string) {
  const terms = getServiceSearchTerms(value);
  if (!terms.length) return undefined;

  return {
    some: {
      OR: terms.map((term) => ({
        serviceName: {
          contains: term,
          mode: "insensitive" as const,
        },
      })),
    },
  };
}
