export default function Loading({ message = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <div
        role="status"
        className="card"
        style={{
          padding: "var(--space-10)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          className="loading-spinner"
          style={{ margin: "0 auto var(--space-4)" }}
        />
        <p style={{ margin: 0, color: "var(--color-text-muted)" }}>{message}</p>
      </div>
    </div>
  );
}
