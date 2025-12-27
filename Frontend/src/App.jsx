import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import Dashboard from "./pages/dashboard/index.jsx";
import ProtectedRoutes from "./layout/ProtectedRoutes.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route path="/auth/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
