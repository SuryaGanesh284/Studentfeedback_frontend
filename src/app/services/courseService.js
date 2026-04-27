import { authService } from "./authService";
import { apiUrl } from "../config/api";

const API_URL = apiUrl("/api/course");

export const courseService = {

  // ================= GET ALL COURSES =================
  getAllCourses: async () => {
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeader() // 🔥 clean token usage
        }
      });

      if (!res.ok) {
        console.error("Failed to fetch courses:", res.status);
        return [];
      }

      const data = await res.json();
      console.log("Courses:", data); // debug

      return data;

    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  // ================= ADD COURSE =================
  addCourse: async (course) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeader()
        },
        body: JSON.stringify(course)
      });

      if (!res.ok) {
        console.error("Failed to add course:", res.status);
        return null;
      }

      return await res.json();

    } catch (error) {
      console.error("Add course error:", error);
      return null;
    }
  },

  // ================= DELETE COURSE =================
  deleteCourse: async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          ...authService.getAuthHeader()
        }
      });

      if (!res.ok) {
        console.error("Failed to delete course:", res.status);
      }

    } catch (error) {
      console.error("Delete course error:", error);
    }
  }

};
