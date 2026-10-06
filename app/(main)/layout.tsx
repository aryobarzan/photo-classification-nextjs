import { Suspense } from "react";
import { isAdmin } from "../lib/session";
import NavBar from "./NavBar";
import { LogOutButton } from "./LogOutButton";

export default async function MainLayout({ children }: LayoutProps<"/">) {
  const isRoleAdmin = await isAdmin();
  return (
    <main className="main">
      <NavBar isAdmin={isRoleAdmin} />
      <div className="content">{children}</div>
      <footer className="footer flex-col flex items-center">
        <hr className="divider w-full" />
        <p>
          <i>Photo Classification App</i>
        </p>
        <Suspense>
          <LogOutButton />
        </Suspense>
      </footer>
    </main>
  );
}
