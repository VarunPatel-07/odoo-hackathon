import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MaintenanceRequest from "./pages/MaintenanceRequest.jsx";
import Config from "./pages/Config.jsx";

/**
 * Main App Component with Routing Configuration
 * 
 * This application has 3 main pages:
 * 1. Dashboard - Main overview page
 * 2. Maintenance Request - Handle maintenance requests
 * 3. Config - System configuration and settings
 */
function App() {
  return (
    <Routes>
      {/* ==================== AUTH ROUTES (No Sidebar) ==================== */}
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* ==================== PROTECTED ROUTES (With Sidebar Layout) ==================== */}
      <Route path="/" element={<Layout />}>
        {/* Default route - redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard Page */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Maintenance Request Page */}
        <Route path="maintenance-request" element={<MaintenanceRequest />} />
        
        {/* Configuration Page */}
        <Route path="config" element={<Config />} />
      </Route>

      {/* ==================== FALLBACK ROUTE ==================== */}
      {/* Redirect any unknown routes to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
