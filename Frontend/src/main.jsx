import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { NotificationContextApiProvider } from "./context/notification/NotificationContextApi.jsx";
import Notification from "./components/notification/Notification.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NotificationContextApiProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Notification />
    </NotificationContextApiProvider>
  </StrictMode>
);
