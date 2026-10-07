import { Suspense } from "react";
import { isAdmin } from "../lib/session";
import NavBar from "./NavBar";
import { LogOutButton } from "./LogOutButton";

export default async function MainLayout({ children }: LayoutProps<"/">) {
  const isRoleAdmin = await isAdmin();
  return (
    // The root layout already provides the centered, width-capped container
    // (.main/.content), so this only stacks the nav, page and footer.
    <div className="flex flex-col w-full">
      <NavBar isAdmin={isRoleAdmin} />
      <main>{children}</main>
      <footer className="footer flex-col flex items-center mt-2">
        <hr className="divider w-full" />
        <p>
          <i>Photo Classification App (Next.js)</i>
        </p>
        <Suspense>
          <LogOutButton />
        </Suspense>
      </footer>
    </div>
  );
}
