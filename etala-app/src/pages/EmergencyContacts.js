import React, { useState, useEffect } from "react";
import {
  Home, User, FileText, Bell,
  Phone, LogOut, Menu, AlertTriangle, Smartphone
} from "lucide-react";

// =========================================
// 1. SIDEBAR COMPONENT (Internal)
// =========================================
const Sidebar = ({ collapsed, setCollapsed }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleToggle = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const isActive = (path) => currentPath === path;

  return (
    <>
      <style>{`
        /* SIDEBAR CONTAINER */
        .sidebar {
          background: linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
          color: white;
          height: 100vh;
          width: 260px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
          z-index: 50;
          position: relative;
        }

        /* COLLAPSED STATE */
        .sidebar.collapsed {
          width: 80px;
        }

        /* HEADER */
        .sidebar-header {
          height: 80px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          justify-content: flex-start;
          gap: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 0;
          gap: 0;
        }

        .toggle-btn {
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s, transform 0.2s;
          min-width: 24px;
        }
        .toggle-btn:hover { color: white; transform: scale(1.1); }

        /* TITLE ANIMATION */
        .sidebar-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #60a5fa;
          white-space: nowrap;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.3s ease 0.1s, transform 0.3s ease;
        }

        .sidebar.collapsed .sidebar-title {
          opacity: 0;
          transform: translateX(20px);
          pointer-events: none;
          position: absolute;
          transition: none;
        }

        /* MENU LIST */
        .menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 15px 12px;
          gap: 8px;
          overflow-x: hidden;
        }

        /* MENU ITEMS */
        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          color: #cbd5e1;
          background: transparent;
          border: none;
          width: 100%;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          height: 48px;
        }

        .sidebar.collapsed .menu-item {
          justify-content: center;
          padding: 0;
          width: 100%;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
          transform: translateX(4px);
        }
        
        .sidebar.collapsed .menu-item:hover {
          transform: none;
          background: rgba(255,255,255,0.1);
        }

        /* ACTIVE STATE */
        .menu-item.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 10%; bottom: 10%;
          width: 4px;
          background: #60a5fa;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        .menu-item svg {
          margin-right: 14px;
          min-width: 22px;
          transition: color 0.3s;
        }

        .sidebar.collapsed .menu-item svg {
          margin-right: 0;
        }

        .menu-item.active svg {
          color: #60a5fa;
          filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.6));
        }

        .menu-text {
          opacity: 1;
          transition: opacity 0.3s ease 0.1s;
        }

        .sidebar.collapsed .menu-text {
          opacity: 0;
          display: none;
        }

        /* LOGOUT BUTTON */
        .logout {
          margin-top: auto;
          color: #f87171;
          margin-bottom: 20px;
        }
        .logout:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fade 0.3s ease;
        }
        .modal-content {
          background: #1e293b;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          max-width: 350px;
          width: 90%;
          color: white;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: scale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-row { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
        .btn-confirm { background: #ef4444; color: white; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none;}
        .btn-cancel { background: rgba(255,255,255,0.1); color: white; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; border: none;}

        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Menu className="toggle-btn" size={26} onClick={handleToggle} />
          <h2 className="sidebar-title">E-TALA</h2>
        </div>

        <nav className="menu">
          <button className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => window.location.href="/dashboard"}>
            <Home size={20} /> <span className="menu-text">Dashboard</span>
          </button>
          <button className={`menu-item ${isActive('/dashboard/services') ? 'active' : ''}`} onClick={() => window.location.href="/dashboard/services"}>
            <FileText size={20} /> <span className="menu-text">Services & Requests</span>
          </button>
          <button className={`menu-item ${isActive('/dashboard/requests') ? 'active' : ''}`} onClick={() => window.location.href="/dashboard/requests"}>
            <FileText size={20} /> <span className="menu-text">Request History</span>
          </button>
          <button className={`menu-item ${isActive('/dashboard/profile') ? 'active' : ''}`} onClick={() => window.location.href="/dashboard/profile"}>
            <User size={20} /> <span className="menu-text">My Profile</span>
          </button>
          <button className={`menu-item ${isActive('/dashboard/announcements') ? 'active' : ''}`} onClick={() => window.location.href="/dashboard/announcements"}>
            <Bell size={20} /> <span className="menu-text">Announcements</span>
          </button>
          <button className={`menu-item ${isActive('/dashboard/emergency') ? 'active' : ''}`} onClick={() => window.location.href="/dashboard/emergency"}>
            <Phone size={20} /> <span className="menu-text">Emergency Contacts</span>
          </button>
          <button className="menu-item logout" onClick={() => setShowLogoutModal(true)}>
            <LogOut size={20} /> <span className="menu-text">Logout</span>
          </button>
        </nav>
      </aside>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Log Out?</h3>
            <p style={{ color: '#94a3b8' }}>Are you sure you want to end your session?</p>
            <div className="btn-row">
              <button className="btn-confirm" onClick={confirmLogout}>Yes, Log Out</button>
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// =========================================
// 2. DASHBOARD LAYOUT COMPONENT (Internal)
// =========================================
const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`main-content ${collapsed ? "expanded" : ""}`}>
        {children}
      </main>

      <style>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          width: 100%; /* Changed from 100vw to prevent horizontal scrollbar */
          overflow: hidden;
          background: #0f172a; 
        }

        .main-content {
          flex: 1;
          padding: 0; /* Remove padding to let children control full width */
          overflow-y: auto;
          transition: margin-left 0.4s ease;
          position: relative;
        }
      `}</style>
    </div>
  );
};

