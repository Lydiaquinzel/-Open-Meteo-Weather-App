import { API_BASE } from "./config";

console.log("API_BASE:", API_BASE);

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  return res.json();
}

// Health check
export async function getHealth() {
  const res = await fetch(`${API_BASE}/health/`);
  return handleResponse(res);
}

// Load weather
export async function postLoadWeather(
  city: string,
  startDate: string,
  endDate: string
) {
  const res = await fetch(`${API_BASE}/load/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city,
      start_date: startDate,
      end_date: endDate,
    }),
  });

  return handleResponse(res);
}

// Temperature stats
export async function getTemperatureStats(
  city: string,
  start?: string,
  end?: string
) {
  const url = new URL(`${API_BASE}/temperature/`);
  url.searchParams.append("city", city);
  if (start) url.searchParams.append("start_date", start);
  if (end) url.searchParams.append("end_date", end);

  const res = await fetch(url.toString());
  return handleResponse(res);
}

// Precipitation stats
export async function getPrecipitationStats(
  city: string,
  startDate: string,
  endDate: string
) {
  const url = new URL(`${API_BASE}/precipitation/`);
  url.searchParams.append("city", city);
  url.searchParams.append("start_date", startDate);
  url.searchParams.append("end_date", endDate);

  const res = await fetch(url.toString());
  return handleResponse(res);
}

// Global stats
export async function getGlobalStats() {
  const res = await fetch(`${API_BASE}/global-stats/`);
  return handleResponse(res);
}
