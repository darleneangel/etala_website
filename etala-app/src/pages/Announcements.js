import React, { useState, useEffect } from "react";
import {
  Home, User, FileText, Bell,
  Phone, LogOut, Menu, Calendar, Mail
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
// 3. ANNOUNCEMENTS COMPONENT
// =========================================
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost/etala_website/etala-api/backend/get_announcements.php", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnnouncements(data.announcements);
      })
      .catch(() => alert("Error loading announcements"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <style>{`
        /* PAGE LAYOUT - Matches Profile/Services style */
        .announcement-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #101726, #182338, #0b132b);
          color: white;
          font-family: 'Inter', sans-serif;
          padding: 2rem;
        }

        /* CONTAINER FOR CENTERING */
        .page-container {
          width: 85%;
          max-width: 1000px;
          padding-bottom: 3rem;
        }

        /* HEADER - LEFT ALIGNED */
        .page-header {
          text-align: left;
          margin-bottom: 2rem;
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

        /* ANNOUNCEMENT LIST - Vertical Stack */
        .announcement-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          animation: fadeUp 0.8s ease;
        }

        /* ANNOUNCEMENT CARD - Glassmorphism */
        .announcement-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .announcement-card:hover {
          transform: translateY(-4px);
          border-color: rgba(96, 165, 250, 0.3); /* Blue tint on hover */
        }

        /* IMAGE STYLING */
        .card-image-container {
          width: 100%;
          height: 250px;
          overflow: hidden;
          position: relative;
          background: rgba(0,0,0,0.2);
        }

        .announcement-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .announcement-card:hover .announcement-img {
          transform: scale(1.05);
        }

        /* CONTENT STYLING */
        .card-content {
          padding: 2rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .card-text {
          color: #cbd5e1;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        /* FOOTER META DATA */
        .card-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .meta-icon {
          color: #60a5fa; /* Blue accent */
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 4rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 1rem;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }

        /* ANIMATIONS */
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .page-container { width: 95%; }
          .card-image-container { height: 200px; }
          .card-footer { flex-direction: column; gap: 0.8rem; }
        }
      `}</style>

      <div className="announcement-page">
        <div className="page-container">
          
          <header className="page-header">
            <h1 className="page-title">Community Announcements</h1>
            <p className="page-subtitle">Stay updated with the latest news and events in our barangay.</p>
          </header>

          {loading ? (
            <div className="empty-state">Loading announcements...</div>
          ) : (
            <div className="announcement-list">
              {announcements.length === 0 ? (
                <div className="empty-state">No announcements posted yet.</div>
              ) : (
                announcements.map(a => (
                  <article className="announcement-card" key={a.id}>
                    {a.image && (
                      <div className="card-image-container">
                        <img
                          src={`http://localhost/etala_website/etala-api/backend/${a.image}`}
                          alt={a.title}
                          className="announcement-img"
                          onError={(e) => { e.target.style.display = 'none'; }} // Hide if broken
                        />
                      </div>
                    )}

                    <div className="card-content">
                      <h2 className="card-title">{a.title}</h2>
                      <p className="card-text">{a.content}</p>
                      
                      <div className="card-footer">
                        <div className="meta-item">
                          <Calendar size={16} className="meta-icon" />
                          <span>Posted on {new Date(a.posted_at).toLocaleDateString()}</span>
                        </div>
                        {a.admin_email && (
                          <div className="meta-item">
                            <Mail size={16} className="meta-icon" />
                            <span>Posted by: {a.admin_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}