import { unstable_rethrow } from "next/navigation";
import { fetchProfilePictureStatus } from "@/app/lib/actions/user";

// Polled by the client (see useProfilePictureStatus) while a picture is being classified.
export async function GET() {
  try {
    return Response.json(await fetchProfilePictureStatus());
  } catch (err) {
    // Let Next.js internals through, e.g. the redirect to /login thrown by apiFetch on 401.
    unstable_rethrow(err);
    return Response.json(
      { error: "Failed to fetch profile picture status." },
      { status: 502 },
    );
  }
}
