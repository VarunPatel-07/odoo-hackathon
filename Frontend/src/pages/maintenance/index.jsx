import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // if using react-router
import { FiPlus } from "react-icons/fi";
import { multipleApi } from "../../utils/api/api";
import { NotificationContext } from "../../context/notification/NotificationContextApi";
import { useContext } from "react";
import KanbanBoard from "./KanbanView";
import CalendarViewBoard from "./calenderView";
import CreateRequestModal from "./CreateRequestModal";

function Maintenance() {
  const { handelNotification } = useContext(NotificationContext);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState("kanban"); // default view
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Set initial view from URL query parameter
  useEffect(() => {
    const urlView = searchParams.get("view");
    if (urlView === "calendar" || urlView === "kanban") {
      setView(urlView);
    } else {
      setView("kanban"); // default
    }
  }, [searchParams]);

  // Handle view toggle
  const handleViewChange = (newView) => {
    setView(newView);
    navigate(`?view=${newView}`); // update URL
  };

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
  const fetchRequests = async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

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
        fetchRequests();
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
    <>
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Maintenance Board</h1>
              <p className="text-sm text-slate-500">Manage and track maintenance requests</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewChange("kanban")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    view === "kanban" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                  Kanban View
                </button>
                <button
                  onClick={() => handleViewChange("calendar")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    view === "calendar" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                  Calendar View
                </button>
              </div>

              {/* Create Request Button */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-200">
                <FiPlus className="w-4 h-4" />
                <span>Create Request</span>
              </button>
            </div>
          </div>
        </div>

        {/* Display content based on view */}

        <div className="w-full relative">
          {!loading && (
            <div className="w-full h-full absolute top-0 left-0 mx-auto px-6 py-6 z-50 bg-white border-t- border-t-slate-200">
              <div className="flex items-center justify-center w-full h-full">
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
          )}
          <div className="max-w-400 mx-auto px-6 py-6">
            {view === "kanban" ? (
              <KanbanBoard setLoading={setLoading} />
            ) : (
              <CalendarViewBoard setShowModal={setShowModal} setLoading={setLoading} />
            )}
          </div>
        </div>
      </div>
      <CreateRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default Maintenance;
