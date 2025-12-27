import { useState, useEffect } from "react";
import { multipleApi } from "../../utils/api/api";
import { FiInbox, FiTool, FiCheckCircle, FiTrash2, FiLayers, FiTrendingUp, FiActivity } from "react-icons/fi";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    new: 0,
    in_progress: 0,
    repaired: 0,
    scrap: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const countEndpoints = [
          {
            endPoint: "requests/status_counts/",
            protected: true,
            method: "GET",
          },
        ];

        const countResponse = await multipleApi(countEndpoints);
        const res = countResponse[0];

        if (res?.success) {
          const statusCounts = res?.data;
          setCounts({
            new: statusCounts.new || 0,
            in_progress: statusCounts.in_progress || 0,
            repaired: statusCounts.repaired || 0,
            scrap: statusCounts.scrap || 0,
            total: statusCounts.total || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "New Requests",
      value: counts.new,
      icon: FiInbox,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      description: "Pending review",
      emoji: "📥",
    },
    {
      title: "In Progress",
      value: counts.in_progress,
      icon: FiTool,
      gradient: "from-amber-500 to-amber-600",
      lightBg: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      description: "Active tasks",
      emoji: "⚙️",
    },
    {
      title: "Completed",
      value: counts.repaired,
      icon: FiCheckCircle,
      gradient: "from-emerald-500 to-emerald-600",
      lightBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      description: "Successfully repaired",
      emoji: "✅",
    },
    {
      title: "Scrapped",
      value: counts.scrap,
      icon: FiTrash2,
      gradient: "from-slate-500 to-slate-600",
      lightBg: "bg-slate-50",
      iconColor: "text-slate-600",
      borderColor: "border-slate-200",
      description: "Beyond repair",
      emoji: "🗑️",
    },
    {
      title: "Total Tasks",
      value: counts.total,
      icon: FiLayers,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      description: "All maintenance requests",
      emoji: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-400 mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
              <p className="text-sm text-slate-500">Overview of your maintenance management system</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <FiActivity className="w-4 h-4" />
                <span className="text-sm font-medium">View Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              {/* Animated Loader */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                <div
                  className="absolute inset-2 border-4 border-blue-400 rounded-full animate-spin"
                  style={{ borderTopColor: "transparent" }}></div>
                <div className="absolute inset-4 border-4 border-blue-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading Dashboard</h3>
              <p className="text-sm text-slate-500">Fetching your data...</p>

              <div className="flex justify-center gap-2 mt-4">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dashboard Content */
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const completionRate = counts.total > 0 ? ((card.value / counts.total) * 100).toFixed(0) : 0;

              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
                  {/* Gradient Top Border */}
                  <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{card.emoji}</span>
                          <h3 className="font-semibold text-slate-700 text-sm">{card.title}</h3>
                        </div>
                        <p className="text-xs text-slate-500">{card.description}</p>
                      </div>
                      <div
                        className={`${card.lightBg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                    </div>

                    {/* Value */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-slate-900">{card.value}</p>
                        {card.title !== "Total Tasks" && counts.total > 0 && (
                          <span className={`text-sm font-medium ${card.iconColor}`}>{completionRate}%</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {card.title !== "Total Tasks" && (
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-500 ease-out`}
                          style={{ width: `${completionRate}%` }}></div>
                      </div>
                    )}

                    {card.title === "Total Tasks" && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                        <FiTrendingUp className="w-3 h-3" />
                        <span>All requests combined</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiActivity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Quick Stats</h2>
                  <p className="text-sm text-slate-500">Performance overview</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {counts.total > 0 ? ((counts.repaired / counts.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Active Tasks</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{counts.in_progress}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Pending Review</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{counts.new}</span>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FiLayers className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Status Distribution</h2>
                  <p className="text-sm text-slate-500">Task breakdown</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "New", value: counts.new, color: "blue", total: counts.total },
                  { label: "In Progress", value: counts.in_progress, color: "amber", total: counts.total },
                  { label: "Completed", value: counts.repaired, color: "emerald", total: counts.total },
                  { label: "Scrapped", value: counts.scrap, color: "slate", total: counts.total },
                ].map((item, index) => {
                  const percentage = item.total > 0 ? ((item.value / item.total) * 100).toFixed(0) : 0;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900">
                          {item.value} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full bg-${item.color}-500 transition-all duration-500 ease-out`}
                          style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
