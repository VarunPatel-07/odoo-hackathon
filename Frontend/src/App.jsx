import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
// import SignUpPage from "./pages/auth/SignUpPage";

// Root component that holds all routes
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default route -> login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

