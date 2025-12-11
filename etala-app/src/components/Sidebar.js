import React, { useState, useEffect } from "react";
import {
  Home, User, FileText, Bell,
  Phone, LogOut, Menu
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
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
        /* MAIN CONTAINER TRANSITIONS */
        .dashboard-container {
          display: flex;
          height: 100vh;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        /* SIDEBAR STYLING */
        .sidebar {
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
          color: white;
          height: 100vh;
          width: 260px;
          transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.05);
          box-shadow: 4px 0 15px rgba(0,0,0,0.3);
          z-index: 50;
          overflow: hidden; /* Important for hiding content during collapse */
        }

        .collapsed .sidebar {
          width: 85px;
        }

        /* HEADER LAYOUT: Icon Left, Title Right */
        .sidebar-header {
          padding: 25px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between; /* Pushes items to edges */
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 10px;
          min-height: 80px; /* Consistent height */
          transition: all 0.3s ease;
        }

        /* Center the icon when collapsed for better aesthetics */
        .collapsed .sidebar-header {
          justify-content: center;
          padding: 25px 0;
        }

        /* TITLE ANIMATIONS */
        .sidebar-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #60a5fa;
          white-space: nowrap;
          letter-spacing: 1px;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.3s ease, transform 0.3s ease, width 0.3s ease;
        }
        
        /* Hide title smoothly when collapsed */
        .collapsed .sidebar-title {
          opacity: 0;
          width: 0;
          transform: translateX(20px);
          pointer-events: none;
          position: absolute; /* Takes it out of layout flow */
        }

        .toggle-btn {
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.3s, transform 0.3s;
        }
        .toggle-btn:hover { color: white; transform: scale(1.1); }

        /* MENU LIST */
        .menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px 12px;
          gap: 8px;
        }

        /* MENU ITEMS */
        .menu-item {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          color: #cbd5e1;
          text-decoration: none;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.08);
          color: white;
          transform: translateX(5px);
        }

        /* ACTIVE STATE */
        .menu-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: #60a5fa;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        .menu-item svg {
          margin-right: 14px;
          min-width: 22px;
          transition: all 0.3s;
        }

        .menu-item.active svg {
          color: #60a5fa;
          filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.5));
        }

        /* Collapsed menu item adjustments */
        .collapsed .menu-item {
          padding: 14px;
          justify-content: center;
        }

        .collapsed .menu-item svg {
          margin-right: 0;
        }

        /* LOGOUT BUTTON */
        .logout {
          margin-top: auto;
          color: #f87171;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-radius: 0;
          margin-bottom: 0;
          padding: 20px 18px;
        }
        
        .collapsed .logout {
           border-radius: 12px;
           margin-bottom: 10px;
           padding: 14px;
        }

        .logout:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          transform: none;
        }

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeOverlay 0.3s ease-out;
        }

        .modal-content {
          background: #1e293b;
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          text-align: center;
          max-width: 400px;
          width: 90%;
          color: white;
          animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: -webkit-linear-gradient(#fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-confirm {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 0.7rem 1.8rem;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
        .btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6); }

        .btn-cancel {
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          padding: 0.7rem 1.8rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.1); color: white; }

        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

        <aside className="sidebar">
          {/* HEADER: Icon Left, Title Right */}
          <div className="sidebar-header">
            <Menu className="toggle-btn" size={24} onClick={() => setCollapsed(!collapsed)} />
            
            {/* Title - Logic handled by CSS class 'sidebar-title' */}
            <h2 className="sidebar-title">E-TALA</h2>
          </div>

          <nav className="menu">
            <button 
              className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`} 
              onClick={() => window.location.href="/dashboard"}
            >
              <Home size={20} /> {!collapsed && "Dashboard"}
            </button>

            <button 
              className={`menu-item ${isActive('/dashboard/services') ? 'active' : ''}`} 
              onClick={() => window.location.href="/dashboard/services"}
            >
              <FileText size={20} /> {!collapsed && "Services & Requests"}
            </button>

            <button 
              className={`menu-item ${isActive('/dashboard/requests') ? 'active' : ''}`} 
              onClick={() => window.location.href="/dashboard/requests"}
            >
              <FileText size={20} /> {!collapsed && "Request History"}
            </button>

            <button 
              className={`menu-item ${isActive('/dashboard/profile') ? 'active' : ''}`} 
              onClick={() => window.location.href="/dashboard/profile"}
            >
              <User size={20} /> {!collapsed && "My Profile"}
            </button>

            <button 
              className={`menu-item ${isActive('/dashboard/announcements') ? 'active' : ''}`} 
              onClick={() => window.location.href="/dashboard/announcements"}
            >
              <Bell size={20} /> {!collapsed && "Announcements"}
            </button>

            <button 
              className={`menu-item ${isActive('/dashboard/emergency') ? 'active' : ''}`} 
              onClick={() => window.location.href="/dashboard/emergency"}
            >
              <Phone size={20} /> {!collapsed && "Emergency Contacts"}
            </button>

            <button className="menu-item logout" onClick={handleLogoutClick}>
              <LogOut size={20} /> {!collapsed && "Logout"}
            </button>
          </nav>
        </aside>

        {/* LOGOUT CONFIRMATION MODAL */}
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Log Out?</h3>
              <p className="modal-desc">Are you sure you want to end your session?</p>
              
              <div className="modal-actions">
                <button className="btn-confirm" onClick={confirmLogout}>Yes, Log Out</button>
                <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}