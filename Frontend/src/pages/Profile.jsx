import { useState, useEffect } from "react";
import { multipleApi } from "../utils/api/api";

// Make sure multipleApi is imported from wherever it is defined

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Define the endpoint for fetching profile
      const endpoints = [
        {
          endPoint: "auth/profile/",
          protected: true,
          method: "GET",
        },
      ];

      // Call multipleApi
      const response = await multipleApi(endpoints);
      const res = response[0];

      if (res.success) {
        setProfileData(res.data);
      } else {
        console.error("Error fetching profile:", res);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return <div>Error loading profile</div>;
  }

  const { user_info, roles, primary_role } = profileData;

  const getTabs = () => {
    const tabs = [{ id: "overview", label: "Overview", icon: "📋" }];
    if (profileData.employee_stats) tabs.push({ id: "my-tasks", label: "My Tasks", icon: "📝" });
    if (profileData.vendor_info) tabs.push({ id: "vendor-portfolio", label: "Vendor Portfolio", icon: "📦" });
    if (profileData.company_info) tabs.push({ id: "company-dashboard", label: "Company Dashboard", icon: "🏢" });
    if (profileData.leadership_info) tabs.push({ id: "my-team", label: "My Team", icon: "👥" });
    if (profileData.maintenance_stats) tabs.push({ id: "maintenance", label: "Maintenance", icon: "🔧" });
    if (profileData.admin_stats) tabs.push({ id: "admin", label: "Admin", icon: "👑" });
    tabs.push({ id: "settings", label: "Settings", icon: "⚙️" });
    return tabs;
  };

  const tabs = getTabs();

  return (
    <div style={{ padding: "32px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
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
          fontWeight: "500",
        }}>
        <span>←</span>
        <span>Back</span>
      </button>

      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>Profile</h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>Manage your account and view your information</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "30% 70%", gap: "24px" }}>
        <ProfileSidebar userInfo={user_info} roles={roles} primaryRole={primary_role} />

        <div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: activeTab === tab.id ? "#2563eb" : "transparent",
                  color: activeTab === tab.id ? "white" : "#6b7280",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "overview" && <OverviewTab profileData={profileData} />}
            {activeTab === "my-tasks" && <MyTasksTab employeeStats={profileData.employee_stats} />}
            {activeTab === "vendor-portfolio" && <VendorPortfolioTab vendorInfo={profileData.vendor_info} />}
            {activeTab === "company-dashboard" && <CompanyDashboardTab companyInfo={profileData.company_info} />}
            {activeTab === "my-team" && <MyTeamTab leadershipInfo={profileData.leadership_info} />}
            {activeTab === "maintenance" && <MaintenanceTab maintenanceStats={profileData.maintenance_stats} />}
            {activeTab === "admin" && <AdminTab adminStats={profileData.admin_stats} />}
            {activeTab === "settings" && <SettingsTab userInfo={user_info} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// ... ProfileSidebar, StatCard, OverviewTab, and other tabs remain unchanged

export default Profile;
