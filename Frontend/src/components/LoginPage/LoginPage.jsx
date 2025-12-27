// src/components/LoginPage.jsx
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { login } from "../api/auth";

// Main login page with left illustration and right form
function LoginPage() {
  // ---------- STATE ----------
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ---------- VALIDATION ----------
  const validate = () => {
    let ok = true;

    if (!id.trim()) {
      setIdError("ID is required");
      ok = false;
    } else setIdError("");

    if (!password.trim()) {
      setPasswordError("Password is required");
      ok = false;
    } else setPasswordError("");

    return ok;
  };

  // ---------- HANDLERS ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);
    try {
      // Call backend login API helper
      const data = await login({ id, password, role });

      // Example: store token if backend sends it
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      setSuccess("Login successful. Redirecting...");
      // TODO: navigate to dashboard based on role
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeLogin = () => {
    setRole("employee");
    // TODO: navigate to employee-specific page if needed
  };

  // ---------- UI ----------
  return (
  // full-screen split layout, no outer white card
  <div className="min-h-screen w-full bg-gray-100 grid grid-cols-1 lg:grid-cols-2">
    {/* LEFT SIDE: illustration and text */}
    <div className="relative flex items-center justify-center bg-gradient-to-b from-sky-200 to-sky-300">
      {/* soft light blue background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-sky-100 blur-3xl -translate-x-20 -translate-y-10" />
      </div>

      <div className="relative z-10 px-6 py-8 text-center text-slate-900 space-y-4">
        <img
          src="/maintenance.png"
          alt="Maintenance illustration"
          className="mx-auto max-h-64 w-auto object-contain drop-shadow-xl"
        />
        <h2 className="text-xl font-semibold">
          Preventive Maintenance Company
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 max-w-xs mx-auto">
          Manage maintenance schedules, track tasks, and keep your equipment
          running smoothly with a unified dashboard.
        </p>
      </div>
    </div>

    {/* RIGHT SIDE: login form */}
    <div className="relative flex items-center justify-center bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-72 h-72 bg-white/70 rounded-full blur-3xl opacity-80 -translate-x-20 -translate-y-10" />
      </div>

      <div className="relative w-full max-w-md px-6 py-8">
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin ID / Manager ID"
            placeHolder="Enter your ID !"
            isRequiredField={true}
            type="text"
            value={id}
            setValue={setId}
            showError={!!idError}
            errorMessage={idError}
            className="rounded-full text-sm"
          />

          <Input
            label="Password"
            placeHolder="Enter your Password !"
            isRequiredField={true}
            type="password"
            value={password}
            setValue={setPassword}
            showError={!!passwordError}
            errorMessage={passwordError}
            className="rounded-full text-sm"
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-[11px] text-red-500 hover:underline"
              onClick={() =>
                alert("Forgot password flow will be implemented here.")
              }
            >
              Forget your password ? Reset !
            </button>
          </div>

          {error && (
            <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-red-400 hover:bg-red-500 text-white font-medium py-2 text-sm shadow-md shadow-red-200 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button
            type="button"
            onClick={handleEmployeeLogin}
            className="w-full rounded-full border border-gray-300 text-gray-700 font-medium py-2 text-sm bg-white hover:bg-gray-50"
          >
            Login As Employee
          </Button>
        </form>

        <p className="mt-4 text-[10px] text-gray-600 text-center max-w-sm mx-auto">
          By continuing you agree to your Terms &amp; Conditions and Privacy
          policy.
        </p>
      </div>
    </div>
  </div>
);

}

export default LoginPage;
