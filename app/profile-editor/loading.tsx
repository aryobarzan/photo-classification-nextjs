export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="profile-loading">Fetching profile...</label>
      <progress id="profile-loading" />
    </div>
  );
}
