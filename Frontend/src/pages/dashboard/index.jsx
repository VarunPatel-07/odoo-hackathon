/**
 * Dashboard Page Component
 * This is the main landing page after login
 * Add your dashboard content, charts, and statistics here
 */
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your maintenance management system</p>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card 1 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">248</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">↑ 12% from last month</p>
        </div>

        {/* Stats Card 2 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Machines</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">↑ 8% from last month</p>
        </div>

        {/* Stats Card 3 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">32</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-red-600 mt-4">↓ 5% from last month</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-8 bg-white rounded-lg shadow p-8 border border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard is Ready!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your preventive maintenance dashboard is set up and ready to use. 
            You can customize this page with your own components, charts, and data.
          </p>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              💡 <strong>Next Steps:</strong> Other pages (Users, Departments, Machines, etc.) are marked as "Soon" in the sidebar. 
              You can uncomment and implement them one by one as needed.
            </p>
          </div>
        </div>
      </div>

      {/* Future Pages Section */}
      <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Coming Soon Pages</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">👥 All Users</p>
              <p className="text-sm text-gray-600 mt-1">Manage all users and employees</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">🏢 All Departments</p>
              <p className="text-sm text-gray-600 mt-1">Organize departments and teams</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">⚙️ All Machines</p>
              <p className="text-sm text-gray-600 mt-1">Track and manage equipment</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">📋 Maintenance Forms</p>
              <p className="text-sm text-gray-600 mt-1">Create maintenance schedules</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
