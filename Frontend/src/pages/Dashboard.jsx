const Dashboard = () => {
  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Welcome to your maintenance management system
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "32px",
      }}>
        {/* Card 1 */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        }}>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Total Users</p>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#111827", margin: "8px 0" }}>
            248
          </p>
          <p style={{ fontSize: "14px", color: "#10b981" }}>↑ 12% from last month</p>
        </div>

        {/* Card 2 */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        }}>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Active Machines</p>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#111827", margin: "8px 0" }}>
            156
          </p>
          <p style={{ fontSize: "14px", color: "#10b981" }}>↑ 8% from last month</p>
        </div>

        {/* Card 3 */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        }}>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Pending Tasks</p>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#111827", margin: "8px 0" }}>
            32
          </p>
          <p style={{ fontSize: "14px", color: "#ef4444" }}>↓ 5% from last month</p>
        </div>
      </div>

      {/* Welcome Card */}
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
        }}>
          <span style={{ fontSize: "32px" }}>✓</span>
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
          Dashboard is Ready!
        </h2>
        <p style={{ color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
          Your preventive maintenance dashboard is set up and ready to use.
          You can customize this page with your own components, charts, and data.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
