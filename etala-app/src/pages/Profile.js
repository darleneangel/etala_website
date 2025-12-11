import React, { useState, useEffect } from "react";
import {
  Home, User, FileText, Bell,
  Phone, LogOut, Menu, Pencil, Save, X,
  Calendar, Flag, Heart, Smile
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
// 3. MAIN PROFILE COMPONENT
// =========================================
export default function Profile() {
  const defaultProfile = {
    first_name: "", middle_name: "", last_name: "",
    email: "", contact: "", address: "",
    birthdate: "", gender: "", civil_status: "",
    citizenship: "", photo: null
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost/etala_website/etala-api/backend/get_profile.php", {
          method: "GET",
          credentials: "include" 
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (data.success) {
              const safeData = { ...defaultProfile, ...data.profile };
              setProfile(safeData);
              setFormData(safeData);
            } else {
              console.warn("API Error:", data.message);
            }
        } catch (jsonError) {
            console.error("JSON Parse Error. Server returned:", text);
        }
      } catch (err) {
        console.error("Network Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      setFormData(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);

    const fd = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== "photo" && key !== "photoFile") {
        fd.append(key, formData[key] ?? "");
      }
    });

    if (formData.photoFile) {
      fd.append("photo", formData.photoFile);
    }

    try {
      const res = await fetch(
        "http://localhost/etala_website/etala-api/backend/update_profile.php",
        {
          method: "POST",
          body: fd,
          credentials: "include"
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Profile updated successfully!");
        setProfile(formData);  
        setIsEditing(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating profile");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-[#101726]">Loading profile...</div>;
  }

  const display = isEditing ? formData : profile;

  return (
    <DashboardLayout>
      <style>{`
        /* PAGE LAYOUT */
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #101726, #182338, #0b132b);
          color: white;
          font-family: 'Inter', sans-serif;
          padding: 2rem;
        }

        /* CONTAINER FOR CENTERING */
        .profile-container {
          width: 85%;
          max-width: 1000px;
          margin: 0 auto;
          padding-bottom: 3rem;
        }

        /* HEADER - LEFT ALIGNED */
        .profile-header {
          text-align: left;
          margin-bottom: 2rem;
          animation: fadeDown 0.7s ease;
        }

        .profile-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          color: white;
        }

        .profile-subtitle {
          margin-top: 0.5rem;
          font-size: 1.1rem;
          color: #94a3b8;
        }

        /* SUMMARY SECTION - HORIZONTAL & LEFT ALIGNED */
        .profile-summary {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
          animation: fadeUp 0.6s ease;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .avatar-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: center;
          align-items: center;
          border: 3px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          position: relative;
          transition: border-color 0.3s ease;
        }
        
        .avatar-circle:hover {
          border-color: #60a5fa;
        }

        .user-info h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }

        .user-info p {
          color: #94a3b8;
          font-size: 1rem;
          margin-top: 0.25rem;
        }

        /* CONTENT PANELS - CENTERED & GRID (Rest Kept As Is) */
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          animation: fadeUp 0.8s ease;
        }

        .info-panel {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .panel-header {
          font-size: 1.1rem;
          font-weight: 600;
          color: #60a5fa;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-title-group {
          display: flex; align-items: center; gap: 10px;
        }

        /* GRID LAYOUTS FOR FORMS */
        .grid-2 {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;
        }
        .grid-3 {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;
        }

        /* FORM INPUTS */
        .field-group { margin-bottom: 0.5rem; }
        .field-label {
          font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem;
          text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;
        }
        .form-input {
          width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem;
          background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);
          color: white; font-size: 0.95rem; outline: none; transition: all 0.2s;
        }
        .form-input:focus { border-color: #60a5fa; background: rgba(0, 0, 0, 0.3); box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2); }
        .read-only-text {
          padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.02); border-radius: 0.5rem;
          color: #e2e8f0; border: 1px solid transparent;
        }

        /* BUTTONS */
        .action-btn {
          padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer;
          border: none; display: flex; align-items: center; gap: 0.5rem;
          transition: all 0.2s; font-size: 0.95rem;
        }
        .edit-btn { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
        .edit-btn:hover { background: rgba(59, 130, 246, 0.3); }
        .cancel-btn { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
        .cancel-btn:hover { background: rgba(239, 68, 68, 0.3); }
        .save-btn { background: #22c55e; color: white; width: 100%; justify-content: center; margin-top: 1rem; box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.3); }
        .save-btn:hover { background: #16a34a; }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .profile-summary { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .profile-container { width: 95%; }
        }
      `}</style>

      <div className="profile-page">
        
        {/* HEADER (Left Aligned) */}
          <header className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your personal and residential details.</p>
          </header>

          {/* SUMMARY SECTION (Horizontal & Left Aligned) */}
          <div className="profile-summary">
            <label style={{ cursor: isEditing ? "pointer" : "default", position: "relative" }}>
              <div className="avatar-circle">
                {display.photo ? (
                  <img src={display.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
                {isEditing && (
                  <div style={{ position: "absolute", bottom: 0, width: "100%", background: "rgba(0,0,0,0.6)", color: "white", fontSize: "0.6rem", padding: "2px", textAlign: "center" }}>
                    EDIT
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                  if (e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      setFormData((prev) => ({ ...prev, photo: url, photoFile: e.target.files[0] }));
                  }
              }} disabled={!isEditing} />
            </label>
            
            <div className="user-info">
              <h2>{profile.first_name} {profile.last_name}</h2>
              <p>{profile.email}</p>
            </div>

            <div style={{ marginLeft: "auto" }}>
              <button className={`action-btn ${isEditing ? "cancel-btn" : "edit-btn"}`} onClick={toggleEdit}>
                {isEditing ? <X size={18}/> : <Pencil size={18}/> }
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          {/* CONTENT SECTIONS (Rest Kept As Is) */}
          <div className="profile-content">
            
            {/* CONTACT INFO */}
            <div className="info-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <Phone size={20} className="text-blue-400 mr-2"/>
                  <span>Contact Information</span>
                </div>
              </div>
              <div className="grid-2">
                <Field label="Email Address" value={display.email} />
                <EditableField label="Mobile Number" name="contact" value={display.contact} isEditing={isEditing} onChange={handleChange}/>
              </div>
            </div>

            {/* PERSONAL DETAILS */}
            <div className="info-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <User size={20} className="text-blue-400 mr-2"/>
                  <span>Personal Details</span>
                </div>
              </div>
              <div className="grid-3">
                <EditableField label="First Name" name="first_name" value={display.first_name} isEditing={isEditing} onChange={handleChange}/>
                <EditableField label="Middle Name" name="middle_name" value={display.middle_name} isEditing={isEditing} onChange={handleChange}/>
                <EditableField label="Last Name" name="last_name" value={display.last_name} isEditing={isEditing} onChange={handleChange}/>
                <EditableField label="Birthdate" name="birthdate" type="date" value={display.birthdate} isEditing={isEditing} onChange={handleChange}/>
                <EditableField label="Gender" name="gender" type="select" options={["Male","Female","Other"]} value={display.gender} isEditing={isEditing} onChange={handleChange}/>
                <EditableField label="Civil Status" name="civil_status" type="select" options={["Single","Married","Separated","Widowed"]} value={display.civil_status} isEditing={isEditing} onChange={handleChange}/>
                <EditableField label="Citizenship" name="citizenship" value={display.citizenship} isEditing={isEditing} onChange={handleChange}/>
              </div>
            </div>

            {/* RESIDENCY */}
            <div className="info-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <Home size={20} className="text-blue-400 mr-2"/>
                  <span>Residency</span>
                </div>
              </div>
              <EditableField label="Address" name="address" isTextArea value={display.address} isEditing={isEditing} onChange={handleChange}/>
            </div>

            {/* SAVE BUTTON */}
            {isEditing && (
              <button className="action-btn save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving Changes..." : <><Save size={20}/> Save Changes</>}
              </button>
            )}

          </div>
        </div>
    </DashboardLayout>
  );
}

// --- HELPER COMPONENTS ---

const Field = ({ label, value }) => (
  <div>
    <p className="field-label">{label}</p>
    <div className="read-only-text">{value || "Not provided"}</div>
  </div>
);

const EditableField = ({ label, name, value, isEditing, onChange, type="text", isTextArea, options=[] }) => (
  <div>
    <p className="field-label">{label}</p>
    {!isEditing ? (
      <div className="read-only-text">{value || "Not provided"}</div>
    ) : isTextArea ? (
      <textarea className="form-input" rows="3" name={name} value={value || ""} onChange={onChange}/>
    ) : type === "select" ? (
      <select className="form-input" name={name} value={value || ""} onChange={onChange}>
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input className="form-input" type={type} name={name} value={value || ""} onChange={onChange}/>
    )}
  </div>
);