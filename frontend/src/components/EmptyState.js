export default function EmptyState({
  title = "Nothing here yet",
  message = "",
  action = null,
}) {
  return (
    <div
      className="card"
      style={{ textAlign: "center", padding: "var(--space-12) var(--space-6)" }}
    >
      <h2>{title}</h2>
      {message && <p className="text-muted">{message}</p>}
      {action && <div style={{ marginTop: "var(--space-4)" }}>{action}</div>}
    </div>
  );
}
