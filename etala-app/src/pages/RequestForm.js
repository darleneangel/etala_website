import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RequestForm.css";

export default function RequestForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const service = location.state?.service;

  if (!service) {
    return (
      <div className="rf-page">
        <div className="rf-card">
          <h2>No service selected.</h2>
          <button className="rf-btn" onClick={() => navigate("dashboard/services")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ⭐ Correct FormData
    const formData = new FormData();
    formData.append("service_type", service.id);
    formData.append("purpose", purpose);
    formData.append("notes", details);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(
        "http://localhost/etala_website/etala-api/backend/create_request.php",
        {
          method: "POST",
          credentials: "include", // ⭐ Needed for session
          body: formData, // ⭐ NO JSON.stringify!
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Request submitted successfully!");
        navigate("/dashboard/services");
      } else {
        alert(data.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="rf-page">
      <div className="rf-card animate-popup">
        <h1 className="rf-title">{service.title} Request</h1>
        <p className="rf-subtitle">{service.description}</p>

        <form onSubmit={handleSubmit} className="rf-form">
          
          <div className="rf-group">
            <label>Purpose of Request</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              placeholder="Ex: For job application, school requirement..."
            />
          </div>

          <div className="rf-group">
            <label>Additional Details (optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Extra details..."
            ></textarea>
          </div>

          <div className="rf-group">
            <label>Upload Supporting Document (optional)</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <button type="submit" className="rf-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <p className="rf-back" onClick={() => navigate("/dashboard/services")}>
          ← Back to Services
        </p>
      </div>
    </div>
  );
}
