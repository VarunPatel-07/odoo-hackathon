/**
 * Maintenance Request Page
 * This page will handle all maintenance requests and forms
 */
const MaintenanceRequest = () => {
  return (
    <div style={{ padding: "32px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>
          Maintenance Request
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Submit and manage maintenance requests
        </p>
      </div>

      {/* Content Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "48px",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        textAlign: "center",
      }}>
        <div style={{
          width: "64px",
          height: "64px",
          backgroundColor: "#fef3c7",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          fontSize: "32px",
        }}>
          🔧
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
          Maintenance Request Page
        </h2>
        <p style={{ color: "#6b7280", maxWidth: "600px", margin: "0 auto 24px auto" }}>
          This page will contain forms and lists for maintenance requests. 
          You can add request forms, status tracking, and history here.
        </p>

        {/* Sample Features List */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "32px",
          textAlign: "left",
        }}>
          <div style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
              📝 Submit Request
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Create new maintenance requests
            </p>
          </div>
          <div style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
              📊 Track Status
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Monitor request progress
            </p>
          </div>
          <div style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
              📋 View History
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Access past requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequest;
