export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://studentfeedback-backend-k883.onrender.com";

export const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Ldzaa0sAAAAADltDvlf8rb-6RxkflQ_2fLuh_uv";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
