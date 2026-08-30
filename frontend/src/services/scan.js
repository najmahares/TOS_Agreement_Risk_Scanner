import api from "../lib/api";

export async function createScan(title, text) {
  return api.post("/api/v1/scans", {
    title,
    text,
  });
}

export async function getScans() {
  return api.get("/api/v1/scans");
}

export async function getScan(scanId) {
  if (!scanId) {
    throw new Error("Scan ID is required.");
  }

  return api.get(`/api/v1/scans/${encodeURIComponent(scanId)}`);
}
