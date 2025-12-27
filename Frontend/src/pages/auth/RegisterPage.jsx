import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useContext, useState } from "react";
import { isValidEmail } from "../../utils/helper/helper";
import { ERROR_MESSAGES } from "../../constant/constant";
import { multipleApi } from "../../utils/api/api";
import { NotificationContext } from "../../context/notification/NotificationContextApi";

// Main registration page with left illustration and right form
function RegisterPage() {
  // ---------- CONTEXT ----------
  const { handelNotification } = useContext(NotificationContext);

  // ---------- NAVIGATION ----------
  const navigate = useNavigate();

  // ---------- STATE ----------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [backendErrors, setBackendErrors] = useState({}); // Store field-specific backend errors

  // ---------- HANDLERS ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous backend errors
    setBackendErrors({});

    // Validation: Check for empty fields
    if (
      firstName?.trim()?.length === 0 ||
      lastName?.trim()?.length === 0 ||
      username?.trim()?.length === 0 ||
      email?.trim()?.length === 0 ||
      password?.trim()?.length === 0 ||
      confirmPassword?.trim()?.length === 0
    ) {
      setShowError(true);
      return;
    }

    // Validation: Check email format
    if (!isValidEmail(email)) {
      setShowError(true);
      return;
    }

    // Validation: Check password length
    if (password?.trim()?.length < 8) {
      setShowError(true);
      return;
    }

    // Validation: Check password match
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setLoading(true);

    try {
      // API call for registration
      const endpoints = [
        {
          endPoint: "auth/register/",
          protected: false,
          method: "POST",
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            password: password,
            password2: confirmPassword,
          },
        },
      ];
      const response = await multipleApi(endpoints);
      const res = response[0];

      setLoading(false);

      // Debug: Log the full response for troubleshooting
      console.log("Full API Response:", res);
      console.log("Response Status:", res?.status);
      console.log("Response Data:", res?.data);
      console.log("Response Error:", res?.error);

      // Handle successful response
      if (res?.success) {
        handelNotification({
          success: true,
          message: "Registration successful! Redirecting...",
        });
        navigate("/");
      } 
      // Handle 400 Bad Request with validation errors
      else if (res?.status === 400 || res?.error?.status === 400) {
        console.log("400 Error Detected - Validation Issues");
        
        // Parse backend validation errors
        const errorData = res?.error?.data || res?.data || {};
        console.log("Error Data:", errorData);
        
        // Set field-specific errors
        const fieldErrors = {};
        let errorMessages = [];

        // Handle different error response formats from Django REST Framework
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach((field) => {
            const fieldError = errorData[field];
            
            // Handle array of errors
            if (Array.isArray(fieldError)) {
              fieldErrors[field] = fieldError[0]; // Take first error message
              errorMessages.push(`${field}: ${fieldError[0]}`);
            } 
            // Handle string error
            else if (typeof fieldError === 'string') {
              fieldErrors[field] = fieldError;
              errorMessages.push(`${field}: ${fieldError}`);
            }
          });
        }

        console.log("Parsed Field Errors:", fieldErrors);
        setBackendErrors(fieldErrors);

        // Show notification with all errors
        handelNotification({
          success: false,
          message: errorMessages.length > 0 
            ? errorMessages.join(", ") 
            : res?.error?.message || "Registration failed. Please check your inputs.",
        });
      } 
      // Handle other errors
      else {
        console.log("Other Error Type");
        handelNotification(res);
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration Exception:", error);
      console.error("Error Details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });

      handelNotification({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Helper function to get backend error for a specific field
  const getBackendError = (fieldName) => {
    const fieldMap = {
      firstName: ["first_name", "firstName"],
      lastName: ["last_name", "lastName"],
      username: ["username"],
      email: ["email"],
      password: ["password"],
    };

    const possibleFields = fieldMap[fieldName] || [fieldName];
    for (let field of possibleFields) {
      if (backendErrors[field]) {
        return backendErrors[field];
      }
    }
    return "";
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
            Join us to manage maintenance schedules, track tasks, and keep your equipment running smoothly with a
            unified dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: registration form */}
      <div className="relative flex items-center justify-center bg-linear-to-tr from-gray-50 via-gray-100 to-gray-50 overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-72 h-72 bg-white/70 rounded-full blur-3xl opacity-80 -translate-x-20 -translate-y-10" />
        </div>

        <div className="relative w-full max-w-md px-6 py-8">
          <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">Create Your Account</h1>

          {/* Display Backend Errors Summary */}
          {Object.keys(backendErrors).length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.entries(backendErrors).map(([field, error]) => (
                  <li key={field}>
                    <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* First Name */}
              <Input
                label="First Name"
                placeHolder="Enter your first name"
                isRequiredField={true}
                type="text"
                value={firstName}
                setValue={setFirstName}
                showError={showError || !!getBackendError("firstName")}
                errorMessage={
                  getBackendError("firstName") ||
                  (showError && firstName?.trim()?.length === 0 ? ERROR_MESSAGES.REQUIRED_FIELD : "")
                }
                className="text-base border border-gray-400 rounded-xl"
              />

              {/* Last Name */}
              <Input
                label="Last Name"
                placeHolder="Enter your last name"
                isRequiredField={true}
                type="text"
                value={lastName}
                setValue={setLastName}
                showError={showError || !!getBackendError("lastName")}
                errorMessage={
                  getBackendError("lastName") ||
                  (showError && lastName?.trim()?.length === 0 ? ERROR_MESSAGES.REQUIRED_FIELD : "")
                }
                className="text-base border border-gray-400 rounded-xl"
              />

              {/* Username */}
              <Input
                label="Username"
                placeHolder="Choose a username"
                isRequiredField={true}
                type="text"
                value={username}
                setValue={setUsername}
                showError={showError || !!getBackendError("username")}
                errorMessage={
                  getBackendError("username") ||
                  (showError && username?.trim()?.length === 0 ? ERROR_MESSAGES.REQUIRED_FIELD : "")
                }
                className="text-base border border-gray-400 rounded-xl"
              />

              {/* Email */}
              <Input
                label="Email"
                placeHolder="Enter your email"
                isRequiredField={true}
                type="text"
                value={email}
                setValue={setEmail}
                showError={showError || !!getBackendError("email")}
                errorMessage={
                  getBackendError("email") ||
                  (showError
                    ? email?.trim()?.length === 0
                      ? ERROR_MESSAGES.REQUIRED_FIELD
                      : !isValidEmail(email)
                      ? ERROR_MESSAGES.VALID_EMAIL
                      : ""
                    : "")
                }
                className="text-base border border-gray-400 rounded-xl"
              />

              {/* Password */}
              <Input
                label="Password"
                placeHolder="Create a password"
                isRequiredField={true}
                type="password"
                value={password}
                setValue={setPassword}
                showError={showError || !!getBackendError("password")}
                errorMessage={
                  getBackendError("password") ||
                  (showError
                    ? password?.trim()?.length === 0
                      ? ERROR_MESSAGES.REQUIRED_FIELD
                      : password?.trim()?.length < 8
                      ? ERROR_MESSAGES.MIN_PASSWORD_LENGTH
                      : ""
                    : "")
                }
                className="text-base border border-gray-400 rounded-xl"
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                placeHolder="Confirm your password"
                isRequiredField={true}
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                showError={showError}
                errorMessage={
                  showError
                    ? confirmPassword?.trim()?.length === 0
                      ? ERROR_MESSAGES.REQUIRED_FIELD
                      : password !== confirmPassword
                      ? ERROR_MESSAGES.PASSWORD_MISMATCH
                      : ""
                    : ""
                }
                className="text-base border border-gray-400 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-red-400 hover:bg-red-500 text-white font-medium py-4">
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-red-400 hover:text-red-500 font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>

          <p className="mt-4 text-[10px] text-gray-600 text-center max-w-sm mx-auto">
            By continuing you agree to your Terms &amp; Conditions and Privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
