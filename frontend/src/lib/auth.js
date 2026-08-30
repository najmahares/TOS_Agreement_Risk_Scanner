const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

export function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem(TOKEN_KEY);
  return null;
}

export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
}

async function request(endpoint, options) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    mode: "cors",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    let message = "Request failed";
    if (typeof data.detail === "string") message = data.detail;
    else if (Array.isArray(data.detail))
      message = data.detail.map((err) => err.msg || err).join(", ");
    else if (data.message) message = data.message;
    throw new Error(message);
  }

  return await response.json();
}

export async function loginUser(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.access_token || data.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token || "");
    localStorage.setItem(USER_KEY, JSON.stringify(data.user || data));
  }

  return data.user || data;
}

export async function registerUser(email, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
  }

  return await loginUser(email, password);
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
