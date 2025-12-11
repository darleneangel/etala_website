// src/pages/RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    gender: "",
    civil_status: "",
    citizenship: "",
    birthdate: "",
    contact: "",
    address: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost/etala_website/etala-api/backend/register_api.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subheader">Fill out the details to register as a resident.</p>

        <form onSubmit={handleSubmit} className="register-form">

          {/* NAME FIELDS */}
          <div className="input-row">
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" name="last_name" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>First Name</label>
              <input type="text" name="first_name" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Middle Name</label>
              <input type="text" name="middle_name" onChange={handleChange} required />
            </div>
          </div>

          {/* GENDER & CIVIL STATUS */}
          <div className="input-row">
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="input-group">
              <label>Civil Status</label>
              <select name="civil_status" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>

          {/* CITIZENSHIP & BIRTHDATE */}
          <div className="input-row">
            <div className="input-group">
              <label>Citizenship</label>
              <input type="text" name="citizenship" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Birthdate</label>
              <input type="date" name="birthdate" onChange={handleChange} required />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              onChange={handleChange}
              required
            />
          </div>

          {/* CONTACT NUMBER */}
          <div className="input-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contact"
              placeholder="Enter Contact Number"
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
              <span
                className="input-icon clickable"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "👁️" : "🔒"}
              </span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="error-message">{error}</p>}

          {/* SUBMIT */}
          <button type="submit" className="register-btn">Register</button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>

        <p className="register-footer">
          <Link to="/">← Back to Homepage</Link>
        </p>

      </div>
    </div>
  );
}
