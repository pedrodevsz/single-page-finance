import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const isApiConfigured = Boolean(apiBaseUrl);

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
