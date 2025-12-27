import { useContext, useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { multipleApi } from "../../../utils/api/api";
import { NotificationContext } from "../../../context/notification/NotificationContextApi";
import TableSkeletonLoader from "../../../components/loader/TableSkeletonLoader";

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
      renderContent: (value) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{value || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      key: "description",
      renderContent: (value) => (
        <div className="max-w-md">
          <p className="text-gray-600 text-sm line-clamp-2">{value || "-"}</p>
        </div>
      ),
    },
    {
      title: "Equipment Count",
      key: "equipment_count",
      renderContent: (value) => (
        <div className="flex items-center justify-center">
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-bold text-sm border border-blue-200 shadow-sm">
            {value ?? 0}
          </span>
        </div>
      ),
    },
    {
      title: "Responsible User",
      key: "responsible_user_name",
      renderContent: (value) => (
        <div className="flex items-center">
          {value ? (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mr-2 shadow-sm">
                <span className="text-white text-xs font-bold">
                  {value.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-700 font-medium">{value}</span>
            </>
          ) : (
            <span className="text-gray-400 italic">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      isSticky: true,
      renderContent: (row) => (
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
          onClick={() => console.log("Edit:", row)}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Edit</span>
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Category Configuration
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Organize and manage equipment categories • {equipment.length} Total Categories
            </p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={equipment}
          tableWrapperClass="max-h-[calc(100vh-280px)]"
          stickyHeaderClass="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100"
        />
      </div>
    </div>
  );
}

export default CategoryConfig;
