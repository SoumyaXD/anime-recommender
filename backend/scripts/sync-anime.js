const fs = require("fs/promises");
const path = require("path");

const OUTPUT_FILE = path.join(__dirname, "..", "data", "anime.json");
const API_URL = "https://api.jikan.moe/v4/top/anime";
const DEFAULT_PAGES = 8;
const MAX_PAGES = 40;
const PAGE_LIMIT = 25;
const REQUEST_DELAY_MS = 450;

function parsePagesArg() {
  const pagesArg = process.argv.find((arg) => arg.startsWith("--pages="));
  if (!pagesArg) return DEFAULT_PAGES;
  const parsed = Number.parseInt(pagesArg.split("=")[1], 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_PAGES;
  return Math.min(parsed, MAX_PAGES);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function trimText(value) {
  if (!value || typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim().length > 0))];
}

function mapAnime(item) {
  const images = uniqueStrings([
    item?.images?.jpg?.large_image_url,
    item?.images?.jpg?.image_url,
    item?.images?.jpg?.small_image_url,
    item?.images?.webp?.large_image_url,
    item?.images?.webp?.image_url,
    item?.images?.webp?.small_image_url,
    item?.trailer?.images?.maximum_image_url,
    item?.trailer?.images?.large_image_url,
    item?.trailer?.images?.medium_image_url,
    item?.trailer?.images?.small_image_url,
  ]);

  const id = item?.mal_id;
  const title = trimText(item?.title);
  if (!Number.isFinite(id) || !title) return null;

  return {
    id,
    source: "jikan",
    sourceId: id,
    title,
    titleJapanese: trimText(item?.title_japanese),
    rating: Number.isFinite(item?.score) ? item.score : null,
    description: trimText(item?.synopsis) || "Description not available.",
    genres: uniqueStrings((item?.genres || []).map((genre) => trimText(genre?.name))),
    image: images[0] || "",
    images,
    episodes: Number.isFinite(item?.episodes) ? item.episodes : null,
    status: trimText(item?.status) || null,
    year: Number.isFinite(item?.year) ? item.year : null,
  };
}

async function fetchPage(page) {
  const url = `${API_URL}?page=${page}&limit=${PAGE_LIMIT}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed page ${page}: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return Array.isArray(json?.data) ? json.data : [];
}

async function main() {
  const pages = parsePagesArg();
  const all = [];

  console.log(`Syncing anime from Jikan: ${pages} page(s)`);

  for (let page = 1; page <= pages; page += 1) {
    const pageItems = await fetchPage(page);
    all.push(...pageItems);
    console.log(`Fetched page ${page} (${pageItems.length} records)`);
    if (page < pages) await sleep(REQUEST_DELAY_MS);
  }

  const mapped = all.map(mapAnime).filter(Boolean);
  const dedupedById = [...new Map(mapped.map((anime) => [anime.id, anime])).values()];
  const readyForApp = dedupedById.filter((anime) => anime.image);

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(readyForApp, null, 2)}\n`, "utf8");

  console.log(`Saved ${readyForApp.length} anime to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error("Anime sync failed:", error.message);
  process.exit(1);
});
