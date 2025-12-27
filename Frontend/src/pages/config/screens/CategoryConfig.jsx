import { useContext, useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { multipleApi } from "../../../utils/api/api";
import { NotificationContext } from "../../../context/notification/NotificationContextApi";

function CategoryConfig() {
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
        endPoint: "categories/",
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
      title: "Category Name",
      key: "name",
      renderContent: (value) => value || "-",
    },
    {
      title: "Description",
      key: "description",
      renderContent: (value) => value || "-",
    },
    {
      title: "Equipment Count",
      key: "equipment_count",
      renderContent: (value) => value ?? 0,
    },
    {
      title: "Responsible User",
      key: "responsible_user_name",
      renderContent: (value) => value || "—",
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

export default CategoryConfig;
