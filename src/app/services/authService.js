import { apiUrl } from "../config/api";

const BASE_URL = apiUrl("/api/auth");
const TOKEN_KEY = "token";

export const authService = {

  register: async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) return null;

    return await response.text();
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      if (!response.ok) return false;

      const result = await response.text();

      return result.includes("success") || result.includes("registered");

    } catch (error) {
      console.error("OTP error:", error);
      return false;
    }
  },

  // ================= LOGIN =================
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        console.error("Login failed:", response.status);
        return null;
      }

      const token = await response.text();

      if (!token) return null;

      console.log("JWT TOKEN:", token);

      localStorage.setItem(TOKEN_KEY, token);

      return token;

    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },

  // ================= LOGOUT =================
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // ================= GET TOKEN =================
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // ================= AUTH CHECK =================
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // ================= GET CURRENT USER =================
  getCurrentUser: () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        email: payload.sub,
        role: payload.role
      };

    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // ================= AUTH HEADER =================
  getAuthHeader: () => {
    const token = localStorage.getItem(TOKEN_KEY);

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }

};
