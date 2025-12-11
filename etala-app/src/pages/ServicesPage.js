import React, { useState } from "react";
import "./ServicesPage.css";
import Navbar from "../components/Navbar"; // ← include navbar


export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null);


  const services = [
    {
      title: "Barangay Clearance",
      description:
        "Residents may request a Barangay Clearance for employment, travel, or documentation purposes.",
      icon: "📝",
    },
    {
      title: "Business Permit",
      description:
        "Apply for new business permits or renew existing ones through streamlined processing.",
      icon: "🏢",
    },
    {
      title: "Residency Certificate",
      description:
        "Proof of residency issued for school, job, court, or legal documentation.",
      icon: "📄",
    },
    {
      title: "Cedula (Community Tax Certificate)",
      description:
        "Secure your Cedula for legal transactions, employment, and other official requirements.",
      icon: "💳",
    },
    {
      title: "Indigency Certificate",
      description:
        "Issued to qualified residents for medical, educational, or legal assistance.",
      icon: "🤝",
    },
    {
      title: "Blotter Report",
      description:
        "Submit community concerns or incidents for proper documentation and mediation.",
      icon: "🚨",
    },
  ];

  return (
    <div className="services-page">
{/* NAVBAR */}
      <Navbar />

      {/* HEADER */}
      <header className="services-header">
        <h1 className="title">Our Services</h1>
        <p className="subtitle">
          Choose from the available barangay services below.
        </p>
      </header>

      {/* SERVICES GRID */}
      <div className="services-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            onClick={() => setSelectedService(service)}
          >
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>

      {/* MODAL PREVIEW */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedService.title}</h2>
            <p>{selectedService.description}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedService(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
