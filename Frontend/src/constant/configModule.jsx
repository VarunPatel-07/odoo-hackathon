import CategoryConfig from "../pages/config/screens/CategoryConfig";
import EquipmentConfig from "../pages/config/screens/EquipmentConfig";
import WorkCenterConfig from "../pages/config/screens/WorkcenterConfig";

export const CONFIG_SIDEBAR_ITEMS = [
  {
    path: "equipment",
    label: "Equipment",
    component: <EquipmentConfig />,
  },
  {
    path: "categories",
    label: "Categories",
    component: <CategoryConfig />,
  },
  {
    path: "workcenters",
    label: "WorkCenters",
    component: <WorkCenterConfig />,
  },
];
