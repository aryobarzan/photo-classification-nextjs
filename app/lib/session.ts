import "server-only";

import { cookies } from "next/headers";

export async function getSession(): Promise<string | undefined> {
  return (await cookies()).get("token")?.value;
}
