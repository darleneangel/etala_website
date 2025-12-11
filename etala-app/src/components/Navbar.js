import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="./images/logo.png" className="nav-logo" alt="E-TALA Logo" />
        <h1 className="brand">E-TALA</h1>
      </div>

      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/sdg">SDG 11</a></li>
        <li><a href="/about">About</a></li>
        <li><a className="login-btn" href="/login">Login</a></li>
      </ul>
    </nav>
  );
}
