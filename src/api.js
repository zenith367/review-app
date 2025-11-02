// src/api.js
import axios from "axios";
import { auth } from "./firebase";

// Use the backend URL from environment variables if available, otherwise fallback
const API_BASE = process.env.REACT_APP_API_BASE || "https://test-uiyf.onrender.com";

// Function to get Firebase Auth token for authenticated requests
async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) return {}; // no auth header if not logged in
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// Axios instance for making API requests
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Optional: You can add interceptors here for logging or token refresh
// api.interceptors.request.use(request => {
//   console.log('Starting Request', request)
//   return request
// })

export default api;
export { getAuthHeader };
