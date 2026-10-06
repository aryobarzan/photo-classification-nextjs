// environment.apiUrl would be undefined in a Client Component.
// We mark it as Server Actions instead - should the client import it, it would be a
// reference that simply makes a network call to the server.
"use server";

import { cookies } from "next/headers";

import { z } from "zod";
import { environment } from "../config";
import { redirect } from "next/navigation";

// Expected response format for login and registration endpoints
const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    role: z.string(),
  }),
});
type LoginResponse = z.infer<typeof LoginResponseSchema>;
type User = LoginResponse["user"];

const CredentialsSchema = z.object({
  username: z
    .string()
    .min(4)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(64),
});

export async function register(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const parsed = CredentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return "Invalid username or password format.";
  // validate...
  const user = await loginRegister(
    parsed.data.username,
    parsed.data.password,
    true,
  );
  if (!user) return "Registration failed.";
  redirect("/");
}

export async function login(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const parsed = CredentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return "Invalid username or password format.";
  // validate...
  const user = await loginRegister(
    parsed.data.username,
    parsed.data.password,
    false,
  );
  if (!user) return "Login failed.";
  redirect("/");
}

// Endpoint used for both login and registration.
async function loginRegister(
  username: string,
  password: string,
  isRegistering: boolean,
): Promise<User | null> {
  // registration expects a JSON body, login expects form data
  let body: FormData | string;
  const headers: Record<string, string> = {};
  if (isRegistering) {
    body = JSON.stringify({ username, password });
    headers["Content-Type"] = "application/json";
  } else {
    body = new FormData();
    body.append("username", username);
    body.append("password", password);
  }
  // send request to /users/login or /users/register based on isRegistering flag
  const response = await fetch(
    `${environment.apiUrl}users/${isRegistering ? "register" : "login"}`,
    {
      method: "POST",
      headers,
      body,
    },
  );

  if (response.ok) {
    const data = await response.json();
    // check if response body matches expected format
    const parsedData = LoginResponseSchema.safeParse(data);
    if (!parsedData.success) {
      return null;
    }
    (await cookies()).set("token", parsedData.data.access_token, {
      httpOnly: true,
      secure: environment.production,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return parsedData.data.user;
  } else {
    console.error(
      `${isRegistering ? "Register" : "Login"} failed:`,
      response.status,
      await response.text(),
    );
    return null;
  }
}

export async function logout(): Promise<void> {
  (await cookies()).delete("token");
  redirect("/login");
}
