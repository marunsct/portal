import { productForHost, readCookie, verifyToken } from "@/src/lib/demo";
import { company, demo } from "@/site.config";

/**
 * Gateway authorisation endpoint (Caddy `forward_auth`, nginx `auth_request`).
 *
 * Caddy sends the original request's headers with X-Forwarded-Host set to the demo
 * host the visitor asked for. We answer 200 when the visitor holds a valid session
 * for that host's product, otherwise 401 with a Location pointing at the launch page
 * (Caddy copies the Location header back to the browser, so the visitor lands on the
 * right page instead of a bare 401).
 */
export async function GET(req: Request) {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("x-original-host") ??
    req.headers.get("host");
  const uri = req.headers.get("x-forwarded-uri") ?? "/";
  const product = productForHost(host);

  const portal = `${demo.scheme}://www.${company.domain}`;

  if (!product) {
    return new Response("unknown demo host", { status: 404 });
  }

  const token = readCookie(req.headers.get("cookie"));
  const session = verifyToken(token);

  // The identity provider for Matura is reachable while a Matura session is live.
  const required = product === "id" ? "matura" : product;

  if (session && session.product === required) {
    return new Response(null, {
      status: 200,
      headers: {
        "X-Demo-Session": session.id,
        "X-Demo-Expires": String(session.exp),
      },
    });
  }

  // Assets and health probes get a plain 401; page navigations get a redirect.
  const accept = req.headers.get("accept") ?? "";
  const wantsPage = accept.includes("text/html") || uri === "/";
  const reason = session ? "other" : token ? "expired" : "none";
  const location = `${portal}/demo/${required}?reason=${reason}`;
  // Any non-2xx response is copied back to the visitor by the gateway, so a 302
  // here is what actually moves the browser to the launch page.
  return new Response(wantsPage ? null : "demo session required", {
    status: wantsPage ? 302 : 401,
    headers: wantsPage ? { Location: location, "Cache-Control": "no-store" } : { "Cache-Control": "no-store" },
  });
}
