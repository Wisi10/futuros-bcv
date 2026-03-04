import axios from "axios";
import https from "https";
import * as cheerio from "cheerio";

const BCV_URL = "https://www.bcv.org.ve/";
const TIMEOUT_MS = 8000;

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

  const usd_bs = parseFloat(usdText.replace(",", "."));
  const eur_bs = parseFloat(eurText.replace(",", "."));

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
