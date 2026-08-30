const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { getToken, logoutUser } from "./auth";

function getErrorMessage(data) {
  if (typeof data === "string") return data;
  if (data?.detail) {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((err) => {
          const loc = err.loc?.join(" ") || "Field";
          const msg = err.msg?.replace(/_/g, " ") || "Invalid input";
          return `${loc}: ${msg}`;
        })
        .join(", ");
    }
  }
  if (data?.message) return data.message;
  return "Something went wrong. Please try again.";
}

async function fetchWithAuth(url, options) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    ...options,
    mode: "cors",
    headers,
  });

  if (response.status === 401) {
    logoutUser();
    if (typeof window !== "undefined") {
      alert("Your session has ended. Please log in again to continue.");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Redirecting to login...");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(data));
  }

  return await response.json();
}

export async function createScan(title, content) {
  return fetchWithAuth(`${API_URL}/scans`, {
    method: "POST",
    body: JSON.stringify({ title, text: content }),
  });
}

export async function getScans() {
  return fetchWithAuth(`${API_URL}/scans`, {
    method: "GET",
  });
}

export async function getScan(scanId) {
  if (!scanId) throw new Error("Scan ID is required.");
  return fetchWithAuth(`${API_URL}/scans/${encodeURIComponent(scanId)}`, {
    method: "GET",
  });
}

export async function deleteScan(scanId) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(
    `${API_URL}/scans/${encodeURIComponent(scanId)}`,
    {
      method: "DELETE",
      mode: "cors",
      headers,
    },
  );

  if (response.status === 401) {
    logoutUser();
    if (typeof window !== "undefined") {
      alert("Your session has ended. Please log in again to continue.");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Redirecting to login...");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(data));
  }

  return await response.text();
}
