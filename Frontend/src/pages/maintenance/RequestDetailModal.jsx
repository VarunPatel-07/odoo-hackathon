import { FiX, FiCalendar, FiPackage, FiUser, FiClock, FiAlertCircle, FiFileText } from "react-icons/fi";
import { formateDate } from "../../utils/helper/helper";

/**
 * REQUEST DETAIL MODAL COMPONENT
 * 
 * Shows full details of a maintenance request in a large modal
 * Opens when user clicks on a Kanban card
 * 
 * Props:
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {object} task - Task/Request object with all details
 */

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
  emergency: {
    label: "Emergency",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: "🚨",
  },
};

const STATUS_CONFIG = {
  new: { label: "New Request", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: "📥" },
  in_progress: { label: "In Progress", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: "⚙️" },
  repaired: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "✅" },
  scrap: { label: "Scrapped", color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", icon: "🗑️" },
};

export default function RequestDetailModal({ isOpen, onClose, task }) {
  // Don't render if not open or no task
  if (!isOpen || !task) return null;

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[1];
  const type = REQUEST_TYPE_CONFIG[task.request_type] || REQUEST_TYPE_CONFIG.preventive;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.new;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 font-mono">#{task.id}</span>
                {task.is_overdue && (
                  <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    <FiAlertCircle className="w-3 h-3" />
                    Overdue
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">{task.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <FiX className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Status and Type Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span
              className={`${status.bg} ${status.color} border ${status.border} text-sm font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5`}
            >
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </span>

            <span
              className={`${type.bg} ${type.color} border ${type.border} text-sm font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </span>

            <span
              className={`${priority.bg} ${priority.color} border ${priority.border} text-sm font-medium px-3 py-1.5 rounded-lg`}
            >
              Priority: {priority.label}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Description Section */}
          {task.description && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <FiFileText className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Description</h3>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiPackage className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Equipment</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{task.equipment_name || "Not assigned"}</p>
              {task.equipment_id && (
                <p className="text-xs text-slate-500 mt-1">ID: {task.equipment_id}</p>
              )}
            </div>

            {/* Assigned To */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Assigned To</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{task.assigned_to_name || "Unassigned"}</p>
              {task.assigned_to_email && (
                <p className="text-xs text-slate-500 mt-1">{task.assigned_to_email}</p>
              )}
            </div>

            {/* Scheduled Date */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Scheduled Date</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {formateDate(task?.scheduled_date || task?.request_date || task?.created_at)}
              </p>
            </div>

            {/* Created Date */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-500 uppercase">Created</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {formateDate(task?.created_at)}
              </p>
              {task.created_by_name && (
                <p className="text-xs text-slate-500 mt-1">by {task.created_by_name}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {(task.notes || task.completion_notes || task.estimated_hours || task.actual_hours) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Additional Information</h3>
              <div className="space-y-2">
                {task.estimated_hours && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Estimated Hours:</span>
                    <span className="font-medium text-blue-900">{task.estimated_hours} hrs</span>
                  </div>
                )}
                {task.actual_hours && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Actual Hours:</span>
                    <span className="font-medium text-blue-900">{task.actual_hours} hrs</span>
                  </div>
                )}
                {task.notes && (
                  <div className="text-sm">
                    <span className="text-blue-700 block mb-1">Notes:</span>
                    <p className="text-blue-900">{task.notes}</p>
                  </div>
                )}
                {task.completion_notes && (
                  <div className="text-sm">
                    <span className="text-blue-700 block mb-1">Completion Notes:</span>
                    <p className="text-blue-900">{task.completion_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Last updated: {formateDate(task?.updated_at || task?.created_at)}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
