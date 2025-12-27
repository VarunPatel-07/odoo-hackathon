
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
    </Routes>

  );
}

export default App;

