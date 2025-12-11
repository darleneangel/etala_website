import React, { useEffect, useState, useMemo } from "react";
import { Users, ClipboardList, Clock, CheckCircle, ChevronLeft, ChevronRight, LogOut, Home, Megaphone, Zap, Activity, Menu, ArrowRight, Plus, Edit, Trash2, X, Eye, AlertTriangle } from 'lucide-react';
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom"; 

// --- Layout/Sidebar Definitions (Internal Stubs using pure CSS) ---

const SidebarButton = ({ to, icon: Icon, children, isActive, navigate }) => (
    <button 
        className={`menu-item ${isActive(to) ? 'active' : ''}`} 
        onClick={() => navigate(to)}
    >
        <Icon size={20} /> <span className="menu-text">{children}</span>
    </button>
);

const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleToggle = () => { if (setCollapsed) setCollapsed(!collapsed); };
    const confirmLogout = () => { localStorage.removeItem("user"); sessionStorage.removeItem("user"); alert("Logged out (Stub function)"); navigate("/login"); };
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
                    <SidebarButton to="/admin/residents" icon={Users} isActive={isActive} navigate={navigate}>Residents</SidebarButton>
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

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <>
            <style>
                {/* ALL CSS STYLES (Layout + Dashboard) - Integrated for runnability */}
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; background: #0f172a; }

                    /* LAYOUT & SIDEBAR STYLES */
                    .admin-layout { display: flex; height: 100vh; background: #0f172a; font-family: 'Inter', sans-serif; color: white; overflow: hidden; }
                    .admin-layout.collapsed .admin-sidebar { width: 80px; }

                    .admin-sidebar {
                        background: linear-gradient(180deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
                        width: 260px; height: 100vh; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; border-right: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;
                    }
                    .sidebar-header { height: 80px; display: flex; align-items: center; padding: 0 24px; justify-content: flex-start; gap: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); overflow: hidden; transition: all 0.4s ease; }
                    .admin-layout.collapsed .sidebar-header { justify-content: center; padding: 0; gap: 0; }
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
                    .form-modal-content { background: #1e293b; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 600px; width: 90%; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; display: flex; flex-direction: column; gap: 15px; }
                    .form-close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #94a3b8; cursor: pointer; }
                    .form-close-btn:hover { color: white; }

                    .admin-main { flex: 1; padding: 20px; overflow-y: auto; }

                    /* --- DASHBOARD SPECIFIC STYLES --- */
                    .admin-title-h1 {
                        font-size: 2rem; 
                        font-weight: 800; 
                        color: #ffffff; 
                        margin-bottom: 24px; 
                        padding-bottom: 12px; 
                        border-bottom: 2px solid #60a5fa;
                        padding-left: 20px; 
                    }
                    
                    .data-section-box {
                        background-color: #1f2937; 
                        padding: 24px; 
                        border-radius: 12px; 
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); 
                        border: 1px solid #374151; 
                        color: white; 
                        margin-top: 20px;
                    }
                    
                    .admin-table { width: 100%; border-collapse: collapse; margin-top: 16px; border-radius: 8px; overflow: hidden; min-width: 600px; }
                    .admin-table thead { background: rgba(255,255,255,0.1); }
                    .admin-table th, .admin-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: left; font-size: 0.9rem; color: #e2e8f0; }
                    .admin-table th { color: #94a3b8; font-weight: 600; text-transform: uppercase; }
                    .admin-table tbody tr:hover { background: rgba(255,255,255,0.08); cursor: pointer; }
                    
                    .action-button { background-color: #60a5fa; color: white; padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background-color 0.2s; display: flex; align-items: center; gap: 8px; justify-content: center; }
                    .action-button:hover { background-color: #3b82f6; }
                    .action-button.delete-button { background-color: transparent; color: #f87171; padding: 8px; }
                    .action-button.delete-button:hover { background-color: rgba(239, 68, 68, 0.15); }
                    .action-button.edit-button { background-color: transparent; color: #fcd34d; padding: 8px; }
                    .action-button.edit-button:hover { background-color: rgba(251, 191, 36, 0.15); }
                    .table-actions { display: flex; gap: 5px; justify-content: center; }

                    /* STATUS BADGES */
                    .status-badge { display: inline-flex; align-items: center; padding: 4px 12px; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; border: 1px solid transparent; }
                    .status-Pending { background-color: rgba(251, 191, 36, 0.2); color: #fcd34d; }
                    .status-Processing, .status-Inprogress { background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                    .status-Completed { background-color: rgba(16, 185, 129, 0.2); color: #34d399; }
                    .status-Rejected { background-color: rgba(239, 68, 68, 0.2); color: #f87171; }

                    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                    .modal-info-field { background: #334155; padding: 8px; border-radius: 6px; margin-bottom: 10px; }
                    .modal-info-field b { color: #94a3b8; font-weight: 500; display: block; font-size: 0.8rem; }
                    .modal-info-field span { font-size: 1rem; color: white; display: block; margin-top: 3px; }
                    .modal-description { background: #334155; padding: 12px; border-radius: 6px; white-space: pre-wrap; }
                    .modal-description b { color: #94a3b8; font-weight: 500; display: block; font-size: 0.8rem; margin-bottom: 5px; }

                `}
            </style>
            <div className={`admin-layout`}>
                <AdminSidebar />
                <main className="admin-main">
                    <h1 className="admin-title-h1">Admin Management</h1>
                    {children}
                </main>
            </div>
        </>
    );
};
// --- END Layout/Sidebar Definitions ---


// --- MAIN ADMIN REQUESTS COMPONENT ---
export default function AdminRequests() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_BASE = "http://localhost/etala_website/etala-api/backend";

    const API = useMemo(() => ({
        GET: `${API_BASE}/admin_get_requests.php`,
        UPDATE: `${API_BASE}/admin_update_request_status.php`,
        DELETE: `${API_BASE}/admin_delete_request.php`,
    }), [API_BASE]);

    // Mock Data for reliable preview when PHP server is offline
    const MOCK_REQUESTS = useMemo(() => ([
        { request_id: 1, full_name: "John D. Doe", request_type: "barangay_clearance", purpose: "Job Application", status: "Pending", date_requested: "2025-12-10 10:00:00", admin_remarks: "Requires signature." },
        { request_id: 2, full_name: "Alice J. Smith", request_type: "certificate_of_indigency", purpose: "Hospital Bill Discount", status: "Processing", date_requested: "2025-12-09 15:30:00", admin_remarks: "Waiting for verification." },
        { request_id: 3, full_name: "Mike L. Johnson", request_type: "business_permit", purpose: "New Sari-Sari Store", status: "Completed", date_requested: "2025-12-08 11:20:00", admin_remarks: "Permit issued." },
    ]), []);

    /** LOAD ALL REQUESTS **/
    const fetchRequests = () => {
        setLoading(true);
        fetch(API.GET, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.requests) setRequests(data.requests);
                else {
                    console.warn("API failed, using mock data.");
                    setRequests(MOCK_REQUESTS);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching requests, using mock data:", err);
                setRequests(MOCK_REQUESTS);
                setLoading(false);
            });
    };

    useEffect(() => { fetchRequests(); }, [MOCK_REQUESTS]);

    /** STATUS BADGE STYLE **/
    const badgeClass = (status) => {
        if (status === "Pending") return "status-Pending";
        if (status === "Processing" || status === "Ready for Pickup") return "status-Processing";
        if (status === "Completed") return "status-Completed";
        if (status === "Rejected") return "status-Rejected";
        return "";
    };

    /** OPEN VIEW MODAL **/
    const openModal = (req) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    /** UPDATE STATUS **/
    const updateStatus = (request_id, newStatus, currentRemarks = "") => {
        const remarks = window.prompt("Enter Admin Remarks (optional):", currentRemarks);
        
        // If remarks is null (user cancelled prompt), abort.
        if (remarks === null) return; 

        const form = new FormData();
        form.append("request_id", request_id);
        form.append("status", newStatus);
        form.append("admin_remarks", remarks); // Send remarks
        
        // Temporarily disable modal while updating
        setIsModalOpen(false); 

        fetch(API.UPDATE, { method: "POST", body: form, credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(`Status updated to ${newStatus}!`);
                    fetchRequests();
                } else alert(`Failed to update status: ${data.message || 'Server error.'}`);
            })
            .catch(err => {
                console.error("Update error:", err);
                alert("Critical error during status update. Check console.");
            });
    };

    /** DELETE REQUEST **/
    const deleteRequest = (request_id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;

        const form = new FormData();
        form.append("request_id", request_id);

        fetch(API.DELETE, { method: "POST", body: form, credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Request deleted!");
                    fetchRequests();
                } else alert(`Failed to delete: ${data.message}`);
            })
            .catch(err => {
                console.error("Delete error:", err);
                alert("Critical error during request deletion. Check console.");
            });
    };

    // Modal Component
    const RequestViewModal = () => (
        <div className="modal-overlay">
            <div className="form-modal-content">
                <button className="form-close-btn" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                </button>

                <h3 style={{ color: "#60a5fa", borderBottom: '1px solid #374151', paddingBottom: '10px' }}>
                    Request #{selectedRequest.request_id} Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="modal-info-field">
                        <b>Resident:</b>
                        <span>{selectedRequest.full_name}</span>
                    </div>
                    <div className="modal-info-field">
                        <b>Date Requested:</b>
                        <span>{selectedRequest.date_requested}</span>
                    </div>
                    <div className="modal-info-field col-span-2">
                        <b>Request Type:</b>
                        <span>{selectedRequest.request_type.replaceAll("_", " ")}</span>
                    </div>
                </div>

                <div className="modal-description" style={{ marginTop: '10px' }}>
                    <b>Purpose (Description):</b>
                    <p style={{ marginTop: '5px' }}>{selectedRequest.purpose || 'No purpose provided.'}</p>
                </div>
                
                <div className="modal-description">
                    <b>Admin Remarks:</b>
                    <p style={{ marginTop: '5px', color: selectedRequest.admin_remarks ? 'white' : '#94a3b8' }}>
                        {selectedRequest.admin_remarks || 'No current remarks.'}
                    </p>
                </div>

                <div style={{ marginTop: '20px', padding: '10px 0', borderTop: '1px solid #374151' }}>
                    <div className="modal-info-field">
                        <b>Current Status:</b>
                        <span className={`status-badge ${badgeClass(selectedRequest.status)}`}>
                            {selectedRequest.status}
                        </span>
                    </div>
                </div>


                <div className="form-actions" style={{ justifyContent: 'space-between' }}>
                    <button className="action-button delete-button"
                        onClick={() => deleteRequest(selectedRequest.request_id)}>
                        <Trash2 size={16} /> Delete Request
                    </button>
                    
                    <div className="flex gap-2">
                        {selectedRequest.status !== "Completed" && (
                            <button className="action-button" style={{ background: "#10b981" }}
                                onClick={() => updateStatus(selectedRequest.request_id, "Completed", selectedRequest.admin_remarks)}>
                                <CheckCircle size={16} /> Mark Complete
                            </button>
                        )}
                         {selectedRequest.status !== "Processing" && selectedRequest.status !== "Completed" && (
                            <button className="action-button" style={{ background: "#f59e0b" }}
                                onClick={() => updateStatus(selectedRequest.request_id, "Processing", selectedRequest.admin_remarks)}>
                                <Clock size={16} /> Process
                            </button>
                        )}
                        {selectedRequest.status !== "Rejected" && (
                            <button className="action-button" style={{ background: "#ef4444" }}
                                onClick={() => updateStatus(selectedRequest.request_id, "Rejected", selectedRequest.admin_remarks)}>
                                <AlertTriangle size={16} /> Reject
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <AdminLayout>
            <div className="admin-dashboard-content">
                <h1 className="admin-title-h1" style={{paddingLeft: 0}}>Service Request Queue</h1>
                <div className="data-section-box">

                    {loading ? (
                        <p style={{ color: "#9ca3af" }}>Loading requests...</p>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Resident</th>
                                        <th>Request Type</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th style={{ width: "140px", textAlign: "center" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length > 0 ? requests.map(req => (
                                        <tr key={req.request_id}>
                                            <td style={{fontWeight: 500, color: '#e5e7eb'}}>{req.full_name}</td>
                                            <td>{req.request_type.replaceAll("_", " ")}</td>
                                            <td>{req.date_requested}</td>
                                            <td>
                                                <span className={`status-badge ${badgeClass(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <div className="table-actions">
                                                    <button className="action-button edit-button" onClick={() => openModal(req)} title="View / Update">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="action-button delete-button" onClick={() => deleteRequest(req.request_id)} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>No requests found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* VIEW REQUEST MODAL */}
            {isModalOpen && selectedRequest && <RequestViewModal />}

        </AdminLayout>
    );
}