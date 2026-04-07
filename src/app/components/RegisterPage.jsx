import { useState } from "react";
import { authService } from "../services/authService";

export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ================= SEND OTP =================
  const sendOtp = async () => {

    console.log("Sending OTP with:", email, password);

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const res = await authService.register("User", email, password);

    setLoading(false);

    console.log("REGISTER RESPONSE:", res);

    if (!res) {
      alert("Server error");
      return;
    }

    if (res.includes("User already exists")) {
      alert("User already registered");
      return;
    }

    if (res.includes("OTP")) {
      alert("OTP sent to your email");
      setStep(2);
    } else {
      alert("Something went wrong");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {

    console.log("Verifying OTP:", email, otp);

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setLoading(true);

    const success = await authService.verifyOtp(email, otp);

    setLoading(false);

    console.log("VERIFY RESPONSE:", success);

    if (success) {
      alert("Registration successful 🎉");
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Register</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button style={styles.button} onClick={sendOtp}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button style={styles.button} onClick={verifyOtp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "green" }}>✅ Account Created</h3>
            <p>You can now login</p>
          </div>
        )}

      </div>
    </div>
  );
}


// ================= UI STYLES =================
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    fontFamily: "Arial"
  },

  card: {
    background: "#fff",
    padding: "35px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#4facfe",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  }
};
