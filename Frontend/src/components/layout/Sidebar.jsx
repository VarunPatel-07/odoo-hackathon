import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiHome, FiTool, FiSettings, FiUser, FiLogOut, FiMenu, FiX, FiChevronRight } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: FiHome,
      color: "blue",
    },
    {
      id: 2,
      name: "Maintenance Request",
      path: "/maintenance",
      icon: FiTool,
      color: "emerald",
    },
    {
      id: 3,
      name: "Configuration",
      path: "/config/equipment",
      icon: FiSettings,
      color: "purple",
    },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? "80px" : "280px",
        backgroundColor: "white",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease-in-out",
        borderRight: "2px solid #e2e8f0",
      }}>
      {/* Header Section */}
      <div
        style={{
          position: "relative",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "2px solid #f1f5f9",
          background: "linear-gradient(to right, #2563eb, #1d4ed8)",
          overflow: "hidden",
        }}>
        {/* Decorative Background Pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "128px",
              height: "128px",
              backgroundColor: "white",
              borderRadius: "50%",
              transform: "translate(-64px, -64px)",
            }}></div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "96px",
              height: "96px",
              backgroundColor: "white",
              borderRadius: "50%",
              transform: "translate(48px, 48px)",
            }}></div>
        </div>

        {/* Logo and Title */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          {!isCollapsed && (
            <>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}>
                <FiTool style={{ width: "20px", height: "20px", color: "#2563eb" }} />
              </div>
              <div style={{ color: "white" }}>
                <h1 style={{ fontSize: "18px", fontWeight: "bold", lineHeight: "1.2", margin: 0 }}>Preventive</h1>
                <p style={{ fontSize: "12px", opacity: 0.9, fontWeight: "500", margin: 0 }}>Maintenance System</p>
              </div>
            </>
          )}
          {isCollapsed && (
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "white",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                margin: "0 auto",
              }}>
              <FiTool style={{ width: "20px", height: "20px", color: "#2563eb" }} />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: "relative",
            zIndex: 10,
            padding: "8px",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "none",
            color: "white",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}>
          {isCollapsed ? (
            <FiMenu style={{ width: "20px", height: "20px" }} />
          ) : (
            <FiX style={{ width: "20px", height: "20px" }} />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: "24px 12px", overflowY: "auto" }}>
        {!isCollapsed && (
          <div style={{ padding: "0 16px", marginBottom: "16px" }}>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
              Navigation
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.name : ""}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  transition: "all 0.2s ease-in-out",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  ...(isActive
                    ? {
                        background: "linear-gradient(to right, #eff6ff, #dbeafe)",
                        color: "#1d4ed8",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                        border: "2px solid #bfdbfe",
                      }
                    : {
                        color: "#475569",
                        border: "2px solid transparent",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.color = "#0f172a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#475569";
                  }
                }}>
                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      width: "4px",
                      height: "32px",
                      backgroundColor: "#2563eb",
                      borderRadius: "0 4px 4px 0",
                    }}></div>
                )}

                {/* Icon with background */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                    ...(isActive
                      ? {
                          backgroundColor:
                            item.color === "blue"
                              ? "#dbeafe"
                              : item.color === "emerald"
                              ? "#d1fae5"
                              : item.color === "purple"
                              ? "#e9d5ff"
                              : "#fef3c7",
                          color:
                            item.color === "blue"
                              ? "#1d4ed8"
                              : item.color === "emerald"
                              ? "#059669"
                              : item.color === "purple"
                              ? "#7c3aed"
                              : "#d97706",
                        }
                      : {
                          backgroundColor: "#f1f5f9",
                          color: "#64748b",
                        }),
                  }}>
                  <Icon style={{ width: "20px", height: "20px" }} />
                </div>

                {/* Menu Item Text */}
                {!isCollapsed && (
                  <span className="whitespace-nowrap" style={{ flex: 1, fontWeight: "500", fontSize: "14px" }}>
                    {item.name}
                  </span>
                )}

                {/* Arrow Indicator */}
                {!isCollapsed && !isActive && (
                  <FiChevronRight
                    style={{
                      width: "16px",
                      height: "16px",
                      opacity: 0,
                      transform: "translateX(-8px)",
                      transition: "all 0.2s",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section / Logout */}
      <div style={{ borderTop: "2px solid #f1f5f9", padding: "16px" }}>
        {!isCollapsed && (
          <Link
            to={"/profile"}
            className="block"
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "linear-gradient(to right, #f8fafc, #f1f5f9)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(to bottom right, #3b82f6, #2563eb)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}>
                U
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#0f172a",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  User Account
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  user@example.com
                </p>
              </div>
            </div>
          </Link>
        )}

        <Link
          to="/auth/sign-in"
          title={isCollapsed ? "Log Out" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "#dc2626",
            transition: "all 0.2s",
            border: "2px solid transparent",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fef2f2";
            e.currentTarget.style.color = "#b91c1c";
            e.currentTarget.style.borderColor = "#fecaca";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.borderColor = "transparent";
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#fee2e2",
              transition: "all 0.2s",
            }}>
            <FiLogOut style={{ width: "20px", height: "20px" }} />
          </div>
          {!isCollapsed && <span style={{ flex: 1, fontWeight: "500", fontSize: "14px" }}>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
