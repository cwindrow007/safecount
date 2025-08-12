import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL = "https://www.usps.com/business/prices.htm";

function extractPrice(text) {
    // look for "Forever ... $0.XX" on the business/prices page
    const t = text.replace(/\s+/g, " ");
    const m = t.match(/Letter(?:\s+stamp)?[^$]{0,80}\$\s*(\d+(?:\.\d{2})?)/i);
    if (!m) throw new Error("Forever stamp price not found");
    return Number.parseFloat(m[1]);
}

async function main() {
    const html = (await axios.get(URL, { timeout: 15000 })).data;
    const $ = cheerio.load(html);
    const price = extractPrice($("body").text());

    const payload = {
        price,                 // dollars
        currency: "USD",
        asOf: new Date().toISOString(),
        source: URL
    };

    fs.writeFileSync("stamp-price.json", JSON.stringify(payload, null, 2));
    console.log("Saved", payload);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});