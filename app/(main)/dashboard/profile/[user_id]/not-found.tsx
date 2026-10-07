import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-1">
      <p>User not found.</p>
      <div className="flex flex-row justify-end">
        <Link href="/dashboard" className="filled-button mt-2">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
