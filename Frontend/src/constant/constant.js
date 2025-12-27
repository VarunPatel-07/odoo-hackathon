export const UNAUTHORIZED_STATUS_CODE = [404, 401, 403];

export const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  UNAUTHORIZED: "Unauthorized",
  NO_RESPONSE_FROM_BACKEND: "No response from the backend",
  REQUIRED_FIELD: "This is an required field",
  VALID_EMAIL: "Please enter a valid email",
  STRONG_PASSWORD: "Please enter a strong password",
  MIN_PASSWORD_LENGTH: "Password must be at least 8 characters",
  PASSWORD_MISMATCH: "Passwords do not match",
};

export const AUTH_PAGE_PATH = "/auth/sign-in";

export const getEnterAnimationClass = {
  "top-right": "animate-enter-top-right",
  "top-left": "animate-enter-top-left",
  "bottom-right": "animate-enter-bottom-right",
  "bottom-left": "animate-enter-bottom-left",
  center: "animate-enter-center",
};

export const getExitAnimationClass = {
  "top-right": "animate-exit-top-right",
  "top-left": "animate-exit-top-left",
  "bottom-right": "animate-exit-bottom-right",
  "bottom-left": "animate-exit-bottom-left",
  center: "animate-exit-center",
};
