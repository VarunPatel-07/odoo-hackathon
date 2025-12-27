/**
 * Configuration Page
 * This page will handle system settings and configurations
 */
const Config = () => {
  return (
    <div style={{ padding: "32px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>
          Configuration
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Manage system settings and preferences
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
          backgroundColor: "#dbeafe",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          fontSize: "32px",
        }}>
          ⚙️
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
          Configuration Page
        </h2>
        <p style={{ color: "#6b7280", maxWidth: "600px", margin: "0 auto 24px auto" }}>
          This page will contain system settings, user preferences, and administrative controls.
          You can add configuration forms and settings panels here.
        </p>

        {/* Sample Settings Categories */}
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
              👤 User Settings
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Profile and account settings
            </p>
          </div>
          <div style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
              🔔 Notifications
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Notification preferences
            </p>
          </div>
          <div style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
              🔒 Security
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Security and privacy settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
