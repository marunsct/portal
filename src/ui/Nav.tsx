import { useEffect, useState } from "react";
import Link from "./Link";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

const links = [
  { href: "/products", label: "Products" },
  { href: "/demo", label: "Demos" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/company", label: "Company" },
  { href: "/support", label: "Support" },
];

export function Nav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" aria-label="Home" className={styles.brand}>
          <Logo />
        </Link>
        <nav id="primary-nav" aria-label="Primary" className={`${styles.links} ${open ? styles.open : ""}`}>
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={styles.link}>
                {l.label}
              </Link>
            );
          })}
          <Link href="/demo" className={`btn btn--primary ${styles.cta}`}>
            Try the demos
          </Link>
        </nav>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.srOnly}>Menu</span>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
