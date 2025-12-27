import { NavLink } from "react-router-dom";
import { classNames } from "../../utils/helper/helper";

function ConfigSidebar({ items }) {
  return (
    <div className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Sidebar Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Configuration</h2>
            <p className="text-xs text-gray-500">System Settings</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {items.map((item, index) => (
          <NavLink
            key={item.path}
            to={`/config/${item.path}`}
            className={({ isActive }) =>
              classNames(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
                {
                  "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md": isActive,
                  "text-gray-700 hover:bg-gray-100 hover:text-gray-900": !isActive,
                }
              )
            }>
            {({ isActive }) => (
              <>
                {/* Icon */}
                <div
                  className={classNames(
                    "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200",
                    {
                      "bg-white/20": isActive,
                      "bg-gray-200 group-hover:bg-gray-300": !isActive,
                    }
                  )}>
                  <span className={classNames("text-xs font-bold", {
                    "text-white": isActive,
                    "text-gray-600": !isActive,
                  })}>
                    {index + 1}
                  </span>
                </div>
                
                {/* Label */}
                <span className="flex-1">{item.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Configuration Module v1.0</span>
        </div>
      </div>
    </div>
  );
}

export default ConfigSidebar;
