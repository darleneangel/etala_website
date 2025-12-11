// ForgotPasswordPage.js
import React, { useState } from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      "http://localhost/etala_website/etala-api/backend/send_otp.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (data.success) {
      // ✅ Pass email + OTP forward (or just email if you will verify via backend)
      navigate("/verify-otp", { state: { email, serverOtp: data.otp } });
    } else {
      alert(data.message || "Failed to send OTP.");
    }
  } catch (err) {
    console.error("Send OTP error:", err);
    alert("Network error. Try again.");
  }
};


  return (
    <div className="fp-page">
      <div className="fp-card animate-popup">
        <h2 className="fp-title">Reset Password</h2>
        <p className="fp-subtitle">
          Enter your email to receive a verification code.
        </p>

        <form onSubmit={handleSendOTP}>
          <label>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />

          {error && <p className="fp-error">{error}</p>}

          <button type="submit" className="fp-btn" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="fp-footer" onClick={() => navigate("/login")}>
          ← Back to Login
        </p>
      </div>
    </div>
  );
}
