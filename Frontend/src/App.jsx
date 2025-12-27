import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import ProtectedRoutes from "./layout/ProtectedRoutes.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import ConfigModule from "./pages/config/index.jsx";
import { CONFIG_SIDEBAR_ITEMS } from "./constant/configModule.jsx";
import MaintenanceRequest from "./pages/maintenance/index.jsx";

function App() {
  return (
    <Routes>
      {/* ==================== AUTH ROUTES (No Sidebar) ==================== */}
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="maintenance-request" element={<MaintenanceRequest />} />

          <Route path="config" element={<ConfigModule />}>
            {CONFIG_SIDEBAR_ITEMS?.map((item) => {
              return <Route path={item?.path} element={item?.component} />;
            })}
          </Route>
        </Route>
      </Route>
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
