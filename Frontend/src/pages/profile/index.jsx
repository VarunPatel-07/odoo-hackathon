import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiCheckCircle,
  FiPackage,
  FiUsers,
  FiTool,
  FiShield,
  FiSettings,
  FiClipboard,
  FiActivity,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import {
  CompanyDashboardTab,
  LoadingScreen,
  MaintenanceTab,
  MyTasksTab,
  MyTeamTab,
  OverviewTab,
  SettingsTab,
  Sidebar,
  VendorPortfolioTab,
} from "../../components/ProfileModuleHelper";
import { multipleApi } from "../../utils/api/api";

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
      const endpoints = [
        {
          endPoint: "auth/profile/comprehensive/",
          protected: true,
          method: "GET",
        },
      ];

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

  if (loading) return <LoadingScreen />;

  const { user_info, roles, primary_role } = profileData;

  const getTabs = () => {
    const tabs = [{ id: "overview", label: "Overview", icon: FiClipboard, color: "blue" }];
    if (profileData.employee_stats)
      tabs.push({ id: "my-tasks", label: "My Tasks", icon: FiCheckCircle, color: "emerald" });
    if (profileData.vendor_info)
      tabs.push({ id: "vendor-portfolio", label: "Vendor Portfolio", icon: FiPackage, color: "purple" });
    if (profileData.company_info)
      tabs.push({ id: "company-dashboard", label: "Company Dashboard", icon: FaBuilding, color: "amber" });
    if (profileData.leadership_info) tabs.push({ id: "my-team", label: "My Team", icon: FiUsers, color: "indigo" });
    if (profileData.maintenance_stats)
      tabs.push({ id: "maintenance", label: "Maintenance", icon: FiTool, color: "orange" });
    tabs.push({ id: "settings", label: "Settings", icon: FiSettings, color: "slate" });
    return tabs;
  };

  const tabs = getTabs();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-400 mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <Sidebar user_info={user_info} roles={roles} primary_role={primary_role} />

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4 mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? `bg-${tab.color}-600 text-white shadow-md`
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-6">
              {activeTab === "overview" && <OverviewTab profileData={profileData} />}
              {activeTab === "my-tasks" && <MyTasksTab employeeStats={profileData.employee_stats} />}
              {activeTab === "vendor-portfolio" && <VendorPortfolioTab vendorInfo={profileData.vendor_info} />}
              {activeTab === "company-dashboard" && <CompanyDashboardTab companyInfo={profileData.company_info} />}
              {activeTab === "my-team" && <MyTeamTab leadershipInfo={profileData.leadership_info} />}
              {activeTab === "maintenance" && <MaintenanceTab maintenanceStats={profileData.maintenance_stats} />}

              {activeTab === "settings" && <SettingsTab userInfo={user_info} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
