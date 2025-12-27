import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { multipleApi } from "../../utils/api/api";
import { parseISO, format, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { FiCalendar, FiPlus, FiFilter, FiRefreshCw } from "react-icons/fi";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarViewBoard({ setShowModal, setLoading }) {
  const [events, setEvents] = useState([]);

  const [view, setView] = useState("month");

  const fetchPreventiveRequests = async () => {
    setLoading(true);
    try {
      const response = await multipleApi([
        {
          endPoint: "requests/",
          protected: true,
          method: "GET",
        },
      ]);

      const preventiveEvents = response?.[0]?.results
        ?.filter((req) => req.request_type === "preventive")
        .map((req) => ({
          id: req.id,
          title: req.name,
          start: new Date(req.scheduled_date || req.request_date),
          end: new Date(req.scheduled_date || req.request_date),
          allDay: true,
          resource: req,
        }));

      setEvents(preventiveEvents || []);
    } catch (error) {
      console.error("Failed to fetch preventive requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreventiveRequests();
  }, []);

  const handleSelectSlot = () => {
    setShowModal(true); // open modal
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#3b82f6",
        borderRadius: "6px",
        border: "none",
        color: "white",
        fontSize: "13px",
        fontWeight: "500",
        padding: "4px 8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    };
  };

  return (
    <div
      className="w-full max-h-[calc(100vh-0px)] overflow-auto"
      style={{ background: "linear-gradient(to bottom right, #f8fafc, #dbeafe, #f8fafc)" }}>
      {/* Main Content */}
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              padding: "16px",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ backgroundColor: "#dbeafe", padding: "12px", borderRadius: "8px" }}>
                <FiCalendar style={{ width: "20px", height: "20px", color: "#2563eb" }} />
              </div>
              <div>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>{events.length}</p>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Total Events</p>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              padding: "16px",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ backgroundColor: "#d1fae5", padding: "12px", borderRadius: "8px" }}>
                <FiCalendar style={{ width: "20px", height: "20px", color: "#059669" }} />
              </div>
              <div>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                  {events.filter((e) => new Date(e.start).getMonth() === new Date().getMonth()).length}
                </p>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>This Month</p>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              padding: "16px",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ backgroundColor: "#fef3c7", padding: "12px", borderRadius: "8px" }}>
                <FiCalendar style={{ width: "20px", height: "20px", color: "#d97706" }} />
              </div>
              <div>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                  {events.filter((e) => new Date(e.start) > new Date()).length}
                </p>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Upcoming</p>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              padding: "16px",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ backgroundColor: "#e9d5ff", padding: "12px", borderRadius: "8px" }}>
                <FiFilter style={{ width: "20px", height: "20px", color: "#7c3aed" }} />
              </div>
              <div>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>All</p>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Filter Type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            overflow: "hidden",
          }}>
          {/* Calendar Header */}
          <div
            style={{
              background: "linear-gradient(to right, #eff6ff, #dbeafe)",
              borderBottom: "2px solid #bfdbfe",
              padding: "16px",
            }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "8px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                  }}>
                  <FiCalendar style={{ width: "20px", height: "20px", color: "#2563eb" }} />
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                    Preventive Maintenance Schedule
                  </h2>
                  <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>
                    Click on any date to add a new maintenance task
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setView("month")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ...(view === "month"
                      ? { backgroundColor: "#2563eb", color: "white", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }
                      : { backgroundColor: "white", color: "#475569" }),
                  }}
                  onMouseEnter={(e) => {
                    if (view !== "month") e.currentTarget.style.backgroundColor = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (view !== "month") e.currentTarget.style.backgroundColor = "white";
                  }}>
                  Month
                </button>
                <button
                  onClick={() => setView("week")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ...(view === "week"
                      ? { backgroundColor: "#2563eb", color: "white", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }
                      : { backgroundColor: "white", color: "#475569" }),
                  }}
                  onMouseEnter={(e) => {
                    if (view !== "week") e.currentTarget.style.backgroundColor = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (view !== "week") e.currentTarget.style.backgroundColor = "white";
                  }}>
                  Week
                </button>
                <button
                  onClick={() => setView("day")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ...(view === "day"
                      ? { backgroundColor: "#2563eb", color: "white", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }
                      : { backgroundColor: "white", color: "#475569" }),
                  }}
                  onMouseEnter={(e) => {
                    if (view !== "day") e.currentTarget.style.backgroundColor = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (view !== "day") e.currentTarget.style.backgroundColor = "white";
                  }}>
                  Day
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Body */}
          <div style={{ padding: "24px" }}>
            <style>
              {`
                .rbc-calendar {
                  font-family: inherit;
                }
                
                .rbc-header {
                  padding: 12px 8px;
                  font-weight: 600;
                  font-size: 14px;
                  color: #475569;
                  background: #f8fafc;
                  border-bottom: 2px solid #e2e8f0 !important;
                }
                
                .rbc-today {
                  background-color: #eff6ff !important;
                }
                
                .rbc-date-cell {
                  padding: 8px;
                  font-weight: 500;
                  color: #334155;
                }
                
                .rbc-off-range-bg {
                  background-color: #f8fafc;
                }
                
                .rbc-month-view {
                  border: 2px solid #e2e8f0;
                  border-radius: 12px;
                  overflow: hidden;
                }
                
                .rbc-day-bg:hover {
                  background-color: #f1f5f9;
                  cursor: pointer;
                }
                
                .rbc-event {
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 13px;
                  font-weight: 500;
                }
                
                .rbc-event:hover {
                  transform: translateY(-1px);
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
                }
                
                .rbc-toolbar {
                  padding: 16px;
                  background: #f8fafc;
                  border-radius: 12px;
                  margin-bottom: 20px;
                  border: 2px solid #e2e8f0;
                }
                
                .rbc-toolbar button {
                  padding: 8px 16px;
                  border-radius: 8px;
                  border: 2px solid #e2e8f0;
                  background: white;
                  color: #475569;
                  font-weight: 500;
                  font-size: 14px;
                  transition: all 0.2s;
                }
                
                .rbc-toolbar button:hover {
                  background: #f1f5f9;
                  border-color: #cbd5e1;
                }
                
                .rbc-toolbar button.rbc-active {
                  background: #3b82f6;
                  color: white;
                  border-color: #3b82f6;
                  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                
                .rbc-toolbar-label {
                  font-size: 18px;
                  font-weight: 700;
                  color: #0f172a;
                }
                
                .rbc-month-row {
                  border-top: 1px solid #e2e8f0;
                }
                
                .rbc-day-slot .rbc-time-slot {
                  border-top: 1px solid #f1f5f9;
                }
                
                .rbc-timeslot-group {
                  border-left: 2px solid #e2e8f0;
                }
                
                .rbc-current-time-indicator {
                  background-color: #3b82f6;
                  height: 2px;
                }
              `}
            </style>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              selectable
              onSelectSlot={handleSelectSlot}
              popup
              view={view}
              onView={setView}
              eventPropGetter={eventStyleGetter}
            />
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid #e2e8f0",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            padding: "24px",
          }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#334155", marginBottom: "16px" }}>
            Calendar Legend
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", backgroundColor: "#2563eb", borderRadius: "4px" }}></div>
              <span style={{ fontSize: "14px", color: "#475569" }}>Preventive Maintenance</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#eff6ff",
                  borderRadius: "4px",
                  border: "2px solid #2563eb",
                }}></div>
              <span style={{ fontSize: "14px", color: "#475569" }}>Today</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "4px",
                  border: "1px solid #cbd5e1",
                }}></div>
              <span style={{ fontSize: "14px", color: "#475569" }}>Click to Add Task</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
