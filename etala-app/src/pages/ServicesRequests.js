import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  HandHeart, 
  Building2, 
  Home, 
  FileWarning, 
  Star, 
  X,
  ArrowRight,
  Menu,
  User,
  Bell,
  Phone,
  LogOut
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
// 2. DASHBOARD LAYOUT
// =========================================
const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-container">
      {/* CSS STYLES DEFINITION */}
      <style>{`
        :root {
          --bg-dark: #0f172a;
          --bg-card: rgba(255, 255, 255, 0.05);
          --bg-card-hover: rgba(255, 255, 255, 0.1);
          --text-main: #ffffff;
          --text-muted: #94a3b8;
          --accent-blue: #60a5fa;
          --border-color: rgba(255, 255, 255, 0.1);
          --sidebar-width: 260px;
          --sidebar-collapsed: 80px;
        }

        /* LAYOUT */
        .app-container {
          display: flex;
          height: 100vh;
          width: 100%;
          background-color: var(--bg-dark);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          background: linear-gradient(to bottom, #101726, #182338, #0b132b);
          padding: 2rem;
          color: white;
        }

        /* SIDEBAR */
        .sidebar {
          width: var(--sidebar-width);
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          flex-shrink: 0;
          z-index: 50;
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed);
        }

        .sidebar-header {
          height: 80px;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 0;
        }

        .toggle-btn {
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: white; }

        .brand-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--accent-blue);
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.3s;
        }
        
        .sidebar.collapsed .brand-title {
          display: none;
        }

        .sidebar-menu {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-x: hidden;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          position: relative;
          font-size: 0.95rem;
        }

        .sidebar.collapsed .menu-item {
          justify-content: center;
          padding: 0.75rem 0;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .menu-item.active {
          background: rgba(255,255,255,0.1);
          color: white;
          font-weight: 600;
        }

        .menu-icon {
          min-width: 20px;
          margin-right: 0.75rem;
        }

        .sidebar.collapsed .menu-icon {
          margin-right: 0;
        }

        .menu-label {
          white-space: nowrap;
          transition: opacity 0.3s;
        }

        .sidebar.collapsed .menu-label {
          display: none;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 10%;
          bottom: 10%;
          width: 4px;
          background-color: var(--accent-blue);
          border-radius: 0 4px 4px 0;
        }

        .logout-btn {
          margin-top: auto;
          color: #f87171;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        /* PAGE CONTENT STYLES */
        .page-header {
          margin-bottom: 2.5rem;
          animation: fadeDown 0.6s ease-out;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          color: white;
        }

        .page-subtitle {
          color: var(--text-muted);
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }

        /* GRID SYSTEM - UPDATED FOR 3 COLUMNS */
        .services-grid {
          display: grid;
          /* Force 3 columns on large screens */
          grid-template-columns: repeat(3, 1fr); 
          gap: 1.8rem;
          animation: fadeUp 0.6s ease-out;
          width: 60%;
          margin: 0 auto;
        }

        /* SERVICE CARD - UPDATED SIZE */
        .service-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          padding: 1.00rem; /* Reduced padding */
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(10px);
          height: 90%;
          min-height: 240px; /* Consistent height */
          position: relative; /* Ensure overlapping context is handled */
          overflow: hidden; /* Prevent spillover */
        }

        .service-card:hover {
          transform: translateY(-5px);
          background: var(--bg-card-hover);
          border-color: rgba(96, 165, 250, 0.3);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          z-index: 2; /* Bring to front on hover */
        }

        .card-icon-wrapper {
          width: 3rem; /* Slightly smaller icon box */
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: transform 0.3s;
        }

        .service-card:hover .card-icon-wrapper {
          transform: scale(1.1);
        }

        .card-title {
          font-size: 1.1rem; /* Slightly smaller title */
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: white;
          line-height: 1.3;
        }

        .service-card:hover .card-title {
          color: var(--accent-blue);
        }

        .card-desc {
          font-size: 0.85rem; /* Slightly smaller text */
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
          flex-grow: 1;
        }

        .card-action {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent-blue);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s;
        }

        .service-card:hover .card-action {
          opacity: 1;
          transform: translateY(0);
        }

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-box {
          background: #1e293b;
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          width: 90%;
          max-width: 500px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          animation: zoomIn 0.2s ease-out;
        }

        .small-modal {
          max-width: 350px;
          padding: 2rem;
          text-align: center;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .modal-close-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        .modal-body { padding: 1.5rem; }
        
        .modal-desc {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .modal-actions.centered {
          flex-direction: row;
          justify-content: center;
        }

        .btn {
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 0.2s;
          font-size: 1rem;
        }
        
        .btn:active { transform: scale(0.98); }

        .btn-primary {
          background-color: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .btn-primary:hover { background-color: #1d4ed8; }

        .btn-secondary {
          background-color: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .btn-secondary:hover { background-color: rgba(255,255,255,0.05); color: white; }

        .btn-danger {
          background-color: #ef4444;
          color: white;
        }
        .btn-danger:hover { background-color: #dc2626; }

        /* COLORS FOR ICONS */
        .color-blue { color: #60a5fa; }
        .bg-blue { background: rgba(59, 130, 246, 0.1); }
        
        .color-emerald { color: #34d399; }
        .bg-emerald { background: rgba(16, 185, 129, 0.1); }
        
        .color-violet { color: #a78bfa; }
        .bg-violet { background: rgba(139, 92, 246, 0.1); }
        
        .color-orange { color: #fb923c; }
        .bg-orange { background: rgba(249, 115, 22, 0.1); }
        
        .color-red { color: #f87171; }
        .bg-red { background: rgba(239, 68, 68, 0.1); }
        
        .color-amber { color: #fbbf24; }
        .bg-amber { background: rgba(245, 158, 11, 0.1); }

        /* ANIMATIONS */
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .app-container { flex-direction: column; }
          .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border-color); }
          .sidebar.collapsed { width: 100%; }
          .sidebar-menu { display: none; } /* Simplified mobile view */
          .sidebar-header { justify-content: space-between; }
          .services-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default function ServicesRequest() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: "barangay_clearance",
      title: "Barangay Clearance",
      icon: FileText,
      colorClass: "color-blue",
      bgClass: "bg-blue",
      description: "Request a Barangay Clearance for employment, ID application, travel, or business.",
    },
    {
      id: "certificate_of_indigency",
      title: "Certificate of Indigency",
      icon: HandHeart,
      colorClass: "color-emerald",
      bgClass: "bg-emerald",
      description: "Request a certificate for medical, educational, legal, or financial assistance.",
    },
    {
      id: "business_permit",
      title: "Business Permit",
      icon: Building2,
      colorClass: "color-violet",
      bgClass: "bg-violet",
      description: "Apply for issuance or renewal of barangay business permits.",
    },
    {
      id: "certificate_of_residency",
      title: "Certificate of Residency",
      icon: Home,
      colorClass: "color-orange",
      bgClass: "bg-orange",
      description: "Proof of residency for school, job, or legal documents.",
    },
    {
      id: "blotter_report",
      title: "Blotter Report",
      icon: FileWarning,
      colorClass: "color-red",
      bgClass: "bg-red",
      description: "File a community incident or concern officially for documentation.",
    },
    {
      id: "good_morale_certificate",
      title: "Good Moral Certificate",
      icon: Star,
      colorClass: "color-amber",
      bgClass: "bg-amber",
      description: "Requested for employment, school, or legal character verification.",
    },
  ];

  const handleProceed = () => {
    if (!selectedService) return;
    const { icon, ...safeServiceData } = selectedService;
    navigate("/request-form", { state: { service: safeServiceData } });
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Services & Requests</h1>
        <p className="page-subtitle">Choose a service and submit your request online.</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="service-card"
          >
            <div className={`card-icon-wrapper ${service.bgClass} ${service.colorClass}`}>
              <service.icon size={28} />
            </div>
            
            <h3 className="card-title">{service.title}</h3>
            <p className="card-desc">{service.description}</p>
            
            <div className="card-action">
              Select Service <ArrowRight size={16} style={{ marginLeft: '4px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedService && (
        <div 
          className="modal-overlay"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-content">
                <div className={`card-icon-wrapper ${selectedService.bgClass} ${selectedService.colorClass}`} style={{ marginBottom: 0, width: '40px', height: '40px' }}>
                  <selectedService.icon size={20} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>{selectedService.title}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">
                {selectedService.description}
              </p>

              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleProceed}
                >
                  Proceed to Request <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedService(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}