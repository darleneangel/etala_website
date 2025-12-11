import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const serverOtp = location.state?.serverOtp;

  const handleVerify = (e) => {
    e.preventDefault();

    if (!serverOtp) {
      alert("OTP not found. Please request again.");
      navigate("/forgot-password");
      return;
    }

    if (otp === serverOtp.toString()) {
      navigate("/reset-password", { state: { email } });
    } else {
      alert("Invalid OTP. Try again!");
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card animate-popup">

        <h2 className="fp-title">Verify Code</h2>
        <p className="fp-subtitle">Enter the 6-digit code sent to <b>{email}</b></p>

        <form onSubmit={handleVerify}>
          <label>OTP Code</label>
          <input 
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
            required
          />

          <button type="submit" className="fp-btn">Verify</button>
        </form>

        <p className="fp-footer" onClick={() => navigate("/forgot-password")}>← Back</p>
      </div>
    </div>
  );
}
