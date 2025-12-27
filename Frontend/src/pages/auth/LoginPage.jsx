import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { useState } from "react";

import { isValidEmail } from "../../utils/helper/helper";
import { ERROR_MESSAGES } from "../../constant/constant";
import { multipleApi } from "../../utils/api/api";


// Main login page with left illustration and right form
function LoginPage() {
  // ---------- STATE ----------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  console.log(showError, email, password);

  // ---------- HANDLERS ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email?.trim()?.length === 0 || password?.trim()?.length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);

    setLoading(true);

    const endpoints = [
      {
        endPoint: "auth/login/",
        protected: false,
        method: "POST",
        data: {
          username: email,
          password: password,
        },
      },
    ];
    const response = await multipleApi(endpoints);

    const res = response[0];

    console.log(res);
  };

  // ---------- UI ----------
  return (
    // full-screen split layout, no outer white card
    <div className="min-h-screen w-full bg-gray-100 grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE: illustration and text */}
      <div className="relative flex items-center justify-center bg-linear-to-b from-sky-200 to-sky-200">
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
          <h2 className="text-xl font-semibold">Preventive Maintenance Company</h2>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xs mx-auto">
            Manage maintenance schedules, track tasks, and keep your equipment running smoothly with a unified
            dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: login form */}
      <div className="relative flex items-center justify-center bg-linear-to-tr from-gray-50 via-gray-100 to-gray-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-72 h-72 bg-white/70 rounded-full blur-3xl opacity-80 -translate-x-20 -translate-y-10" />
        </div>

        <div className="relative w-full max-w-md px-6 py-8">
          <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 gap-10">
              <Input
                label="Email"
                placeHolder="Enter your Email"
                isRequiredField={true}
                type="text"
                value={email}
                setValue={setEmail}
                showError={showError}
                errorMessage={
                  showError
                    ? email?.trim() === ""
                      ? ERROR_MESSAGES.REQUIRED_FIELD
                      : !isValidEmail(email)
                      ? ERROR_MESSAGES.VALID_EMAIL
                      : ""
                    : ""
                }
                className="text-base border border-gray-400 rounded-xl"
              />

              <div className="w-full">
                <Input
                  label="Password"
                  placeHolder="Enter your Password"
                  isRequiredField={true}
                  type="password"
                  value={password}
                  setValue={setPassword}
                  showError={showError}
                  errorMessage={
                    showError
                      ? password?.trim() == ""
                        ? ERROR_MESSAGES.REQUIRED_FIELD
                        : password?.trim()?.length < 5
                        ? ERROR_MESSAGES.STRONG_PASSWORD
                        : ""
                      : ""
                  }
                  className="text-base border border-gray-400 rounded-xl"
                />
                <div className="flex justify-end pt-4">
                  <Link to={"/auth/forgot-password"} className="text-base text-gray-600 hover:underline">
                    Forget your password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-red-400 hover:bg-red-500 text-white font-medium py-4">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-4 text-[10px] text-gray-600 text-center max-w-sm mx-auto">
            By continuing you agree to your Terms &amp; Conditions and Privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
