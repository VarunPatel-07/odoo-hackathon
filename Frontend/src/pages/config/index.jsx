import { CONFIG_SIDEBAR_ITEMS } from "../../constant/configModule";
import ConfigSidebar from "./ConfigSidebar";
import { Outlet } from "react-router-dom";

function ConfigModule() {
  return (
    <div className="w-full h-full bg-white flex">
      {/* Sidebar */}
      <ConfigSidebar items={CONFIG_SIDEBAR_ITEMS} />

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ConfigModule;
