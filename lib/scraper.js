import axios from "axios";
import https from "https";
import * as cheerio from "cheerio";

const BCV_URL = "https://www.bcv.org.ve/";
const TIMEOUT_MS = 8000;

// El BCV publica en formato venezolano: "1.004,96160000" (punto = miles, coma = decimal).
// Hay que sacar TODOS los puntos antes de cambiar la coma; si no, "1.004,96" se lee como 1.004.
export function parseVeNumber(text) {
  const clean = String(text).replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(clean);
}

export async function fetchBCVRates() {
  const response = await axios.get(BCV_URL, {
    timeout: TIMEOUT_MS,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(response.data);

  const usdText = $("#dolar strong").text().trim();
  const eurText = $("#euro strong").text().trim();

  if (!usdText || !eurText) {
    throw new Error("No se encontraron los valores de tasa en el HTML del BCV");
  }

  const usd_bs = parseVeNumber(usdText);
  const eur_bs = parseVeNumber(eurText);

  if (isNaN(usd_bs) || isNaN(eur_bs)) {
    throw new Error(
      `Valores no numéricos: USD="${usdText}", EUR="${eurText}"`
    );
  }

  // Extract effective date text
  let effectiveDate = "";
  $(".pull-right.dinpro.center").each((_, el) => {
    const text = $(el).text().trim();
    if (text) effectiveDate = text;
  });

  // If that selector didn't work, try the date near the rates
  if (!effectiveDate) {
    $(".fecha-valor, .date-display-single").each((_, el) => {
      const text = $(el).text().trim();
      if (text) effectiveDate = text;
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return {
    eur_bs: Math.round(eur_bs * 100) / 100,
    usd_bs: Math.round(usd_bs * 100) / 100,
    date: today,
    effective_date: effectiveDate || today,
    source: "BCV oficial",
    fetched_at: new Date().toISOString(),
  };
}
