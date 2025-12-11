import React, { useState } from "react";
import "./SDG11.css";
import Navbar from "../components/Navbar"; // ← include navbar


export default function SDG11() {
  const [selectedSDG11, setSelectedSDG11] = useState(null);


  const SDG11 = [
    {
      title: "Sustainable Communities",
      description:
        "Promotes resilient and inclusive barangays through safe housing, access to services, and community development programs.",
      icon: "🏘️",
    },
    {
      title: "Waste Management",
      description:
        "Efficient waste collection, segregation, recycling, and disposal to maintain a clean and healthy environment.",
      icon: "🗑️",
    },
    {
      title: "Disaster Preparedness",
      description:
        "Emergency response plans, evacuation training, and hazard awareness to ensure community safety.",
      icon: "🚨",
    },
    {
      title: "Green Spaces",
      description:
        "Tree planting, park improvement, and eco-friendly initiatives for clean air and community well-being.",
      icon: "🌳",
    },
    {
      title: "Clean Mobility",
      description:
        "Walkable pathways, safe bike routes, and eco-friendly transportation initiatives for sustainable mobility.",
      icon: "🚶‍♂️",
    },
    {
      title: "Climate Action",
      description:
        "Local climate adaptation programs, carbon reduction efforts, and environmental conservation projects.",
      icon: "🌎",
    },
  ];

  return (
    <div className="sdg11-page">
{/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <header className="sdg11-header">
        <h1 className="title">SDG 11: Sustainable Cities & Communities</h1>
        <p className="subtitle">
          Building inclusive, safe, resilient, and sustainable communities.
        </p>
      </header>

      {/* SERVICES GRID */}
      <div className="sdg11-grid">
        {SDG11.map((SDG11, index) => (
          <div
            key={index}
            className="sdg11-card"
            onClick={() => setSelectedSDG11(SDG11)}
          >
            <div className="icon">{SDG11.icon}</div>
            <h3>{SDG11.title}</h3>
          </div>
        ))}
      </div>

      {/* MODAL PREVIEW */}
      {selectedSDG11 && (
        <div className="modal-overlay" onClick={() => setSelectedSDG11(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedSDG11.title}</h2>
            <p>{selectedSDG11.description}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedSDG11(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
