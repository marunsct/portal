import { redirect } from "@/src/server/respond";
import { clearCookieHeader, endSession, readCookie, verifyToken } from "@/src/lib/demo";

/** POST /api/demo/end — ends the visitor's current demo session and clears the cookie. */
export async function POST(req: Request) {
  const session = verifyToken(readCookie(req.headers.get("cookie")));
  if (session) endSession(session.id, session.product);
  const url = new URL("/demo/ended", req.url);
  url.searchParams.set("reason", "ended");
  if (session) url.searchParams.set("product", session.product);
  const res = redirect(url, 303);
  res.headers.append("Set-Cookie", clearCookieHeader());
  return res;
}
