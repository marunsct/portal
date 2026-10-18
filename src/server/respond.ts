/** Redirect with mutable headers (Response.redirect's headers are immutable). */
export function redirect(location: URL | string, status = 302): Response {
  return new Response(null, { status, headers: { Location: String(location) } });
}
