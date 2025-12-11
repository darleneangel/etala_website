import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  // 1. Define the state here
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      {/* 2. Pass state and setter down to Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`main-content ${collapsed ? "expanded" : ""}`}>
        {children}
      </main>

    </div>
  );
}