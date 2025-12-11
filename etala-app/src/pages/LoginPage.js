// src/pages/LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch(
      "http://localhost/etala_website/etala-api/backend/login_api.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: username,
          password: password
        })
      }
    );

    const data = await response.json();
    console.log("API response:", data);

    if (data.success) {
      // Save user info
      localStorage.setItem("user", JSON.stringify({
      id: data.user.id,
      role: data.user.role,
      email: data.user.email
    }));


      // Redirect based on role
      if (data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

    } else {
      setError(data.message || "Login failed.");
    }

  } catch (err) {
    console.error(err);
    setError("Cannot connect to server.");
  }
};


  return (
    <div className="login-page">

      {/* LOGIN CARD */}
      <div className="login-card">

        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper input-icon-right">
              <input
                type="text"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="input-icon">📧</span>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper input">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          {/* OPTIONS */}
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
        </Link>
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="error-message">{error}</p>}

          {/* BUTTON */}
          <button type="submit" className="login-btn">Login</button>
        </form>

        {/* FOOTER LINKS */}
        <p className="login-footer">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
        <p className="login-footer">
          <Link to="/">← Back to Homepage</Link>
        </p>

      </div>
    </div>
  );
}
