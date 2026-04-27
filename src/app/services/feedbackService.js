import { apiUrl } from "../config/api";

const BASE_URL = apiUrl("/api/feedback");

export const feedbackService = {

  // ================= SUBMIT FEEDBACK =================
  submitFeedback: async (feedback) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("auth_token")
        },
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        console.error("Submit failed");
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error("Submit error:", error);
      return null;
    }
  },

  // ================= GET ALL FEEDBACK =================
  getAllFeedbacks: async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("auth_token")
        }
      });

      if (!response.ok) {
        console.error("Fetch failed");
        return [];
      }

      return await response.json();

    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  },

  // ================= GET BY STUDENT =================
  getFeedbacksByStudent: async (studentId) => {
    const all = await feedbackService.getAllFeedbacks();
    return all.filter(f => f.studentId === studentId);
  },

  // ================= GET BY TYPE =================
  getFeedbacksByType: async (type) => {
    const all = await feedbackService.getAllFeedbacks();
    return all.filter(f => f.type === type);
  }
};
