import React, { useState, useEffect } from "react";
import {
  Home, User, FileText, Bell,
  Phone, LogOut, Menu, ArrowRight
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
          width: 100%;
          overflow: hidden;
          background: #0f172a; 
        }

        .main-content {
          flex: 1;
          padding: 0;
          overflow-y: auto;
          transition: margin-left 0.4s ease;
          position: relative;
        }
      `}</style>
    </div>
  );
};

// =========================================
// 3. MAIN DASHBOARD CONTENT (Internal)
// =========================================
export default function ResidentDashboard() {
  return (
    <DashboardLayout>
      <style>{`
        /* PAGE LAYOUT */
        .dashboard-page {
          min-height: 100vh;
          padding: 40px;
          background: linear-gradient(to bottom, #101726, #182338, #0b132b);
          color: white;
          font-family: 'Inter', sans-serif;
        }

        /* TOP HEADER */
        .top-header {
          margin-bottom: 40px;
          animation: fadeDown 0.6s ease;
        }

        .top-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          color: white;
        }

        .subtitle {
          margin-top: 8px;
          font-size: 1.1rem;
          color: #94a3b8;
        }

        /* SECTION TITLES */
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #60a5fa;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ANNOUNCEMENTS (Horizontal Scroll) */
        .horizontal-section {
          margin-bottom: 50px;
        }

        .announcement-row {
          display: flex;
          overflow-x: auto;
          gap: 25px;
          padding-bottom: 20px; /* Space for scrollbar */
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .announcement-card {
          min-width: 300px;
          background: rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease, background 0.3s;
          animation: fadeRight 0.8s ease;
        }

        .announcement-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.12);
        }

        .announcement-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 15px;
          background: #1e293b; /* Placeholder color */
        }

        .announcement-text {
          font-size: 1rem;
          font-weight: 500;
          color: #e2e8f0;
          line-height: 1.5;
        }

        /* QUICK SERVICES GRID */
        .quick-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }

        .service-btn {
          background: rgba(37, 99, 235, 0.15); /* Blue tint */
          border: 1px solid rgba(96, 165, 250, 0.3);
          color: white;
          padding: 20px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .service-btn:hover {
          background: #2563eb;
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        }

        /* EMERGENCY SECTION */
        .emergency-card {
          background: rgba(239, 68, 68, 0.1); /* Red tint */
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 30px;
          border-radius: 18px;
          backdrop-filter: blur(6px);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          animation: fadeUp 1s ease;
        }

        .emergency-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fca5a5;
          font-size: 1.1rem;
        }

        .emergency-item b {
          color: white;
          font-weight: 600;
        }

        /* ANIMATIONS */
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="dashboard-page">
        
        {/* HEADER */}
        <div className="top-header">
          <h1>Resident Dashboard</h1>
          <p className="subtitle">Welcome back! Here's what's happening in your community.</p>
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="horizontal-section">
          <h2 className="section-title">📢 Latest News & Announcements</h2>

          <div className="announcement-row">
            {/* Example 1 */}
            <div className="announcement-card">
              <div className="announcement-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                 <span>[Image: Clean Up Drive]</span>
              </div>
              <p className="announcement-text">Community Clean-Up Drive this Saturday at 7:00 AM.</p>
            </div>

            {/* Example 2 */}
            <div className="announcement-card">
              <div className="announcement-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                 <span>[Image: Vaccination]</span>
              </div>
              <p className="announcement-text">Free vaccination schedule at the Barangay Hall.</p>
            </div>

            {/* Example 3 */}
            <div className="announcement-card">
              <div className="announcement-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                 <span>[Image: Tree Planting]</span>
              </div>
              <p className="announcement-text">Tree planting activity next week. Volunteers needed!</p>
            </div>
          </div>
        </div>

        {/* QUICK SERVICES */}
        <div className="section">
          <h2 className="section-title">⚙ Quick Services</h2>

          <div className="quick-grid">
            <button className="service-btn">
              Request Barangay Clearance <ArrowRight size={18}/>
            </button>
            <button className="service-btn">
              Request Certificate of Indigency <ArrowRight size={18}/>
            </button>
            <button className="service-btn">
              Track My Requests <ArrowRight size={18}/>
            </button>
          </div>
        </div>

        {/* EMERGENCY */}
        <div className="section">
          <h2 className="section-title">🚨 Emergency Contacts</h2>

          <div className="emergency-card">
            <div className="emergency-item">
              <span>📞</span> <div><b>Barangay Hotline:</b> <br/>0912-345-6789</div>
            </div>
            <div className="emergency-item">
              <span>🏥</span> <div><b>Health Center:</b> <br/>0917-555-3322</div>
            </div>
            <div className="emergency-item">
              <span>🔥</span> <div><b>Fire Department:</b> <br/>160</div>
            </div>
            <div className="emergency-item">
              <span>👮</span> <div><b>Police Station:</b> <br/>166</div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}