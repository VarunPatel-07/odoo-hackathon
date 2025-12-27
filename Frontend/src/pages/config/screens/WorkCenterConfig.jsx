import { useContext, useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { multipleApi } from "../../../utils/api/api";
import { NotificationContext } from "../../../context/notification/NotificationContextApi";

function WorkCenterConfig() {
  const { handelNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);

    const endpoints = [
      {
        endPoint: "workcenters/",
        protected: true,
        method: "GET",
      },
    ];

    try {
      const response = await multipleApi(endpoints);
      const res = response[0];

      setEquipment(res?.results || []);
    } catch (error) {
      console.log(error);
      handelNotification({
        success: false,
        message: "Failed to fetch equipment",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Workcenter Name",
      key: "name",
      renderContent: (value) => value || "-",
    },
    {
      title: "Code",
      key: "code",
      renderContent: (value) => value || "-",
    },
    {
      title: "Company",
      key: "company_name",
      renderContent: (value) => value || "-",
    },
    {
      title: "Cost / Hour",
      key: "costs_hour",
      renderContent: (value) => `₹ ${value || "0.00"}`,
    },
    {
      title: "OEE Target",
      key: "oee_target",
      renderContent: (value) => `${value || 0}%`,
    },
    {
      title: "Efficiency",
      key: "time_efficiency",
      renderContent: (value) => `${value || 0}%`,
    },
    {
      title: "Status",
      key: "is_active",
      renderContent: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
          {value ? "ACTIVE" : "INACTIVE"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      isSticky: true,
      renderContent: (row) => (
        <button className="text-blue-600 hover:underline text-sm" onClick={() => console.log("Edit:", row)}>
          Edit
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">{/* <Loader /> */}</div>;
  }

  return (
    <div className="p-4">
      <Table columns={columns} data={equipment} tableWrapperClass="max-h-[70vh]" stickyHeaderClass="sticky top-0" />
    </div>
  );
}

export default WorkCenterConfig;
