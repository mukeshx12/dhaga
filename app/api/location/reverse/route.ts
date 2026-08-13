type NominatimAddress = Record<string, string | undefined>;

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

const uniqueParts = (parts: Array<string | undefined>) =>
  parts.filter((part, index, values): part is string => Boolean(part) && values.indexOf(part) === index);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lon"));
  const language = searchParams.get("lang") === "hi" ? "hi" : "en";

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return Response.json({ error: "Valid latitude and longitude are required." }, { status: 400 });
  }

  // Area-level precision is enough for the header and avoids sending an exact doorway location.
  const roundedLatitude = latitude.toFixed(3);
  const roundedLongitude = longitude.toFixed(3);
  const baseUrl = process.env.REVERSE_GEOCODING_BASE_URL || "https://nominatim.openstreetmap.org";
  const endpoint = new URL("reverse", `${baseUrl.replace(/\/$/, "")}/`);
  endpoint.search = new URLSearchParams({
    format: "jsonv2",
    lat: roundedLatitude,
    lon: roundedLongitude,
    zoom: "14",
    addressdetails: "1",
    "accept-language": language,
  }).toString();

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Dhaga/1.0 (+https://www.joindhaga.com)",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return Response.json({ error: "Address lookup is temporarily unavailable." }, { status: 502 });
    }

    const result = (await response.json()) as NominatimResponse;
    const address = result.address || {};
    const area = address.suburb || address.neighbourhood || address.quarter || address.city_district || address.residential || address.village;
    const city = address.city || address.town || address.municipality || address.village || address.county;
    const state = address.state || address.state_district || "";
    const fallbackParts = result.display_name?.split(",").map((part) => part.trim()).filter(Boolean) || [];
    const primary = uniqueParts([area, city]).join(", ") || fallbackParts.slice(0, 2).join(", ");

    if (!primary) {
      return Response.json({ error: "No readable address was found." }, { status: 404 });
    }

    return Response.json(
      { primary, secondary: state },
      { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" } }
    );
  } catch {
    return Response.json({ error: "Address lookup is temporarily unavailable." }, { status: 502 });
  }
}
