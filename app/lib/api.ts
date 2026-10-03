import { redirect } from "next/navigation";
import { environment } from "./config";
import { getSession } from "./session";

// Helper function to add authentication header to a request.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getSession();
  if (!token) {
    return redirect("/login");
  }
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${environment.apiUrl}${path}`, { ...init, headers });
  if (res.status === 401) redirect("/login");
  return res;
}
