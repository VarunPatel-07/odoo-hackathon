import { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";

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
};

const PRIORITY_CONFIG = {
  1: { label: "Low", color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
  2: { label: "Medium", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  3: { label: "High", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  4: { label: "Critical", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
};

export default function CreateRequestModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  // ================= STATE =================
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    request_type: "corrective",
    priority: 2,
    equipment: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    equipment: "",
  });

  const [showError, setShowError] = useState(false);

  // ================= HANDLERS =================

  /**
   * Handle input change for all form fields
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  /**
   * Validate all required fields
   */
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Request name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    if (!formData.equipment || formData.equipment === "") {
      errors.equipment = "Equipment ID is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      request_type: "corrective",
      priority: 2,
      equipment: "",
    });
    setFormErrors({});
    setShowError(false);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowError(true);
      return;
    }

    setShowError(false);

    // Pass form data to parent component
    onSubmit(formData);
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  // ================= RENDER =================
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Request</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50">
            <FiX className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-4">
              {/* Request Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Request Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Fix Machine A cooling system"
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 text-sm border text-black ${
                    showError && formErrors.name ? "border-red-300" : "border-slate-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {showError && formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              {/* Equipment ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Equipment ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.equipment}
                  onChange={(e) => handleInputChange("equipment", parseInt(e.target.value) || "")}
                  placeholder="Enter equipment ID"
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 text-sm border text-black ${
                    showError && formErrors.equipment ? "border-red-300" : "border-slate-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {showError && formErrors.equipment && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.equipment}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={5}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 text-sm border text-black ${
                    showError && formErrors.description ? "border-red-300" : "border-slate-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {showError && formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-4">
              {/* Request Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Request Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(REQUEST_TYPE_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleInputChange("request_type", key)}
                      disabled={isSubmitting}
                      className={`p-3 border-2 rounded-lg transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        formData.request_type === key
                          ? `${config.border} ${config.bg} ${config.color} shadow-sm`
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}>
                      <div className="text-xl mb-1">{config.icon}</div>
                      <div className="text-xs font-medium">{config.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleInputChange("priority", parseInt(key))}
                      disabled={isSubmitting}
                      className={`p-2.5 border-2 rounded-lg transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        formData.priority === parseInt(key)
                          ? `${config.border} ${config.bg} ${config.color} shadow-sm`
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}>
                      <div className="text-xs font-medium">{config.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <div className="text-blue-600 mt-0.5">ℹ️</div>
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Quick Tips</p>
                    <ul className="text-xs text-blue-700 space-y-0.5">
                      <li>• Be specific in the description</li>
                      <li>• Choose appropriate priority</li>
                      <li>• Verify equipment ID is correct</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Create Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
