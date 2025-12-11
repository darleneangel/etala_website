import React, { useState } from "react";
import "./AboutPage.css";
import Navbar from "../components/Navbar"; // navbar component

export default function AboutPage() {
  const [selectedDev, setSelectedDev] = useState(null);

  // TEAM DEVELOPERS (replace images)
  const developers = [
    {
      name: "Darlene Angel L. Custodio",
      role: "Frontend & System Designer",
      img: "/images/PICTUREKO.jpg",
      desc: "Leads UI/UX, front-end structure, and visual system design.",
    },
    {
      name: "Lee Ann Raven O. Alberto",
      role: "Backend & Database Engineer",
      img: "/images/raven.jpg.png",
      desc: "Handles backend logic, database management, and server integration.",
    },
  ];

  return (
    <div className="about-page">
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <header className="about-header">
        <h1 className="title">About the System</h1>
        <p className="subtitle">
          A modernized Barangay Information System designed to improve workflow,
          transparency, and community service delivery.
        </p>
      </header>

      {/* DESCRIPTION */}
      <div className="about-section">
        <h2 className="section-title">Project Background</h2>
        <p className="section-text">
          This system is a capstone project developed for our <strong>WeDevelopment subject</strong>.
          The goal is to create a digital bridge that replaces outdated manual processes by
          modernizing record handling, improving accessibility, and reducing administrative delays 
          within the barangay.
        </p>
      </div>

      {/* MISSION & VISION */}
      <div className="about-section">
        <h2 className="section-title">Mission</h2>
        <p className="section-text">
          To provide a fast, transparent, and accessible Barangay Information System that empowers
          communities through technology-driven solutions.
        </p>

        <h2 className="section-title mt-10">Vision</h2>
        <p className="section-text">
          A fully digital barangay ecosystem where services are efficient, records are secure, and
          residents are better served through innovation and automation.
        </p>
      </div>

      {/* HOW IT WAS CREATED */}
      <div className="about-section">
        <h2 className="section-title">How the System Was Created</h2>
        <p className="section-text">
          This platform was developed using modern web technologies such as React, Tailwind CSS,
          Node.js, and structured data management. It was built to modernize file handling in CETC,
          streamline resident services, and bridge communication between barangay officials and the 
          community.
        </p>
      </div>

      {/* DEVELOPER TEAM */}
      <div className="about-section">
        <h2 className="section-title">Developers</h2>

        <div className="dev-grid">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="dev-card"
              onClick={() => setSelectedDev(dev)}
            >
              <img src={dev.img} alt={dev.name} className="dev-img" />
              <h3 className="dev-name">{dev.name}</h3>
              <p className="dev-role">{dev.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedDev && (
        <div className="modal-overlay" onClick={() => setSelectedDev(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedDev.img}
              alt={selectedDev.name}
              className="modal-img"
            />
            <h2 className="modal-title">{selectedDev.name}</h2>
            <p className="modal-role">{selectedDev.role}</p>

            <p className="modal-desc">{selectedDev.desc}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedDev(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
