import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {

    if (!email || !otp || !newPassword) {
      alert("All fields are required ❗");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword
        })
      });

      const data = await res.text();

      if (res.ok) {
        alert("Password reset successful ✅");

        // 🔥 Redirect to login
        navigate("/login");

      } else {
        alert(data || "Reset failed ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">

      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Reset Password 🔐
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* OTP */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">OTP</label>
          <input
            className="w-full border p-2 rounded mt-1 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">New Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={resetPassword}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}