// =========================================
// 3. EMERGENCY CONTACTS COMPONENT
// =========================================
export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/etala_website/etala-api/backend/get_emergency_contacts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContacts(data.contacts);
        } else {
          alert(data.message);
        }
        setLoading(false);
      })
      .catch(() => {
        alert("Network error loading emergency contacts");
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      <style>{`
        /* PAGE LAYOUT - Matches Other Pages */
        .contacts-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #101726, #182338, #0b132b);
          color: white;
          font-family: 'Inter', sans-serif;
          padding: 2rem 40px;
        }

        /* CONTAINER */
        .page-container {
          width: 100%;
          max-width: 1200px;
          margin: 0; /* Left aligned as requested in Profile page logic */
          padding-bottom: 3rem;
        }

        /* HEADER */
        .page-header {
          text-align: left;
          margin-bottom: 3rem;
          animation: fadeDown 0.7s ease;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          color: white;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .page-subtitle {
          margin-top: 0.5rem;
          font-size: 1.1rem;
          color: #94a3b8;
        }

        /* TITLE ICON */
        .title-icon {
          color: #ef4444; /* Red for emergency */
        }

        /* LOADING STATE */
        .loading-state {
          text-align: center;
          padding: 4rem;
          color: #94a3b8;
          font-size: 1.2rem;
        }

        /* GRID SYSTEM */
        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          animation: fadeUp 0.8s ease;
        }

        /* CONTACT CARD */
        .contact-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          backdrop-filter: blur(10px);
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          border-color: #ef4444; /* Red border on hover */
          background: rgba(255, 255, 255, 0.08);
        }

        /* Card Decoration Line */
        .card-line {
          position: absolute;
          left: 0;
          top: 15%;
          bottom: 15%;
          width: 4px;
          background: #ef4444;
          border-radius: 0 4px 4px 0;
        }

        .contact-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0.5rem; /* Offset for red line */
        }

        .contact-number-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          width: 100%;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-left: 0.5rem; /* Offset for red line */
        }

        .contact-number {
          font-size: 1.2rem;
          font-weight: 600;
          color: #fca5a5;
          letter-spacing: 0.5px;
        }

        .phone-icon {
          color: #ef4444;
        }

        /* ANIMATIONS */
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .page-container { width: 100%; }
          .contacts-page { padding: 2rem 20px; }
          .contacts-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="contacts-page">
        <div className="page-container">
          
          <header className="page-header">
            <h1 className="page-title">
              <AlertTriangle size={36} className="title-icon" /> 
              Emergency Contacts
            </h1>
            <p className="page-subtitle">
              Quick access to essential emergency numbers in your barangay.
            </p>
          </header>

          {loading ? (
            <p className="loading-state">Loading contacts...</p>
          ) : (
            <div className="contacts-grid">
              {contacts.map((c) => (
                <div key={c.id} className="contact-card">
                  <div className="card-line"></div>
                  <h3 className="contact-title">{c.contact_title}</h3>
                  <div className="contact-number-wrapper">
                    <Phone size={20} className="phone-icon" />
                    <span className="contact-number">{c.contact_number}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}