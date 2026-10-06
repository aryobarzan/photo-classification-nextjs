import { getUser } from "@/app/lib/session";
import { logout } from "@/app/lib/actions/auth";

// The auth check lives here instead of in the root layout, which would make every route
// (including login/register) dynamic. Note that (main)/layout.tsx already reads the cookie
// via isAdmin(), so routes in this group are dynamic regardless.
export async function LogOutButton() {
  // Use getUser instead of getSession, as the former is cache-wrapped (shared with isAdmin()).
  if (!(await getUser())) return null;
  return (
    // Server action via form action, not onClick: onClick needs a Client Component,
    // and a form also works before hydration / without JS.
    <form action={logout} className="mt-4">
      <button className="text-button">Log out</button>
    </form>
  );
}
