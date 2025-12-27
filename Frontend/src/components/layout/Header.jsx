import { useState } from "react";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
        <p className="text-sm text-gray-500">Here's what's happening today</p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900">Maintenance task completed</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <img
            src="https://ui-avatars.com/api/?name=Robert+Fox&background=ef4444&color=fff"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-900">Robert Fox</p>
            <p className="text-xs text-gray-500">HR Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
