export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="card"
      style={{
        borderColor: "var(--color-danger)",
        color: "var(--color-danger)",
      }}
    >
      {message}
    </div>
  );
}
