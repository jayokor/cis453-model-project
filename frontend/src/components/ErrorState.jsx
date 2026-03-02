export default function ErrorState({ error }) {
  const msg =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Error</div>
      <div>{msg}</div>
    </div>
  );
}