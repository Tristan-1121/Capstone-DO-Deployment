import api from "./http";

// POST /api/users/login  -> backend returns flat shape
export async function login(email, password) {
  const { data } = await api.post("/users/login", { email, password });
  return data;
}

// POST /api/users/register
export async function register(fullName, email, password) {
  const parts = String(fullName).trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.length > 1 ? parts.slice(-1)[0] : "";
  if (!firstName || !lastName) {
    throw new Error("Please include first and last name");
  }
  const { data } = await api.post("/users/register", {
    firstName,
    lastName,
    email,
    password,
  });
  return data;
}

export async function me() {
  const { data } = await api.get("/users/me");
  return data;
}
