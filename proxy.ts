// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { importSPKI, jwtVerify } from "jose";

const pem = process.env.JWT_PUBLIC_KEY;
if (!pem) throw new Error("JWT_PUBLIC_KEY is not set");

const PUBLIC_PATHS = ["/login", "/register"];
const publicKey = importSPKI(pem, "RS256");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  const token = request.cookies.get("token")?.value;
  let valid = false;
  if (token) {
    try {
      await jwtVerify(token, await publicKey, { algorithms: ["RS256"] });
      valid = true;
    } catch {
      // bad signature or expired
    }
  }

  if (!valid && !isPublic) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("token");
    return res;
  }
  if (valid && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // skip static assets and image optimization
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
