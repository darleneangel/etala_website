import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaMegaphone, FaClipboardList, FaSignOutAlt, FaHome } from "react-icons/fa";
import "./AdminLayout.css";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-title">ADMIN PANEL</h2>

      <button onClick={() => navigate("/admin/dashboard")}>
        <FaHome /> Dashboard
      </button>

      <button onClick={() => navigate("/admin/residents")}>
        <FaUsers /> Manage Residents
      </button>

      <button onClick={() => navigate("/admin/announcements")}>
        <FaMegaphone /> Announcements
      </button>

      <button onClick={() => navigate("/admin/requests")}>
        <FaClipboardList /> Requests
      </button>

      <button className="logout" onClick={logout}>
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}
