import React, { useEffect, useState, useMemo } from "react";
import { Users, ClipboardList, Clock, CheckCircle, LogOut, Home, Megaphone, Zap, Activity, Menu, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom"; 

// --- Layout/Sidebar Definitions (Internal Stubs using pure CSS) ---

// Helper component for sidebar buttons using dynamic path/active state
const SidebarButton = ({ to, icon: Icon, children, isActive, navigate }) => (
    <button 
        className={`menu-item ${isActive(to) ? 'active' : ''}`} 
        onClick={() => navigate(to)}
    >
        <Icon size={20} /> <span className="menu-text">{children}</span>
    </button>
);

// 1. Sidebar Component 
const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleToggle = () => {
        if (setCollapsed) setCollapsed(!collapsed);
    };

    const confirmLogout = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        alert("Logged out (Stub function)");
        navigate("/login"); 
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <Menu className="toggle-btn" size={26} onClick={handleToggle} />
                    <h2 className="sidebar-title">E-TALA</h2>
                </div>

                <nav className="sidebar-menu">
                    <SidebarButton to="/admin/dashboard" icon={Home} isActive={isActive} navigate={navigate}>Dashboard</SidebarButton>
                    <SidebarButton to="/admin/residents" icon={Users} isActive={isActive} navigate={navigate}>Manage Residents</SidebarButton>
                    <SidebarButton to="/admin/requests" icon={ClipboardList} isActive={isActive} navigate={navigate}>Requests</SidebarButton>
                    <SidebarButton to="/admin/announcements" icon={Megaphone} isActive={isActive} navigate={navigate}>Announcements</SidebarButton>
                    <SidebarButton to="/admin/logs" icon={Clock} isActive={isActive} navigate={navigate}>Activity Logs</SidebarButton>

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

// 2. Admin Layout Component (Includes global styles and structure)
const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <style>
                {/* ALL STYLES (Layout + Dashboard) - Combined for single-file operation */}
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; background: #0f172a; }

                    /* LAYOUT & SIDEBAR STYLES (From AdminLayout.js reference) */
                    .admin-layout { display: flex; height: 100vh; background: #0f172a; font-family: 'Inter', sans-serif; color: white; overflow: hidden; }
                    .admin-layout.collapsed .admin-sidebar { width: 80px; }

                    .admin-sidebar {
                        background: linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
                        width: 260px;
                        height: 100vh;
                        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        flex-direction: column;
                        border-right: 1px solid rgba(255,255,255,0.05);
                        flex-shrink: 0;
                    }
                    
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
                    
                    .toggle-btn { cursor: pointer; color: #94a3b8; transition: color 0.2s, transform 0.2s; min-width: 24px; padding: 8px; border-radius: 8px; }
                    .toggle-btn:hover { color: white; transform: scale(1.1); }
                    
                    .sidebar-title { font-size: 1.4rem; font-weight: 800; color: #60a5fa; white-space: nowrap; opacity: 1; transition: opacity 0.3s ease 0.1s; }
                    
                    .admin-layout.collapsed .sidebar-title { opacity: 0; pointer-events: none; display: none; }
                    
                    .sidebar-menu { flex: 1; display: flex; flex-direction: column; padding: 15px 12px; gap: 8px; overflow-x: hidden; }
                    
                    .menu-item { display: flex; align-items: center; padding: 12px 16px; color: #cbd5e1; background: transparent; border: none; width: 100%; border-radius: 12px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: all 0.2s ease; white-space: nowrap; overflow: hidden; position: relative; }
                    
                    .admin-layout.collapsed .menu-item { justify-content: center; padding: 12px 0; width: 100%; }
                    
                    .menu-item:hover { background: rgba(255,255,255,0.05); color: white; transform: translateX(4px); }
                    
                    .admin-layout.collapsed .menu-item:hover { transform: none; background: rgba(255,255,255,0.1); }
                    
                    .menu-item.active { background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: 600; }
                    
                    .menu-item.active::before { content: ''; position: absolute; left: 0; top: 10%; bottom: 10%; width: 4px; background: #60a5fa; border-top-right-radius: 4px; border-bottom-right-radius: 4px; }
                    
                    .menu-item svg { margin-right: 14px; min-width: 22px; transition: color 0.3s; }
                    
                    .admin-layout.collapsed .menu-item svg { margin-right: 0; }
                    
                    .menu-item.active svg { color: #60a5fa; }
                    
                    .menu-text { opacity: 1; transition: opacity 0.3s ease 0.1s; }
                    
                    .admin-layout.collapsed .menu-text { opacity: 0; display: none; }
                    
                    .logout-btn { margin-top: auto; color: #f87171; margin-bottom: 20px; }
                    .logout-btn:hover { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
                    .logout-btn svg { color: #f87171; }
                    .logout-btn:hover svg { color: #fca5a5; }


                    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fade 0.3s ease; }
                    .modal-content { background: #1e293b; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 350px; width: 90%; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: scale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    .btn-row { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
                    .btn-confirm { background: #ef4444; color: white; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none;}
                    .btn-cancel { background: rgba(255,255,255,0.1); color: white; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; border: none;}

                    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes scale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                    .admin-main {
                        flex: 1;
                        padding: 20px; 
                        overflow-y: auto;
                    }

                    /* --- DASHBOARD SPECIFIC STYLES (from AdminDashboard.css) --- */
                    .admin-dashboard { padding: 0; color: white; }

                    .admin-title-h1 {
                        font-size: 2rem; 
                        font-weight: 800; 
                        color: #ffffff; 
                        margin-bottom: 24px; 
                        padding-bottom: 12px; 
                        border-bottom: 2px solid #60a5fa;
                        padding-left: 20px; 
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 24px;
                        margin-bottom: 40px;
                    }

                    .card {
                        padding: 24px;
                        background: rgba(255,255,255,0.08);
                        border-radius: 12px;
                        text-align: left;
                        transition: all 0.3s ease;
                        border: 1px solid rgba(255,255,255,0.1);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        min-height: 120px;
                    }
                    .card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 15px rgba(0,0,0,0.4);
                        border-color: #60a5fa;
                    }

                    .card h3 {
                        font-size: 0.9rem;
                        color: #94a3b8;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        font-weight: 600;
                    }
                    .card p {
                        font-size: 2.25rem;
                        font-weight: 800;
                        color: white;
                        margin-top: 5px;
                    }

                    .section {
                        margin-top: 40px;
                        background: rgba(255,255,255,0.05);
                        padding: 24px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                    }

                    .section h2 {
                        font-size: 1.5rem;
                        color: #60a5fa;
                        margin-bottom: 16px;
                        font-weight: 700;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        padding-bottom: 8px;
                    }

                    table {
                        width: 100%;
                        margin-top: 16px;
                        border-collapse: collapse;
                        min-width: 600px;
                        border-radius: 8px;
                        overflow: hidden;
                    }

                    table thead {
                        background: rgba(255,255,255,0.1);
                    }
                    table th, table td {
                        padding: 12px 16px;
                        border-bottom: 1px solid rgba(255,255,255,0.2);
                        text-align: left;
                        font-size: 0.9rem;
                    }
                    table th {
                        color: #94a3b8;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    table td {
                        color: #e2e8f0;
                    }
                    table tbody tr:last-child td {
                        border-bottom: none;
                    }
                    table tbody tr:hover {
                        background: rgba(255,255,255,0.08);
                        cursor: pointer;
                    }
                    
                    ul { list-style: none; padding: 0; }

                    .announcement-list { display: flex; flex-direction: column; }
                    .announcement-item { padding: 12px 0; display: flex; justify-content: space-between; align-items: flex-start; transition: background-color 0.2s; border-bottom: 1px solid #374151; cursor: pointer; }
                    .announcement-item:last-child { border-bottom: none; }
                    .announcement-item:hover { background-color: #334155; padding-left: 5px; }

                    .announcement-title { font-weight: 500; color: #e5e7eb; display: flex; align-items: center; flex: 1; margin-right: 16px; }
                    .announcement-title svg { color: #60a5fa; margin-right: 8px; }
                    .announcement-date { font-size: 0.75rem; color: #6b7280; white-space: nowrap; padding-top: 2px; }
                    
                    /* STATUS BADGES */
                    .status-badge { display: inline-flex; align-items: center; padding: 4px 12px; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; border: 1px solid transparent; transition: all 0.2s; }
                    .status-Pending { background-color: rgba(251, 191, 36, 0.2); color: #fcd34d; border-color: rgba(251, 191, 36, 0.4); }
                    .status-In-Progress { background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; border-color: rgba(59, 130, 246, 0.4); }
                    .status-Completed { background-color: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4); }
                    .status-Rejected { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.4); }

                    /* LOADING/ERROR */
                    .loading-state { padding: 32px; background-color: #1f2937; border-radius: 12px; border: 1px solid #334155; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spinner { animation: spin 1s linear infinite; }
                    .error-state { padding: 16px; color: #fca5a5; background-color: #450a00; border-radius: 8px; border: 1px solid #7f1d1d; text-align: center; }

                `}
            </style>
            <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
                <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className="admin-main">
                    <h1 className="admin-title-h1">Admin Panel</h1>
                    {children}
                </main>
            </div>
        </>
    );
};
// --- END: Admin Layout/Sidebar Definitions ---


// Helper function for status badge styling
const getStatusBadge = (status) => {
    let statusClass = 'status-badge';
    let icon = null;

    if (status === 'Pending') {
        statusClass += ' status-Pending';
        icon = <Clock size={12} style={{marginRight: '4px'}} />;
    } else if (status === 'In Progress' || status === 'Processing') {
        statusClass += ' status-In-Progress';
        icon = <Activity size={12} style={{marginRight: '4px'}} />;
    } else if (status === 'Completed') {
        statusClass += ' status-Completed';
        icon = <CheckCircle size={12} style={{marginRight: '4px'}} />;
    } else if (status === 'Rejected') {
        statusClass += ' status-Rejected';
        icon = <Zap size={12} style={{marginRight: '4px'}} />;
    }

    return (
        <span className={statusClass}>
            {icon}
            {status}
        </span>
    );
};


// --- MAIN ADMIN DASHBOARD CONTENT COMPONENT ---
export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data structure (for fallback if API fails)
    const MOCK_STATS = useMemo(() => ({
        total_residents: 1250,
        total_requests: 452,
        status_chart: {
            "Pending": 12,
            "Completed": 405,
            "In Progress": 35,
            "Rejected": 5 
        },
        latest_requests: [
            { id: 1, resident_name: "Jane Doe", request_type: "Plumbing_Repair", status: "Pending", date_requested: "2025-12-09" },
            { id: 2, resident_name: "John Smith", request_type: "Electrician_Call", status: "In Progress", date_requested: "2025-12-08" },
            { id: 3, resident_name: "Alice Johnson", request_type: "Building_Maintenance", status: "Completed", date_requested: "2025-12-07" },
        ],
        latest_announcements: [
            { id: 101, title: "Water Interruption Notice", posted_at: "2025-12-09" },
            { id: 102, title: "Gym Maintenance Schedule", posted_at: "2025-12-05" },
        ]
    }), []);

    // ORIGINAL FETCH LOGIC - Preserved as requested
    useEffect(() => {
        fetch("http://localhost/etala_website/etala-api/backend/admin_get_dashboard_stats.php", {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setStats(data.stats);
            } else {
                setStats(MOCK_STATS); 
            }
            setLoading(false);
        })
        .catch(() => {
             setStats(MOCK_STATS);
             setLoading(false);
        });
    }, [MOCK_STATS]);

    // Use MOCK_STATS if the real data failed to load
    const finalStats = stats || MOCK_STATS;


    if (loading) return <AdminLayout><div className="loading-state" style={{margin: '40px'}}><p style={{color: '#94a3b8', textAlign: 'center'}}>Loading dashboard...</p></div></AdminLayout>;
    if (!stats) return <AdminLayout><div className="error-state" style={{margin: '40px'}}>Error loading dashboard. Please check the backend service.</div></AdminLayout>;


    return (
        <AdminLayout>
            <div className="admin-dashboard-content">

                {/* TOP STATS CARDS */}
                <div className="stats-grid">
                    <div className="card">
                        <h3>Total Residents</h3>
                        <p>{finalStats.total_residents}</p>
                    </div>

                    <div className="card">
                        <h3>Total Requests</h3>
                        <p>{finalStats.total_requests}</p>
                    </div>

                    <div className="card">
                        <h3>Pending Requests</h3>
                        <p>{finalStats.status_chart.Pending || 0}</p>
                    </div>

                    <div className="card">
                        <h3>Completed</h3>
                        <p>{finalStats.status_chart.Completed || 0}</p>
                    </div>
                </div>

                {/* LATEST REQUESTS AND ANNOUNCEMENTS (Data Section Grid) */}
                <div className="data-section-grid">
                    
                    {/* RECENT REQUESTS - Left Column (2fr width in desktop view) */}
                    <div className="data-section-box requests-box">
                        <div className="data-section-header">
                            <h2>Recent Requests</h2>
                            <Link to="/admin/requests" className="data-section-link">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Resident</th>
                                        <th>Request Type</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {finalStats.latest_requests.map((req) => (
                                        <tr key={req.id}>
                                            <td style={{fontWeight: 500, color: '#e5e7eb'}}>{req.resident_name}</td>
                                            <td>{req.request_type.replaceAll("_", " ")}</td>
                                            <td>{getStatusBadge(req.status)}</td>
                                            <td>{req.date_requested}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* LATEST ANNOUNCEMENTS (Right Column, 1fr) */}
                    <div className="data-section-box">
                        <div className="data-section-header">
                            <h2>Latest Announcements</h2>
                            <Link to="/admin/announcements" className="data-section-link">
                                Manage <ArrowRight size={16} />
                            </Link>
                        </div>
                        <ul className="announcement-list">
                            {finalStats.latest_announcements.map(a => (
                                <li key={a.id} className="announcement-item">
                                    <span className="announcement-title">
                                        <Megaphone size={16} />
                                        {a.title}
                                    </span>
                                    <span className="announcement-date">{a.posted_at}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}