"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "@/app/(main)/NavBar.module.css";

export default function NavBar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <div className={`${styles.navBar} ${styles.navLinks}`}>
      <Link
        href="/"
        className={
          pathname === "/"
            ? `${styles.navLink} ${styles.navLinkActive}`
            : `${styles.navLink}`
        }
      >
        Home
      </Link>
      <Link
        href="/profile-editor"
        className={
          pathname.startsWith("/profile-editor")
            ? `${styles.navLink} ${styles.navLinkActive}`
            : `${styles.navLink}`
        }
      >
        Edit Profile
      </Link>
      {isAdmin ? (
        <Link
          href="/admin-dashboard"
          className={
            pathname.startsWith("/admin-dashboard")
              ? `${styles.navLink} ${styles.navLinkActive}`
              : `${styles.navLink}`
          }
        >
          Admin Dashboard
        </Link>
      ) : (
        <span></span>
      )}
    </div>
  );
}
