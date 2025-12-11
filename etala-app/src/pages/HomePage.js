import React from "react";
import "./HomePage.css";
import ImageCarousel from "../components/ImageCarousel"; // ← IMPORT CAROUSEL

export default function HomePage() {
  return (
    <div className="homepage">
      <style>{`
        /* HERO SECTION */
        .hero {
          display: flex;
          justify-content: space-between;
          padding: 160px 8% 80px;
          align-items: center;
          gap: 60px;
          position: relative;
        }

        /* Background Blob */
        .hero::before {
          content: '';
          position: absolute;
          top: -10%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
          z-index: 0;
          pointer-events: none;
        }

        .hero-text {
          max-width: 550px;
          z-index: 1;
        }

        .hero-text h2 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0 0 24px 0;
          line-height: 1.1;
          color: white;
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards 0.2s;
        }

        .hero-text h2 span {
          background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text p {
          font-size: 1.125rem;
          margin-top: 0;
          color: #94a3b8;
          line-height: 1.6;
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards 0.4s;
        }

        .hero-buttons {
          margin-top: 40px;
          display: flex;
          gap: 16px;
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards 0.6s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 14px 32px;
          border-radius: 12px;
          text-decoration: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.5);
        }

        .btn-outline {
          padding: 14px 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          text-decoration: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
          transform: translateY(-2px);
        }

        .hero-image {
          flex: 1;
          height: 450px;
          position: relative;
          z-index: 1;
          opacity: 0;
          animation: fadeLeft 1s ease forwards 0.4s;
        }

        /* Floating Animation for Carousel Container */
        .hero-image > div { 
          animation: float 6s ease-in-out infinite;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
        }

        /* ------------------------------------------------ */
        /* MODERN NEWS SECTION STYLES                       */
        /* ------------------------------------------------ */
        .news {
          padding: 80px 60px;
          background: rgba(0,0,0,0.2); 
        }

        .news h3 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 50px;
          text-align: left;
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          border-left: 5px solid #3b82f6;
          padding-left: 20px;
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards 0.2s; /* Animate Title */
        }

        .news-list {
          display: flex; /* Horizontal Layout */
          flex-direction: row;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap; 
        }

        .news-card {
          flex: 1;
          min-width: 300px;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          min-height: 400px; 
          
          /* Animation Properties */
          opacity: 0; 
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Staggered Delay for Cards */
        .news-card:nth-child(1) { animation-delay: 0.3s; }
        .news-card:nth-child(2) { animation-delay: 0.5s; }
        .news-card:nth-child(3) { animation-delay: 0.7s; }

        .news-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(59, 130, 246, 0.5); /* Blue border glow */
          box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.4);
        }

        /* Image Styling */
        .news-card img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          border-radius: 14px;
          margin-bottom: 20px;
          transition: transform 0.5s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .news-card:hover img {
          transform: scale(1.05);
        }

        /* Typography */
        .news-card h4 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: white;
          transition: color 0.3s ease;
        }

        .news-card:hover h4 {
          color: #60a5fa; /* Title turns blue on hover */
        }

        .news-card p {
          color: #94a3b8;
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ------------------------------------------------ */
        /* ANIMATIONS DEFINITIONS                           */
        /* ------------------------------------------------ */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .news-list { justify-content: center; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .navbar { justify-content: center; }
          .nav-left { margin-right: auto; }
          .hero { flex-direction: column-reverse; text-align: center; padding: 120px 20px 40px; }
          .hero-text { max-width: 100%; }
          .hero-buttons { justify-content: center; }
          .news { padding: 40px 20px; }
          .news-card { min-width: 100%; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src="./images/logo.png" className="logo" alt="logo" />
          <h1 className="brand">E-TALA</h1>
        </div>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/Services">Services</a></li>
          <li><a href="/sdg">SDG 11</a></li>
          <li><a href="/about">About</a></li>
          <li><a className="login-btn" href="/login">Login</a></li>
        </ul>
      </nav>

{/* HERO SECTION */}
      <section className="hero">

        {/* LEFT TEXT */}
        <div className="hero-text">
          <h2>
            Empowering the Community Through <span>E-TALA</span>
          </h2>
          <p>Modern, transparent, and accessible Barangay Information System.</p>

          <div className="hero-buttons">
            <a href="/services" className="btn-primary">Explore Services</a>
            <a href="/about" className="btn-outline">Learn More</a>
          </div>
        </div>

        {/* RIGHT IMAGE CAROUSEL */}
        <div className="hero-image">
          <ImageCarousel /> 
        </div>
      </section>
{/* NEWS SECTION */}
      <section className="news">
        <h3>Latest News & Events</h3>

        <div className="news-list">
          <div className="news-card">
            <img 
              src="/images/feeding.jpg" 
              alt="Feeding Program" 
              onError={(e) => { e.target.src='https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}}
            />
            <h4>Feeding Program</h4>
            <p>Providing meals for children to promote better health.</p>
          </div>

          <div className="news-card">
            <img 
              src="/images/tree.jpg" 
              alt="Tree Planting"
              onError={(e) => { e.target.src='https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}}
            />
            <h4>Tree Planting</h4>
            <p>Community effort to support environmental sustainability.</p>
          </div>

          <div className="news-card">
            <img 
              src="/images/cleanup.png" 
              alt="Clean-Up Drive"
              onError={(e) => { e.target.src='https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}}
            />
            <h4>Clean-Up Drive</h4>
            <p>Volunteers unite to maintain a clean environment.</p>
          </div>
        </div>
      </section>

    </div>
  );
}