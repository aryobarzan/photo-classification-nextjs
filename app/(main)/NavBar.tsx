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
        <span className="material-symbols-outlined">home</span>
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
        <span className="material-symbols-outlined">person_edit</span>
        Edit Profile
      </Link>
      {isAdmin && (
        <Link
          href="/dashboard"
          className={
            pathname.startsWith("/dashboard")
              ? `${styles.navLink} ${styles.navLinkActive}`
              : `${styles.navLink}`
          }
        >
          <span className="material-symbols-outlined">view_list</span>
          Dashboard
        </Link>
      )}
    </div>
  );
}
