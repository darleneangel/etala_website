import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const email = useLocation().state?.email;

const handleReset = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      "http://localhost/etala_website/etala-api/backend/reset_password.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Password successfully reset!");
      navigate("/login");
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Network error. Try again.");
  }
};




  return (
    <div className="fp-page">
      <div className="fp-card animate-popup">

        <h2 className="fp-title">Create New Password</h2>
        <p className="fp-subtitle">Password must be at least 6 characters.</p>

        <form onSubmit={handleReset}>
          
          <label>New Password</label>
          <div className="pass-wrapper">
            <input 
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span 
              className="toggle-eye"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="fp-btn">Reset Password</button>
        </form>

        <p className="fp-footer" onClick={() => navigate("/login")}>← Back to Login</p>
      </div>
    </div>
  );
}
