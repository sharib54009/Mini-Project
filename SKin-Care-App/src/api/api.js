import axios from 'axios';

const DEFAULT_BACKEND_URL = 'http://127.0.0.1:5000';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;

export const api = axios.create({
  baseURL: BACKEND_URL,
});

export async function apiFetch(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return fetch(`${BACKEND_URL}${normalizedEndpoint}`, options);
}

export function apiUrl(endpoint) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BACKEND_URL}${normalizedEndpoint}`;
}
