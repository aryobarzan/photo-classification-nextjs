export default function Loading() {
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="indeterminate-loading-spinner"></div>
      <p>Fetching user profile...</p>
    </div>
  );
}
