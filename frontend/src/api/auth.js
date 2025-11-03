import api from "./http";

// POST /api/users/login  -> backend returns a FLAT shape:
// { id, username, email, fullName, role, token }
export async function login(email, password) {
  const { data } = await api.post("/api/users/login", { email, password });
  return data; // don't assume { user: {...}, token }
}

// POST /api/users/register -> backend returns a FLAT shape:
// { email, fullName, role, token } (or similar flat)
export async function register(fullName, email, password) {
  // backend expects firstName + lastName (You showed that in routes)
  const parts = String(fullName).trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.length > 1 ? parts.slice(-1)[0] : "";
  if (!firstName || !lastName) {
    throw new Error("Please include first and last name");
  }
  const { data } = await api.post("/api/users/register", {
    firstName,
    lastName,
    email,
    password,
  });
  return data; // don't assume { user: {...}, token }
}

// Optional
export async function me() {
  const { data } = await api.get("/api/users/me");
  return data;
}
