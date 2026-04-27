import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {

    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.text();

      if (res.ok) {
        alert("OTP sent successfully ✅");

        // 🔥 NAVIGATE TO RESET PAGE
        navigate("/reset-password", { state: { email } });

      } else {
        alert(data || "Failed to send OTP");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </div>
    </div>
  );
}
