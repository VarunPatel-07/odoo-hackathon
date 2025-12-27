import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar toggle

  // Updated menu items - only 3 pages
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊", // Dashboard icon
    },
    {
      id: 2,
      name: "Maintenance Request",
      path: "/maintenance-request",
      icon: "🔧", // Maintenance icon
    },
    {
      id: 3,
      name: "Config",
      path: "/config/equipment",
      icon: "⚙️", // Settings icon
    },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? "80px" : "256px", // Toggle width
        backgroundColor: "white",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease", // Smooth animation
      }}>
      {/* Logo Section */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "0" : "0 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "linear-gradient(to right, #2563eb, #1d4ed8)",
        }}>
        {!isCollapsed && (
          <div style={{ color: "white", textAlign: "left" }}>
            <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Preventive</h1>
            <p style={{ fontSize: "12px", margin: 0, opacity: 0.9 }}>Maintenance</p>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "20px",
            padding: "8px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}>
          {isCollapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: "24px 16px" }}>
        {!isCollapsed && (
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6b7280",
              textTransform: "uppercase",
              marginBottom: "16px",
              paddingLeft: "16px",
            }}>
            Menu
          </p>
        )}

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                backgroundColor: isActive ? "#eff6ff" : "transparent",
                color: isActive ? "#2563eb" : "#374151",
                fontWeight: isActive ? "500" : "normal",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
              title={isCollapsed ? item.name : ""} // Tooltip when collapsed
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {!isCollapsed && <span style={{ marginLeft: "12px" }}>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ borderTop: "1px solid #e5e7eb", padding: "16px" }}>
        <Link
          to="/auth/sign-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            color: "#dc2626",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title={isCollapsed ? "Log Out" : ""}>
          <span style={{ fontSize: "18px" }}>🚪</span>
          {!isCollapsed && <span style={{ marginLeft: "8px" }}>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
