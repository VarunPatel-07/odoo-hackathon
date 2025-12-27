import { NavLink } from "react-router-dom";
import { classNames } from "../../utils/helper/helper";

function ConfigSidebar({ items }) {
  return (
    <div className="w-64 border-r border-black/10 bg-gray-50">
      <div className="p-4 font-semibold text-black/80">Configuration</div>

      <div className="flex flex-col">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={`/config/${item.path}`}
            className={({ isActive }) =>
              classNames("px-4 py-2 text-left text-sm hover:bg-gray-100 text-black", {
                "bg-white font-medium text-black": isActive,
              })
            }>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default ConfigSidebar;
