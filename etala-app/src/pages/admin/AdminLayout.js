import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Megaphone, ClipboardList, Clock, LogOut, Menu } from "lucide-react";
// Styles are defined internally within the AdminLayout component below.

// =========================================
// 1. SIDEBAR COMPONENT
// =========================================
const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleToggle = () => {
        if (setCollapsed) setCollapsed(!collapsed);
    };

    const confirmLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        sessionStorage.removeItem("user");
        // Use navigate to emulate routing change
        navigate("/login"); 
    };

    const isActive = (path) => location.pathname === path;

    const SidebarButton = ({ to, icon: Icon, children }) => (
        <button 
            className={`menu-item ${isActive(to) ? 'active' : ''}`} 
            onClick={() => navigate(to)}
        >
            <Icon size={20} /> <span className="menu-text">{children}</span>
        </button>
    );

    return (
        <>
            <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <Menu className="toggle-btn" size={26} onClick={handleToggle} />
                    <h2 className="sidebar-title">E-TALA</h2>
                </div>

                <nav className="sidebar-menu">
                    <SidebarButton to="/admin/dashboard" icon={Home}>Dashboard</SidebarButton>
                    <SidebarButton to="/admin/residents" icon={Users}>Residents</SidebarButton>
                    <SidebarButton to="/admin/requests" icon={ClipboardList}>Requests</SidebarButton>
                    <SidebarButton to="/admin/announcements" icon={Megaphone}>Announcements</SidebarButton>
                    <SidebarButton to="/admin/logs" icon={Clock}>Activity Logs</SidebarButton>

                    <button className="menu-item logout-btn" onClick={() => setShowLogoutModal(true)}>
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
// 2. ADMIN LAYOUT COMPONENT
// =========================================
export default function AdminLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                /* GLOBAL LAYOUT */
                .admin-layout {
                    display: flex;
                    height: 100vh;
                    background: #0f172a; /* Main content background */
                    font-family: 'Inter', sans-serif;
                    color: white;
                    overflow: hidden;
                }

                .admin-layout.collapsed .admin-sidebar {
                    width: 80px;
                }

                /* SIDEBAR CONTAINER */
                .admin-sidebar {
                    /* Gradient from user reference */
                    background: linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
                    width: 260px;
                    height: 100vh;
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(255,255,255,0.05);
                    flex-shrink: 0;
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

                .admin-layout.collapsed .sidebar-header {
                    justify-content: center;
                    padding: 0;
                    gap: 0;
                }

                .toggle-btn {
                    cursor: pointer;
                    color: #94a3b8;
                    transition: color 0.2s, transform 0.2s;
                    min-width: 24px;
                    padding: 8px;
                    border-radius: 8px;
                }
                .toggle-btn:hover { color: white; transform: scale(1.1); }

                /* TITLE ANIMATION */
                .sidebar-title {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #60a5fa;
                    white-space: nowrap;
                    opacity: 1;
                    transition: opacity 0.3s ease 0.1s;
                }

                .admin-layout.collapsed .sidebar-title {
                    opacity: 0;
                    pointer-events: none;
                    display: none;
                }

                /* MENU LIST */
                .sidebar-menu {
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
                }

                .admin-layout.collapsed .menu-item {
                    justify-content: center;
                    padding: 12px 0;
                    width: 100%;
                }

                .menu-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                    transform: translateX(4px); /* Interactive movement */
                }
                
                .admin-layout.collapsed .menu-item:hover {
                    transform: none;
                    background: rgba(255,255,255,0.1);
                }

                /* ACTIVE STATE */
                .menu-item.active {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    font-weight: 600;
                    /* box-shadow: 0 4px 12px rgba(0,0,0,0.1); */ /* Removed for cleaner dark look */
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

                .admin-layout.collapsed .menu-item svg {
                    margin-right: 0;
                }

                .menu-item.active svg {
                    color: #60a5fa;
                    /* filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.6)); */ /* Removed filter for cleaner dark look */
                }

                .menu-text {
                    opacity: 1;
                    transition: opacity 0.3s ease 0.1s;
                }

                .admin-layout.collapsed .menu-text {
                    opacity: 0;
                    display: none;
                }

                /* LOGOUT BUTTON */
                .logout-btn {
                    margin-top: auto;
                    color: #f87171;
                    margin-bottom: 20px;
                }
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.15);
                    color: #fca5a5;
                }
                .logout-btn svg {
                    color: #f87171;
                }
                .logout-btn:hover svg {
                    color: #fca5a5;
                }


                /* MODAL Styles (Ensured to match dark theme design) */
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

                /* MAIN CONTENT */
                .admin-main {
                    flex: 1;
                    padding: 20px; 
                    overflow-y: auto;
                }
            `}</style>
            <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
                <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </>
    );
}