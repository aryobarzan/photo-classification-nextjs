import "server-only";

import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { cache } from "react";

export type SessionUser = {
  username: string;
  role: string;
};

export async function getSession(): Promise<string | undefined> {
  return (await cookies()).get("token")?.value;
}

// The signature is already verified by proxy.ts before any request reaches
// server code, so decoding is enough here. For UI decisions only; the API
// must still enforce roles itself.
export const getUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSession();
  if (!token) return null;
  try {
    const { sub, role } = decodeJwt(token);
    if (typeof sub !== "string" || typeof role !== "string") return null;
    return { username: sub, role };
  } catch {
    return null;
  }
});

export async function isAdmin(): Promise<boolean> {
  return (await getUser())?.role.toLowerCase() === "admin";
}
