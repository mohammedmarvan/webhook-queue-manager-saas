import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { 
    "Content-Type": "application/json",
    "X-API-Key": import.meta.env.VITE_X_API_KEY
  },
});

export default api;
