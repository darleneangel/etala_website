import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ResidentsPage from "./pages/ResidentsPage";
import Error404 from "./pages/Error404";
import ServicesPage from "./pages/ServicesPage";
import SDG11 from "./pages/SDG11";
import AboutPage from "./pages/AboutPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/forgotpasswordpage";
import RegisterPage from "./pages/RegisterPage";
import ServicesRequests from "./pages/ServicesRequests";
import Profile from "./pages/Profile";
import Announcements from "./pages/Announcements";
import EmergencyContacts from "./pages/EmergencyContacts";
import RequestForm from "./pages/RequestForm";
import RequestHistory from "./pages/RequestHistory";
import DashboardLayout from "./components/DashboardLayout";
// --- ADMIN PAGES --- //
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminResidents from "./pages/admin/AdminResidents";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/residents" element={<ResidentsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/sdg" element={<SDG11 />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/services" element={<ServicesRequests />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/announcements" element={<Announcements />} />
        <Route path="/dashboard/emergency" element={<EmergencyContacts />} />
        <Route path="/request-form" element={<RequestForm />} />
        <Route path="/dashboard/requests" element={<RequestHistory />} />
        <Route path="/dashboard/*" element={<DashboardLayout><Error404 /></DashboardLayout>} />

        {/* ADMIN ROUTES */}
<Route 
  path="/admin/dashboard" 
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route 
  path="/admin/residents" 
  element={
    <AdminRoute>
      <AdminResidents />
    </AdminRoute>
  }
/>

<Route 
  path="/admin/announcements" 
  element={
    <AdminRoute>
      <AdminAnnouncements />
    </AdminRoute>
  }
/>

<Route 
  path="/admin/requests" 
  element={
    <AdminRoute>
      <AdminRequests />
    </AdminRoute>
  }
/>


                {/* Catch-all */}
                <Route path="*" element={<Error404 />} />
              </Routes>
            </BrowserRouter>
          );
        }
