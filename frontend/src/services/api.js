const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function fetchAnime() {
  const res = await fetch(`${API_BASE_URL}/api/anime`);

  if (!res.ok) {
    throw new Error("Failed to fetch anime");
  }

  return res.json();
}

export async function fetchAnimeById(id) {
  const res = await fetch(`${API_BASE_URL}/api/anime/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch anime details");
  }

  return res.json();
}
