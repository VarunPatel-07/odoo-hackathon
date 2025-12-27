import { useEffect, useState, useRef, useContext } from "react";
import { ReactSortable } from "react-sortablejs";
import { multipleApi } from "../../utils/api/api";
import { formateDate } from "../../utils/helper/helper";
import { FiAlertCircle, FiCalendar, FiPackage, FiUser, FiClock, FiMoreVertical, FiPlus } from "react-icons/fi";
import { NotificationContext } from "../../context/notification/NotificationContextApi";
import CreateRequestModal from "./CreateRequestModal";


/* ================= CONSTANTS ================= */
const STATUS_COLUMNS = {
  new: "New Requests",
  in_progress: "In Progress",
  repaired: "Completed",
  scrap: "Scrapped",
};


const COLUMN_STYLES = {
  new: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
  in_progress: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
  repaired: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
  scrap: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200",
};


const COLUMN_ICONS = {
  new: "📥",
  in_progress: "⚙️",
  repaired: "✅",
  scrap: "🗑️",
};


const PRIORITY_CONFIG = {
  1: { label: "Low", color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
  2: { label: "Medium", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  3: { label: "High", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  4: { label: "Critical", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
};


const REQUEST_TYPE_CONFIG = {
  preventive: {
    label: "Preventive",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "🔧",
  },
  corrective: {
    label: "Corrective",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "⚠️",
  },
  emergency: { label: "Emergency", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", icon: "🚨" },
};


/* ================= API FUNCTIONS ================= */

/**
 * UPDATE REQUEST STATUS - Your existing function (no changes)
 */
const updateRequestStatus = async (taskId, currentStatus, newStatus) => {
  try {
    const response = await multipleApi([
      {
        endPoint: `requests/${taskId}/update_status/`,
        protected: true,
        method: "PATCH",
        data: { current_status: currentStatus, new_status: newStatus },
      },
    ]);

    return response;
  } catch (error) {
    console.error(`❌ Failed to update task ${taskId}:`, error);
    throw error;
  }
};

/**
 * CREATE NEW REQUEST - NEW API FUNCTION
 * API Endpoint: POST /api/requests/raise-request/
 */
const createNewRequest = async (requestData) => {
  try {
    const response = await multipleApi([
      {
        endPoint: "requests/raise-request/",
        protected: true,
        method: "POST",
        data: requestData,
      },
    ]);

    return response[0];
  } catch (error) {
    console.error("❌ Failed to create request:", error);
    throw error;
  }
};


/* ================= COMPONENT ================= */
export default function KanbanBoard() {
  const { handelNotification } = useContext(NotificationContext); // ADDED: Notification context

  const [tasks, setTasks] = useState({
    new: [],
    in_progress: [],
    repaired: [],
    scrap: [],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // NEW STATE: Modal control
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(isDragging);
  const dragMeta = useRef({
    taskId: null,
    fromStatus: null,
  });


  /* ================= FETCH DATA - Your existing function (no changes) ================= */
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await multipleApi([
        {
          endPoint: "requests/",
          protected: true,
          method: "GET",
        },
      ]);

      const grouped = { new: [], in_progress: [], repaired: [], scrap: [] };

      response?.[0]?.results?.forEach((item) => {
        if (grouped[item.status]) grouped[item.status].push(item);
      });

      setTasks(grouped);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setIsLoading(false);
    }
  };


  /* ================= HANDLE DRAG & DROP - Your existing functions (no changes) ================= */
  const handleDragStart = (evt) => {
    setIsDragging(true);
    const taskId = evt.item.dataset.id;
    const fromColumn = evt.from.closest("[data-column-status]");
    const fromStatus = fromColumn ? fromColumn.dataset.columnStatus : null;

    dragMeta.current = {
      taskId,
      fromStatus,
    };
  };

  const handleDragEnd = async (evt) => {
    setIsDragging(false);

    const { taskId, fromStatus } = dragMeta.current;
    const toColumn = evt.to.closest("[data-column-status]");
    const toStatus = toColumn ? toColumn.dataset.columnStatus : null;

    if (!taskId || !fromStatus || !toStatus || fromStatus === toStatus) {
      dragMeta.current = { taskId: null, fromStatus: null };
      return;
    }

    try {
      await updateRequestStatus(taskId, fromStatus, toStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
      fetchRequests();
    } finally {
      dragMeta.current = { taskId: null, fromStatus: null };
    }
  };

  const handleSetList = (list, status) => {
    setTasks((prev) => ({ ...prev, [status]: list }));
  };

  /* ================= NEW: HANDLE FORM SUBMISSION ================= */
  /**
   * HANDLE FORM SUBMISSION FROM MODAL
   * Receives form data from modal component and creates request
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await createNewRequest(formData);
      console.log("Create Request Response:", response);

      if (response?.success) {
        handelNotification({
          success: true,
          message: "Maintenance request created successfully!",
        });
        setShowModal(false);
        fetchRequests(); // Refresh the board
      } else {
        handelNotification({
          success: false,
          message: response?.message || "Failed to create request. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating request:", error);
      handelNotification({
        success: false,
        message: "An error occurred while creating the request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Maintenance Board</h1>
              <p className="text-sm text-slate-500">Manage and track maintenance requests</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                <span className="font-medium">Total Tasks:</span>{" "}
                <span className="font-bold text-slate-900">
                  {Object.values(tasks).reduce((acc, arr) => acc + arr.length, 0)}
                </span>
              </div>

              {/* NEW: CREATE REQUEST BUTTON */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-200"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              {/* Animated Loader */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                {/* Middle ring */}
                <div
                  className="absolute inset-2 border-4 border-blue-400 rounded-full animate-spin"
                  style={{ borderTopColor: "transparent" }}></div>
                {/* Inner ring */}
                <div className="absolute inset-4 border-4 border-blue-600 rounded-full animate-pulse"></div>
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading Maintenance Board</h3>
              <p className="text-sm text-slate-500">Fetching your tasks...</p>

              {/* Loading dots animation */}
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
        /* Kanban Board */
        <div className="max-w-400 overflow-auto mx-auto px-6 py-6">
          <div className="flex items-stretch justify-start gap-5">
            {/* Rest of the board content */}
            {Object.entries(STATUS_COLUMNS).map(([status, title]) => (
              <div key={status} className="flex flex-col min-w-100" data-column-status={status}>
                {/* Column Header */}
                <div className={`rounded-t-xl border-2 ${COLUMN_STYLES[status]} p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{COLUMN_ICONS[status]}</span>
                      <h2 className="font-bold text-slate-800">{title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                        {tasks[status].length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column Body */}
                <div className="flex-1 bg-white/50 backdrop-blur-sm border-x-2 border-b-2 border-slate-200 rounded-b-xl px-4 py-6 relative max-h-[calc(100vh-220px)] overflow-auto">
                  <ReactSortable
                    tag="div"
                    list={tasks[status]}
                    setList={(list) => handleSetList(list, status)}
                    group={{
                      name: "kanban",
                      pull: status === "repaired" ? false : true,
                      put: true,
                    }}
                    animation={200}
                    delayOnTouchOnly={true}
                    delay={100}
                    forceFallback={false}
                    swapThreshold={0.5}
                    scroll
                    scrollSensitivity={100}
                    scrollSpeed={20}
                    className="min-h-125 space-y-5"
                    onStart={handleDragStart}
                    onEnd={handleDragEnd}>
                    {tasks[status].map((task) => {
                      const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[1];
                      const type = REQUEST_TYPE_CONFIG[task.request_type] || REQUEST_TYPE_CONFIG.preventive;

                      return (
                        <div
                          key={task.id}
                          data-id={task.id}
                          className="group bg-white rounded-lg border-2 border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-grab active:cursor-grabbing active:rotate-2 active:scale-105">
                          {/* Card Header */}
                          <div className="p-4 pb-3">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-slate-900 text-sm leading-tight pr-2 flex-1">
                                {task.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                {task.is_overdue && (
                                  <div className="bg-red-100 p-1 rounded">
                                    <FiAlertCircle className="text-red-600 w-3.5 h-3.5" />
                                  </div>
                                )}
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded">
                                  <FiMoreVertical className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span
                                className={`${type.bg} ${type.color} border ${type.border} text-xs font-medium px-2.5 py-1 rounded-md inline-flex items-center gap-1`}>
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                              </span>

                              <span
                                className={`${priority.bg} ${priority.color} border ${priority.border} text-xs font-medium px-2.5 py-1 rounded-md`}>
                                {priority.label}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <FiPackage className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium">{task.equipment_name}</span>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>
                                  {formateDate(task?.scheduled_date || task?.request_date || task?.created_at)}
                                </span>
                              </div>

                              {task.assigned_to_name && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <FiUser className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{task.assigned_to_name}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between rounded-b-lg">
                            <span className="text-xs text-slate-500 font-mono">#{task.id}</span>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <FiClock className="w-3 h-3" />
                              <span>Today</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </ReactSortable>

                  {/* Empty State */}
                  {tasks[status].length === 0 && (
                    <div className="flex items-center justify-center text-slate-400 w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-sm">No tasks</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW: CREATE REQUEST MODAL COMPONENT */}
      <CreateRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
