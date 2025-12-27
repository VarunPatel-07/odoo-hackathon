import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import ProtectedRoutes from "./layout/ProtectedRoutes.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import ConfigModule from "./pages/config/index.jsx";
import { CONFIG_SIDEBAR_ITEMS } from "./constant/configModule.jsx";
import Profile from "./pages/profile/index.jsx";
import MaintenanceCalendar from "./pages/maintenance/calenderView.jsx";
import Maintenance from "./pages/maintenance/index.jsx";

function App() {
  return (
    <Routes>
      {/* ==================== AUTH ROUTES (No Sidebar) ==================== */}
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          <Route path="maintenance" element={<Maintenance />} />
          <Route path="maintenance-calender" element={<MaintenanceCalendar />} />

          <Route path="config" element={<ConfigModule />}>
            {CONFIG_SIDEBAR_ITEMS?.map((item) => {
              return <Route path={item?.path} element={item?.component} />;
            })}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
