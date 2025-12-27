import { CONFIG_SIDEBAR_ITEMS } from "../../constant/configModule";
import ConfigSidebar from "./ConfigSidebar";
import { Outlet } from "react-router-dom";

function ConfigModule() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <ConfigSidebar items={CONFIG_SIDEBAR_ITEMS} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Configuration Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your system configurations and settings</p>
            </div>
          </div>
        </div>

        {/* Content with padding and scroll */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigModule;
