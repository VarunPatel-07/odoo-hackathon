import { FaBuilding } from "react-icons/fa";
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
  FiTrendingUp,
} from "react-icons/fi";

// Tab Components
export const OverviewTab = ({ profileData }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiClipboard className="text-blue-600" />
      Overview
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard icon={FiUser} label="Full Name" value={profileData?.user_info?.full_name} color="blue" />
      <InfoCard icon={FiMail} label="Email" value={profileData?.user_info?.email} color="emerald" />
      <InfoCard icon={FiUser} label="Username" value={profileData?.user_info?.username} color="purple" />
      <InfoCard
        icon={FiCalendar}
        label="Date Joined"
        value={new Date(profileData.user_info?.date_joined).toLocaleDateString()}
        color="amber"
      />

      <InfoCard icon={FiShield} label="Primary Role" value={profileData.primary_role} color="red" />
    </div>
  </div>
);

export const MyTasksTab = ({ employeeStats }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiCheckCircle className="text-emerald-600" />
      My Tasks
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard icon={FiActivity} label="Pending Requests" value={employeeStats?.pending_requests ?? 0} color="amber" />
      <StatCard
        icon={FiCheckCircle}
        label="Completed Requests"
        value={employeeStats?.completed_requests ?? 0}
        color="emerald"
      />
    </div>
  </div>
);

export const MaintenanceTab = ({ maintenanceStats }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiTool className="text-orange-600" />
      Maintenance Statistics
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={FiActivity}
        label="Total Requests"
        value={maintenanceStats?.total_maintenance_requests ?? 0}
        color="blue"
      />
      <StatCard
        icon={FiCheckCircle}
        label="Completed"
        value={maintenanceStats?.completed_requests ?? 0}
        color="emerald"
      />
      <StatCard icon={FiClock} label="Pending" value={maintenanceStats?.pending_requests ?? 0} color="amber" />
    </div>
  </div>
);

export const VendorPortfolioTab = ({ vendorInfo }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiPackage className="text-purple-600" />
      Vendor Portfolio
    </h3>
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <pre className="text-sm text-slate-700 overflow-auto">
        {vendorInfo ? JSON.stringify(vendorInfo, null, 2) : "No vendor information available"}
      </pre>
    </div>
  </div>
);

export const CompanyDashboardTab = ({ companyInfo }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FaBuilding className="text-amber-600" />
      Company Dashboard
    </h3>
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <pre className="text-sm text-slate-700 overflow-auto">
        {companyInfo ? JSON.stringify(companyInfo, null, 2) : "No company information available"}
      </pre>
    </div>
  </div>
);

export const MyTeamTab = ({ leadershipInfo }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiUsers className="text-indigo-600" />
      My Team
    </h3>
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <pre className="text-sm text-slate-700 overflow-auto">
        {leadershipInfo ? JSON.stringify(leadershipInfo, null, 2) : "No team information available"}
      </pre>
    </div>
  </div>
);

export const AdminTab = ({ adminStats }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiShield className="text-red-600" />
      Admin Panel
    </h3>
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <pre className="text-sm text-slate-700 overflow-auto">
        {adminStats ? JSON.stringify(adminStats, null, 2) : "No admin statistics available"}
      </pre>
    </div>
  </div>
);

export const SettingsTab = ({ userInfo }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
      <FiSettings className="text-slate-600" />
      Account Settings
    </h3>
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
        <input
          type="email"
          value={userInfo?.email || ""}
          disabled
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
      </div>
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
        <input
          type="text"
          value={userInfo?.username || ""}
          disabled
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
      </div>
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
        <input
          type="text"
          value={userInfo?.full_name || ""}
          disabled
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
      </div>
    </div>
  </div>
);

// Helper Components
const InfoCard = ({ label, value, color }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
    <div className={`bg-${color}-100 p-2 rounded-lg w-8 h-8 flex items-center justify-center`}></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-sm text-slate-900 truncate">{value || "N/A"}</p>
    </div>
  </div>
);

export const StatCard = ({ label, value, color }) => (
  <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-6 border-2 border-${color}-200`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`bg-white p-3 rounded-lg`}>{/* <Icon className={`w-6 h-6 text-${color}-600`} /> */}</div>
    </div>
    <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
    <p className="text-sm font-medium text-slate-600">{label}</p>
  </div>
);

export const Sidebar = ({ user_info, roles, primary_role }) => (
  <div className="lg:col-span-4">
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32"></div>
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center -mt-16">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
              {user_info?.full_name?.charAt(0) || user_info?.username?.charAt(0) || "U"}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4 text-center">
            {user_info?.full_name || user_info?.username}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {primary_role || "User"}
            </span>
          </div>

          {/* Info Cards */}
          <div className="mt-6 space-y-3">
            <InfoCard label="Email" value={user_info?.email} color="blue" />
            <InfoCard label="Username" value={user_info?.username} color="emerald" />
            <InfoCard
              label="Member Since"
              value={new Date(user_info?.date_joined).toLocaleDateString()}
              color="purple"
            />
            <InfoCard label="Last Login" value={new Date(user_info?.last_login).toLocaleString()} color="amber" />
          </div>

          {/* Roles */}
          {roles && roles.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
    <h3 className="text-lg font-semibold text-slate-700">Loading Profile...</h3>
  </div>
);

// Error Screen
export const ErrorScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
    <h3 className="text-lg font-semibold text-slate-700">Error loading profile</h3>
  </div>
);
