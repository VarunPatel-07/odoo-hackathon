import { useState } from "react";

/**
 * PROFILE PAGE COMPONENT
 * 
 * This is a unified profile page that will show different sections based on user role.
 * Currently showing basic structure - connect to backend API later.
 * 
 * FUTURE BACKEND INTEGRATION POINTS:
 * - Line 20: Fetch user data from API
 * - Line 45: Update profile API call
 * - Line 60: Change password API call
 * - Line 75: Upload profile picture API call
 * 
 * ROLE-BASED VISIBILITY (To implement later):
 * - Employee: Show tasks, maintenance history, team info
 * - Vendor: Show supplied equipment, warranties, service requests
 * - Company Rep: Show company overview, departments, equipment fleet
 * - Team Leader: Show team management, task assignments
 * - Admin: Show system settings, user management
 */

const Profile = () => {
  // ==================== STATE MANAGEMENT ====================
  // TODO: Replace with API data
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // Tabs: overview, activity, settings
  
  // Mock user data - REPLACE WITH API CALL
  const [userData, setUserData] = useState({
    // Basic Info
    fullName: "John Doe",
    email: "john.doe@company.com",
    phone: "+91 98765 43210",
    position: "Maintenance Engineer",
    department: "Engineering",
    employeeId: "EMP-2024-001",
    memberSince: "January 2024",
    profilePicture: "https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff&size=128",
    
    // Role & Permissions - TODO: Get from backend
    role: "employee", // Options: employee, vendor, company_rep, team_leader, admin
    isTeamLeader: false,
    isAdmin: false,
    
    // Statistics - TODO: Fetch from API
    stats: {
      totalRequests: 45,
      completedTasks: 38,
      pendingTasks: 7,
      averageResponseTime: "2.5 hours"
    },
    
    // Teams - TODO: Fetch from API
    teams: [
      { id: 1, name: "Maintenance Team A" },
      { id: 2, name: "Equipment Care Unit" }
    ]
  });

  // ==================== API INTEGRATION FUNCTIONS ====================
  
  /**
   * UPDATE PROFILE - Connect to backend API
   * Endpoint: PUT /api/users/profile/
   * Body: { fullName, phone, ... }
   */
  const handleUpdateProfile = async () => {
    // TODO: Add API call here
    console.log("Update profile:", userData);
    // Example:
    // const response = await fetch('/api/users/profile/', {
    //   method: 'PUT',
    //   headers: { 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify(userData)
    // });
    setIsEditing(false);
    alert("Profile updated! (Connect to backend)");
  };

  /**
   * CHANGE PASSWORD - Connect to backend API
   * Endpoint: POST /api/users/change-password/
   * Body: { oldPassword, newPassword }
   */
  const handleChangePassword = () => {
    // TODO: Add password change API call
    console.log("Change password clicked");
    alert("Password change modal - implement later");
  };

  /**
   * UPLOAD PROFILE PICTURE - Connect to backend API
   * Endpoint: POST /api/users/profile-picture/
   * Body: FormData with image file
   */
  const handleUploadPicture = (event) => {
    // TODO: Add image upload API call
    const file = event.target.files[0];
    console.log("Upload picture:", file);
    alert("Image upload - implement later");
  };

  // ==================== UI COMPONENTS ====================

  /**
   * TAB NAVIGATION
   * Switches between different sections of the profile
   */
  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "activity", label: "Activity", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <div style={{ padding: "32px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

           {/* ==================== BACK BUTTON ==================== */}
    <button
      onClick={() => window.history.back()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#374151",
        cursor: "pointer",
        marginBottom: "16px",
        fontWeight: "500"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white";
      }}
    >
      <span style={{ fontSize: "16px" }}>←</span>
      <span>Back</span>
    </button>
      {/* ==================== PAGE HEADER ==================== */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>
          Profile
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Manage your account information and settings
        </p>
      </div>

      {/* ==================== MAIN CONTENT GRID ==================== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        
        {/* ==================== LEFT SIDEBAR - PROFILE CARD ==================== */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          height: "fit-content",
          position: "sticky",
          top: "32px"
        }}>
          {/* Profile Picture */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={userData.profilePicture}
                alt="Profile"
                style={{
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                  border: "4px solid #e5e7eb"
                }}
              />
              {/* Upload Button - TODO: Connect to API */}
              <label
                htmlFor="profile-upload"
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  border: "3px solid white"
                }}
              >
                📷
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleUploadPicture}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
              {userData.fullName}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 4px 0" }}>
              {userData.position}
            </p>
            <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
              {userData.department}
            </p>
          </div>

          {/* Role Badge - TODO: Make dynamic based on backend role */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{
              display: "inline-block",
              padding: "6px 16px",
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              {userData.role === "admin" ? "👑 Administrator" : 
               userData.isTeamLeader ? "👥 Team Leader" : 
               "👤 Employee"}
            </span>
          </div>

          {/* Quick Stats - TODO: Fetch from API */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              textAlign: "center"
            }}>
              <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: 0 }}>
                  {userData.stats.totalRequests}
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                  Total Requests
                </p>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: 0 }}>
                  {userData.stats.completedTasks}
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                  Completed
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                Email
              </p>
              <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                {userData.email}
              </p>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                Phone
              </p>
              <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                {userData.phone}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                Member Since
              </p>
              <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                {userData.memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT CONTENT - MAIN SECTIONS ==================== */}
        <div>
          {/* Tab Navigation */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            display: "flex",
            gap: "8px",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: activeTab === tab.id ? "#2563eb" : "transparent",
                  color: activeTab === tab.id ? "white" : "#6b7280",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ==================== TAB CONTENT ==================== */}
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              {/* Personal Information Card */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "24px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: isEditing ? "#10b981" : "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    {isEditing ? "💾 Save" : "✏️ Edit"}
                  </button>
                </div>

                {/* Form Fields - TODO: Make editable when isEditing is true */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.fullName}
                      disabled={!isEditing}
                      onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: isEditing ? "white" : "#f9fafb"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={userData.employeeId}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "#f9fafb"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled={!isEditing}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: isEditing ? "white" : "#f9fafb"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      disabled={!isEditing}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: isEditing ? "white" : "#f9fafb"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                      Position
                    </label>
                    <input
                      type="text"
                      value={userData.position}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "#f9fafb"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                      Department
                    </label>
                    <input
                      type="text"
                      value={userData.department}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        backgroundColor: "#f9fafb"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Teams Card - TODO: Fetch from API */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "32px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 16px 0" }}>
                  My Teams
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {userData.teams.map((team) => (
                    <div
                      key={team.id}
                      style={{
                        padding: "16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "24px" }}>👥</span>
                        <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>
                          {team.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "12px",
                        color: "#10b981",
                        backgroundColor: "#d1fae5",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontWeight: "500"
                      }}>
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB - TODO: Fetch activity logs from API */}
          {activeTab === "activity" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 24px 0" }}>
                Recent Activity
              </h3>
              
              {/* Activity Timeline - TODO: Replace with API data */}
              <div style={{ position: "relative", paddingLeft: "40px" }}>
                {/* Timeline line */}
                <div style={{
                  position: "absolute",
                  left: "15px",
                  top: "0",
                  bottom: "0",
                  width: "2px",
                  backgroundColor: "#e5e7eb"
                }} />

                {/* Sample Activity Items */}
                {[
                  { time: "2 hours ago", action: "Completed maintenance request #1234", icon: "✅" },
                  { time: "5 hours ago", action: "Created new maintenance request", icon: "📝" },
                  { time: "Yesterday", action: "Updated profile information", icon: "✏️" },
                  { time: "2 days ago", action: "Joined Maintenance Team A", icon: "👥" }
                ].map((activity, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "24px",
                      position: "relative"
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      left: "-40px",
                      width: "32px",
                      height: "32px",
                      backgroundColor: "white",
                      border: "2px solid #2563eb",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px"
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{
                      padding: "12px 16px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb"
                    }}>
                      <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 4px 0" }}>
                        {activity.action}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div>
              {/* Security Settings */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "24px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 24px 0" }}>
                  Security Settings
                </h3>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: "500", color: "#374151", margin: "0 0 4px 0" }}>
                      Change Password
                    </p>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                      Update your password regularly for better security
                    </p>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Notification Preferences - TODO: Connect to backend */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "32px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 24px 0" }}>
                  Notification Preferences
                </h3>
                
                {[
                  { id: "email", label: "Email Notifications", description: "Receive notifications via email" },
                  { id: "task", label: "Task Assignments", description: "Get notified when tasks are assigned to you" },
                  { id: "team", label: "Team Updates", description: "Updates about your team activities" }
                ].map((pref) => (
                  <div
                    key={pref.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #e5e7eb"
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: "500", color: "#374151", margin: "0 0 4px 0" }}>
                        {pref.label}
                      </p>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                        {pref.description}
                      </p>
                    </div>
                    <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#2563eb",
                        transition: "0.4s",
                        borderRadius: "24px"
                      }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
