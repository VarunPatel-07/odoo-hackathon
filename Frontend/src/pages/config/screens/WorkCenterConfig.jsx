import { useContext, useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { multipleApi } from "../../../utils/api/api";
import { NotificationContext } from "../../../context/notification/NotificationContextApi";
import TableSkeletonLoader from "../../../components/loader/TableSkeletonLoader";

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
      renderContent: (value) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
      title: "Code",
      key: "code",
      renderContent: (value) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md font-mono text-sm">
          {value || "-"}
        </span>
      ),
    },
    {
      title: "Company",
      key: "company_name",
      renderContent: (value) => (
        <span className="text-gray-700 font-medium">{value || "-"}</span>
      ),
    },
    {
      title: "Cost / Hour",
      key: "costs_hour",
      renderContent: (value) => (
        <div className="flex items-center">
          <span className="text-green-600 font-bold">₹ {value || "0.00"}</span>
        </div>
      ),
    },
    {
      title: "OEE Target",
      key: "oee_target",
      renderContent: (value) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value || 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">{value || 0}%</span>
        </div>
      ),
    },
    {
      title: "Efficiency",
      key: "time_efficiency",
      renderContent: (value) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value || 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">{value || 0}%</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "is_active",
      renderContent: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            value
              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300"
              : "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300"
          }`}>
          <span
            className={`w-2 h-2 rounded-full mr-2 ${value ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          {value ? "ACTIVE" : "INACTIVE"}
        </span>
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
        <TableSkeletonLoader tableHeaderCount={8} tableValueCount={13} />
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
                className="w-6 h-6 mr-3 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Workcenter Configuration
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all workcenters • {equipment.length} Total Entries
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
            <span>Add Workcenter</span>
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

export default WorkCenterConfig;
