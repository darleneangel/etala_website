import React, { useEffect, useState, useMemo } from "react";
import { Users, ClipboardList, Clock, CheckCircle, ChevronLeft, ChevronRight, LogOut, Home, Megaphone, Zap, Activity, Menu, ArrowRight, Plus, Edit, Trash2, X, Eye, AlertTriangle, Calendar, Mail, Image } from 'lucide-react';
import { BrowserRouter, Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom"; 

// NOTE: In your real project, AdminLayout and AdminSidebar would be imported.
// They are defined here to make the preview runnable and styled.

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

                    .modal-info-field { background: #334155; padding: 8px; border-radius: 6px; margin-bottom: 10px; }
                    .modal-info-field b { color: #94a3b8; font-weight: 500; display: block; font-size: 0.8rem; }
                    .modal-info-field span { font-size: 1rem; color: white; display: block; margin-top: 3px; }
                    .modal-description { background: #334155; padding: 12px; border-radius: 6px; white-space: pre-wrap; }
                    .modal-description b { color: #94a3b8; font-weight: 500; display: block; font-size: 0.8rem; margin-bottom: 5px; }

                    .loading-state { padding: 32px; background-color: #1f2937; border-radius: 12px; border: 1px solid #334155; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spinner { animation: spin 1s linear infinite; }
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


// --- MAIN ADMIN ANNOUNCEMENTS COMPONENT ---
export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

    const API_BASE = "http://localhost/etala_website/etala-api/backend";
    const API = useMemo(() => ({
        GET: `${API_BASE}/admin_announcements_get.php`,
        ADD: `${API_BASE}/admin_announcements_add.php`,
        UPDATE: `${API_BASE}/admin_announcements_update.php`,
        DELETE: `${API_BASE}/admin_announcements_delete.php`,
    }), [API_BASE]);
    
    // Mock Data for reliable preview when PHP server is offline
    const MOCK_ANNOUNCEMENTS = useMemo(() => ([
        { id: 1, title: "Water Interruption Notice", content: "Water will be shut off for maintenance from 10am to 2pm. Please store water in advance.", posted_at: "2025-12-09 10:00:00", admin_email: "admin@etala.com", image_base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" },
        { id: 2, title: "Community Meeting Reminder", content: "General assembly meeting scheduled for next Sunday at 5pm in the hall. Please ensure attendance.", posted_at: "2025-12-05 15:30:00", admin_email: "admin@etala.com", image_base64: "" },
    ]), []);


    /** LOAD ALL ANNOUNCEMENTS **/
    const fetchAnnouncements = () => {
        setLoading(true);
        fetch(API.GET, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.announcements) setAnnouncements(data.announcements);
                else {
                    console.warn("Announcements API failed, using mock data.");
                    setAnnouncements(MOCK_ANNOUNCEMENTS);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching announcements, using mock data:", err);
                setAnnouncements(MOCK_ANNOUNCEMENTS);
                setLoading(false);
            });
    };

    useEffect(() => { fetchAnnouncements(); }, [MOCK_ANNOUNCEMENTS]);

    /** CRUD Handlers **/
    const handleAdd = () => {
        setCurrentAnnouncement(null);
        setIsModalOpen(true);
    };

    const handleEdit = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;

        const form = new FormData();
        form.append("id", id);

        fetch(API.DELETE, { method: "POST", body: form, credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Announcement deleted!");
                    fetchAnnouncements();
                } else alert(`Failed to delete: ${data.message}`);
            })
            .catch(err => {
                console.error("Delete error:", err);
                alert("Critical error during deletion. Check console.");
            });
    };
    
    const handleSave = (formData) => {
        const url = formData.has('id') ? API.UPDATE : API.ADD;

        fetch(url, { method: 'POST', body: formData, credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(`Announcement ${formData.has('id') ? 'updated' : 'added'}!`);
                    setIsModalOpen(false);
                    fetchAnnouncements();
                } else {
                    alert(`Failed to save: ${data.message}`);
                }
            })
            .catch(err => {
                console.error("Save error:", err);
                alert("Critical error during save. Check console.");
            });
    };
    
    // --- Components ---

    const AnnouncementFormModal = () => {
        const initialForm = currentAnnouncement || { id: null, title: '', content: '', image_base64: null, posted_at: '', admin_email: '' };
        const [formData, setFormData] = useState(initialForm);
        const [imageFile, setImageFile] = useState(null);
        const isEdit = !!currentAnnouncement;

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };
        
        const handleFileChange = (e) => {
            setImageFile(e.target.files[0]);
        };
        
        const handleSubmit = (e) => {
            e.preventDefault();
            
            const data = new FormData();
            if (isEdit) data.append('id', formData.id);
            
            data.append('title', formData.title);
            data.append('content', formData.content);
            
            if (imageFile) {
                // Sending the new file if uploaded
                data.append('image', imageFile);
            } else if (isEdit && formData.image_base64 && !imageFile) {
                // If editing and no new file is uploaded, BUT existing data is present,
                // you would ideally send a flag to PHP to NOT clear the existing image.
                // Since the PHP update script requires a file or omits the column, 
                // we only send the file if it exists. PHP should handle the preservation.
            }
            
            handleSave(data);
        };

        const imageSrc = imageFile ? URL.createObjectURL(imageFile) : (formData.image_base64 ? `data:image/jpeg;base64,${formData.image_base64}` : null);


        return (
            <div className="modal-overlay">
                <form onSubmit={handleSubmit} className="form-modal-content" encType="multipart/form-data" style={{maxWidth: '700px'}}>
                    <button type="button" className="form-close-btn" onClick={() => setIsModalOpen(false)}>
                        <X size={20} />
                    </button>
                    <h3 style={{color: isEdit ? '#fcd34d' : '#60a5fa', marginBottom: '10px'}}>{isEdit ? 'Edit Announcement' : 'Create New Announcement'}</h3>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} required rows={5} style={{padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#334155', color: 'white', fontSize: '1rem'}} />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="image">Image (Max 8MB)</label>
                        <input name="image" type="file" accept="image/*" onChange={handleFileChange} style={{padding: '5px 0'}} />
                        
                        {imageSrc && (
                            <div style={{marginTop: '15px', border: '1px solid #374151', borderRadius: '8px', overflow: 'hidden'}}>
                                <img src={imageSrc} alt="Preview" style={{maxHeight: '200px', width: '100%', objectFit: 'cover'}} />
                            </div>
                        )}
                        {!imageSrc && isEdit && <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>No image currently set.</p>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="action-button" style={{backgroundColor: isEdit ? '#d97706' : '#60a5fa'}}>
                            {isEdit ? 'Save Changes' : 'Post Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="admin-dashboard-content">
                <div className="data-section-box">
                    <div className="residents-controls" style={{marginTop: '0'}}>
                        <h2 style={{fontSize: '1.5rem', color: '#ffffff', fontWeight: 600}}>Announcements Editor</h2>
                        <button className="action-button" onClick={handleAdd}>
                            <Plus size={18} /> New Announcement
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ color: "#9ca3af", textAlign: 'center', padding: '20px' }}>Loading announcements...</p>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Content Preview</th>
                                        <th>Admin Email</th>
                                        <th>Date</th>
                                        <th style={{ width: "120px", textAlign: "center" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {announcements.length > 0 ? announcements.map(a => (
                                        <tr key={a.id}>
                                            <td style={{fontWeight: 600, color: '#e5e7eb', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{a.title}</td>
                                            <td style={{maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{a.content}</td>
                                            <td>{a.admin_email}</td>
                                            <td>{new Date(a.posted_at).toLocaleDateString()}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <div className="table-actions">
                                                    <button className="action-button edit-button" onClick={() => handleEdit(a)} title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-button delete-button" onClick={() => handleDelete(a.id)} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>No announcements found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && <AnnouncementFormModal />}

        </AdminLayout>
    );
}