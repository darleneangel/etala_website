import React, { useEffect, useState, useMemo } from "react";
import { Users, ClipboardList, Clock, LogOut, Home, Megaphone, Menu,  Plus, Edit, Trash2, X } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom"; 

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

                    /* LAYOUT & SIDEBAR STYLES (From AdminLayout.js reference) */
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
                    .modal-content { background: #1e293b; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 350px; width: 90%; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: scale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    .btn-row { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }
                    .btn-confirm { background: #ef4444; color: white; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none;}
                    .btn-cancel { background: rgba(255,255,255,0.1); color: white; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; border: none;}
                    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes scale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                    .admin-main { flex: 1; padding: 20px; overflow-y: auto; }

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
                    .data-section-box {
                        background-color: #1f2937; 
                        padding: 24px; 
                        border-radius: 12px; 
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); 
                        border: 1px solid #374151; 
                        color: white; 
                        margin-top: 20px;
                    }
                    
                    .admin-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 16px;
                        border-radius: 8px;
                        overflow: hidden;
                        min-width: 600px;
                    }

                    .admin-table thead { background: rgba(255,255,255,0.1); }
                    .admin-table th, .admin-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: left; font-size: 0.9rem; color: #e2e8f0; }
                    .admin-table th { color: #94a3b8; font-weight: 600; text-transform: uppercase; }
                    .admin-table tbody tr:last-child td { border-bottom: none; }
                    .admin-table tbody tr:hover { background: rgba(255,255,255,0.08); cursor: pointer; }
                    
                    .residents-controls {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .action-button {
                        background-color: #60a5fa;
                        color: white;
                        padding: 10px 18px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: background-color 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .action-button:hover { background-color: #3b82f6; }
                    .action-button.delete-button { background-color: transparent; color: #f87171; padding: 8px; }
                    .action-button.delete-button:hover { background-color: rgba(239, 68, 68, 0.15); }
                    .action-button.edit-button { background-color: transparent; color: #fcd34d; padding: 8px; }
                    .action-button.edit-button:hover { background-color: rgba(251, 191, 36, 0.15); }
                    .table-actions { display: flex; gap: 5px; justify-content: flex-end; }
                    
                    .status-badge { display: inline-flex; align-items: center; padding: 4px 12px; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; border: 1px solid transparent; transition: all 0.2s; }
                    .status-Completed { background-color: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4); }
                    .status-Rejected { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.4); }
                    
                    .form-modal-content { background: #1e293b; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 650px; width: 100%; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; display: flex; flex-direction: column; gap: 15px; }
                    .form-modal-content h3 { color: #60a5fa; margin: 0; padding-bottom: 10px; border-bottom: 1px solid #374151; }
                    .form-group { display: flex; flex-direction: column; }
                    .form-group label { margin-bottom: 4px; color: #94a3b8; font-size: 0.9rem; }
                    .form-group input, .form-group select { padding: 10px; border-radius: 6px; border: 1px solid #374151; background: #334155; color: white; font-size: 1rem; }
                    .form-group input:focus, .form-group select:focus { outline: none; border-color: #60a5fa; }
                    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
                    .form-close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #94a3b8; cursor: pointer; }
                    .form-close-btn:hover { color: white; }

                    .loading-state { padding: 32px; background-color: #1f2937; border-radius: 12px; border: 1px solid #334155; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spinner { animation: spin 1s linear infinite; }
                `}
            </style>
            <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
                <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className="admin-main">
                    <h1 className="admin-title-h1">Admin Management</h1>
                    {children}
                </main>
            </div>
        </>
    );
};
// --- END Layout/Sidebar Definitions ---


// --- MAIN ADMIN RESIDENTS COMPONENT (CRUD IMPLEMENTATION) ---
export default function AdminResidents() {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentResident, setCurrentResident] = useState(null); 

    // --- API Configuration ---
    const API_BASE_URL = "http://localhost/etala_website/etala-api/backend";

    const API_ENDPOINTS = useMemo(() => ({
        GET: `${API_BASE_URL}/admin_get_residents.php`,
        ADD: `${API_BASE_URL}/admin_add_resident.php`,
        DELETE: `${API_BASE_URL}/admin_delete_resident.php`,
        UPDATE: `${API_BASE_URL}/admin_update_resident.php`,
    }), []);

    // --- Data Fetching (READ) ---
    const fetchResidents = () => {
        setLoading(true);

        fetch(API_ENDPOINTS.GET, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.residents) {
                setResidents(data.residents);
            } else {
                setResidents([]);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("GET error:", err);
            setResidents([]);
            setLoading(false);
        });
    };


    useEffect(() => {
        fetchResidents();
    }, []); // Run only once on mount


    // --- CRUD Handlers ---

    const handleAdd = () => {
        setCurrentResident(null);
        setIsModalOpen(true);
    };

    const handleEdit = (resident) => {
        setCurrentResident(resident);
        setIsModalOpen(true);
    };

    const handleDelete = (resident_id) => {
    if (!window.confirm("Delete this resident?")) return;

    const formData = new FormData();
    formData.append("resident_id", resident_id);

    fetch(API_ENDPOINTS.DELETE, {
        method: "POST",
        credentials: "include",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Resident deleted.");
            fetchResidents();
        } else {
            alert("Delete failed: " + data.message);
        }
    })
    .catch(err => {
        console.error("DELETE error:", err);
        alert("Unable to delete resident.");
    });
};


    const handleSave = (formData) => {
    const url = formData.has("resident_id")
        ? API_ENDPOINTS.UPDATE
        : API_ENDPOINTS.ADD;

    fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        if (data.success === true) {
            alert(formData.has("resident_id") ? "Resident updated!" : "Resident added!");
            setIsModalOpen(false);
            fetchResidents();
        } else {
            alert("Failed: " + data.message);
        }
    })
    .catch(err => {
        console.error("SAVE error:", err);
        alert("Unable to save resident.");
    });
};



    // Helper function for status rendering
    const getStatus = (status) => {
        const displayStatus = status === 'Active' ? 'Active' : 'Inactive';
        const statusClass = status === 'Active' ? 'status-Completed' : 'status-Rejected'; 
        return <span className={`status-badge ${statusClass}`}>{displayStatus}</span>;
    }

    // --- Components for Rendering ---
    
    // Modal for Add/Edit
    const ResidentFormModal = () => {
        const initialFormState = currentResident ? { ...currentResident, birthdate: currentResident.birthdate ? currentResident.birthdate.split(' ')[0] : '' } : { 
            first_name: '', middle_name: '', last_name: '', email: '', password: '', 
            gender: 'Male', civil_status: 'Single', birthdate: '', citizenship: 'Filipino', 
            contact: '', address: '' 
        };
        const [formData, setFormData] = useState(initialFormState);
        const [photoFile, setPhotoFile] = useState(null);
        const isEdit = !!currentResident;

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };
        
        const handleFileChange = (e) => {
            setPhotoFile(e.target.files[0]);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            
            const data = new FormData();
            
            if (isEdit) {
                data.append('resident_id', formData.resident_id); 
            } else {
                data.append('email', formData.email);
                data.append('password', formData.password);
            }

            // Append all common fields
            data.append('first_name', formData.first_name);
            data.append('middle_name', formData.middle_name || ''); 
            data.append('last_name', formData.last_name);
            data.append('gender', formData.gender);
            data.append('civil_status', formData.civil_status);
            data.append('birthdate', formData.birthdate);
            data.append('citizenship', formData.citizenship);
            data.append('contact', formData.contact);
            data.append('address', formData.address);

            // Append optional photo
            if (photoFile) {
                data.append('photo', photoFile);
            }
            
            handleSave(data);
        };

        return (
            <div className="modal-overlay">
                <form onSubmit={handleSubmit} className="form-modal-content" encType="multipart/form-data">
                    <button type="button" className="form-close-btn" onClick={() => setIsModalOpen(false)}>
                        <X size={20} />
                    </button>
                    <h3 style={{color: isEdit ? '#fcd34d' : '#60a5fa'}}>{isEdit ? 'Edit Resident' : 'Add New Resident'}</h3>
                    
                    {/* Basic Info */}
                    <div className="form-group">
                        <label htmlFor="first_name">Name</label>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                            <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
                            <input name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
                            <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <div className="form-group">
                            <label htmlFor="contact">Contact</label>
                            <input name="contact" value={formData.contact} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address/Unit</label>
                            <input name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    {/* User Credentials (Only required for ADD) */}
                    {!isEdit && (
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                            <div className="form-group">
                                <label htmlFor="email">Email (Login)</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} required={!isEdit} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} required={!isEdit} />
                            </div>
                        </div>
                    )}

                    {/* Demographic Info */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="civil_status">Civil Status</label>
                            <select name="civil_status" value={formData.civil_status} onChange={handleChange} required>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthdate">Birthdate</label>
                            <input name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="citizenship">Citizenship</label>
                        <input name="citizenship" value={formData.citizenship} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="photo">Photo (Optional)</label>
                        <input name="photo" type="file" accept="image/*" onChange={handleFileChange} style={{padding: '5px 0'}} />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="action-button" style={{backgroundColor: isEdit ? '#d97706' : '#60a5fa'}}>
                            {isEdit ? 'Save Changes' : 'Add Resident'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // --- Main Render Logic ---

    if (loading) return <AdminLayout><div className="loading-state" style={{margin: '40px'}}><p style={{color: '#94a3b8', textAlign: 'center'}}>Loading residents list...</p></div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-dashboard-content">
                
                <div className="data-section-box">
                    <div className="residents-controls">
                        <h2 style={{fontSize: '1.5rem', color: '#ffffff', fontWeight: 600}}>Residents List</h2>
                        <button className="action-button" onClick={handleAdd}>
                            <Plus size={18} /> Add New Resident
                        </button>
                    </div>
                    

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact / Email</th>
                                    <th>Address</th>
                                    <th>Civil Status</th>
                                    <th style={{width: '100px', textAlign: 'center'}}>Status</th>
                                    <th style={{width: '120px', textAlign: 'center'}}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {residents.length > 0 ? residents.map(r => (
                                    <tr key={r.id}>
                                        <td style={{fontWeight: 500, color: '#e5e7eb'}}>{r.first_name} {r.last_name}</td>
                                        <td>
                                            {r.contact}
                                            <br/><span style={{fontSize: '0.8rem', color: '#94a3b8'}}>{r.email}</span>
                                        </td>
                                        <td>{r.address}</td>
                                        <td>{r.civil_status}</td>
                                        <td style={{textAlign: 'center'}}>{getStatus(r.status || 'Active')}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <div className="table-actions" style={{justifyContent: 'center'}}>
                                                <button className="action-button edit-button" onClick={() => handleEdit(r)} title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                {/* Ensure resident_id is passed for deletion */}
                                                <button className="action-button delete-button" onClick={() => handleDelete(r.resident_id)} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{padding: '32px', textAlign: 'center', color: '#9ca3af'}}>No residents found. (Check PHP connection and authentication.)</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {isModalOpen && <ResidentFormModal />}
            </div>
        </AdminLayout>
    );
}