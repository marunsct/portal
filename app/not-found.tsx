import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container stack" style={{ maxWidth: 640, ["--stack-gap" as string]: "1.2rem" }}>
        <p className="kicker">404</p>
        <h1>That page is not here.</h1>
        <p className="lede">The address may have changed, or it never existed. The places people usually want:</p>
        <ul style={{ paddingLeft: "1.2em", display: "grid", gap: 8 }}>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/demo">Hosted demos</Link>
          </li>
          <li>
            <Link href="/docs">Documentation</Link>
          </li>
          <li>
            <Link href="/support">Support</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
