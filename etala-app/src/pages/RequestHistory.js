import React, { useState, useEffect } from "react";
import {
  Home, User, FileText, Bell,
  Phone, LogOut, Menu, ArrowRight,
  Clock, CheckCircle, XCircle, AlertCircle, File
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
// 3. REQUEST HISTORY CONTENT (Internal)
// =========================================
export default function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/etala_website/etala-api/backend/get_requests.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRequests(data.requests);
        else console.warn(data.message); // Log warning instead of alert on load
        setLoading(false);
      })
      .catch((err) => {
        console.error("Network error", err);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={18} />;
      case 'Rejected': return <XCircle size={18} />;
      case 'Ready for Pickup': return <Bell size={18} />;
      default: return <Clock size={18} />;
    }
  };

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

        /* HEADER */
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

        /* HISTORY LIST GRID */
        .history-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 25px;
          animation: fadeUp 0.8s ease;
        }

        /* HISTORY CARD */
        .history-card {
          background: rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease, background 0.3s, border-color 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .history-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(96, 165, 250, 0.3);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        /* CARD HEADER */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .card-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.4;
        }

        /* STATUS BADGES */
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .status-badge.Pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-badge.Processing { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
        .status-badge.Ready.for.Pickup { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); } /* Handled class logic in JSX */
        .status-badge.Completed { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .status-badge.Rejected { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }

        /* CONTENT TEXT */
        .card-content {
          font-size: 0.95rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .card-content strong {
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          display: block;
          margin-bottom: 2px;
        }

        .remarks {
          background: rgba(255,255,255,0.05);
          padding: 10px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #e2e8f0;
          margin-top: 10px;
          border-left: 3px solid #60a5fa;
        }

        /* FOOTER */
        .card-footer {
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #64748b;
        }

        .attachment-link {
          color: #60a5fa;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .attachment-link:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          color: #94a3b8;
          font-size: 1.1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          border: 1px dashed rgba(255,255,255,0.1);
        }

        /* LOADING */
        .loading-container {
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 1.2rem;
        }

        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="dashboard-page">
        
        {/* HEADER */}
        <div className="top-header">
          <h1>Request History</h1>
          <p className="subtitle">Track the status of your submitted documents and clearances.</p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="loading-container">
            <p>Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any requests yet.</p>
          </div>
        ) : (
          <div className="history-list">
            {requests.map((req) => (
              <div className="history-card" key={req.id}>
                
                {/* Header: Title & Badge */}
                <div className="card-header">
                  <h3>{req.request_type.replaceAll("_", " ").toUpperCase()}</h3>
                  <span className={`status-badge ${req.status === 'Ready for Pickup' ? 'Ready for Pickup' : req.status}`}>
                    {getStatusIcon(req.status)}
                    {req.status}
                  </span>
                </div>

                {/* Body Content */}
                <div className="card-body">
                  <div className="card-content">
                    <strong>Purpose</strong>
                    {req.purpose}
                  </div>
                  
                  {req.notes && (
                    <div className="card-content">
                      <strong>Notes</strong>
                      {req.notes}
                    </div>
                  )}

                  {req.admin_remarks && (
                    <div className="remarks">
                      <strong>Admin Remarks:</strong><br/>
                      {req.admin_remarks}
                    </div>
                  )}
                </div>

                {/* Footer: Date & Attachment */}
                <div className="card-footer">
                  <span className="date">📅 {new Date(req.date_requested).toLocaleDateString()}</span>
                  
                  {req.attachment && (
                    <a
                      className="attachment-link"
                      href={`http://localhost/etala_website/etala-api/backend/${req.attachment}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <File size={14}/> View File
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}