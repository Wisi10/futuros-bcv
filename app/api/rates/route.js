import { fetchBCVRates } from "@/lib/scraper";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
  "Content-Type": "application/json",
};

export async function GET() {
  try {
    const data = await fetchBCVRates();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "No se pudo obtener la tasa del BCV",
        detail: error.message,
        fetched_at: new Date().toISOString(),
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
