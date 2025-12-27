import { useContext, useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { multipleApi } from "../../../utils/api/api";
import { NotificationContext } from "../../../context/notification/NotificationContextApi";
import TableSkeletonLoader from "../../../components/loader/TableSkeletonLoader";

function EquipmentConfig() {
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
        endPoint: "equipment/",
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
      title: "Equipment Name",
      key: "name",
      renderContent: (value) => value || "-",
    },
    {
      title: "Category",
      key: "category",
      renderContent: (value) => value || "-",
    },
    {
      title: "Status",
      key: "is_active",
      renderContent: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
          {value ? "ACTIVE" : "DEACTIVATE"}
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
    return (
      <div className="w-full">
        <TableSkeletonLoader tableHeaderCount={5} tableValueCount={13} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Table columns={columns} data={equipment} tableWrapperClass="max-h-[70vh]" stickyHeaderClass="sticky top-0" />
    </div>
  );
}

export default EquipmentConfig;
