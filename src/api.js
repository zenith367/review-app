// src/api.js
import axios from "axios";
import { auth } from "./firebase";

const API_BASE = process.env.REACT_APP_API_BASE || "https://test-uiyf.onrender.com";

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// Axios instance (optional) — useful for request interceptors later
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export default api;
export { getAuthHeader };
