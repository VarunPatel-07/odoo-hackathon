
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<LoginPage />} />
    </Routes>

  );
}

export default App;

