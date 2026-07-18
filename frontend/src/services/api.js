const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function fetchAnime({ page = 1, limit = 20, search = "", genre = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (search) params.set("q", search);
  if (genre) params.set("genre", genre);

  const res = await fetch(`${API_BASE_URL}/api/anime?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch anime");

  return res.json(); // { data: [...], meta: { total, page, limit, hasNextPage } }
}

export async function fetchAnimeById(id) {
  const res = await fetch(`${API_BASE_URL}/api/anime/${id}`);
  if (!res.ok) throw new Error("Failed to fetch anime details");
  return res.json();
}
