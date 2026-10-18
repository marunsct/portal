"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/products", label: "Products" },
  { href: "/demo", label: "Demos" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/company", label: "Company" },
  { href: "/support", label: "Support" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" aria-label="Home" className="nav__brand">
          <Logo />
        </Link>
        <nav aria-label="Primary" className={`nav__links ${open ? "is-open" : ""}`}>
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}>
                {l.label}
              </Link>
            );
          })}
          <Link href="/demo" className="btn btn--primary nav__cta">
            Try the demos
          </Link>
        </nav>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            {open ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: color-mix(in srgb, var(--chalk) 86%, transparent);
          backdrop-filter: saturate(140%) blur(10px);
          -webkit-backdrop-filter: saturate(140%) blur(10px);
          border-bottom: 1px solid var(--rule);
        }
        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
          gap: 24px;
        }
        .nav__brand {
          display: inline-flex;
          text-decoration: none;
        }
        .nav__links {
          display: flex;
          align-items: center;
          gap: 26px;
        }
        .nav__links :global(a) {
          color: var(--ink-soft);
          font-size: 0.98rem;
          text-decoration: none;
          padding: 6px 0;
          border-bottom: 2px solid transparent;
          transition: border-color 140ms var(--ease), color 140ms var(--ease);
        }
        .nav__links :global(a:hover) {
          color: var(--ink);
        }
        .nav__links :global(a[aria-current="page"]) {
          color: var(--ink);
          border-bottom-color: var(--cobalt);
        }
        .nav__links :global(.nav__cta) {
          color: #fff;
          border-bottom: 0;
          padding: 10px 16px;
          margin-left: 6px;
        }
        .nav__toggle {
          display: none;
          background: none;
          border: 1px solid var(--rule);
          border-radius: var(--radius);
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          cursor: pointer;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }
        @media (max-width: 880px) {
          .nav__toggle {
            display: inline-flex;
          }
          .nav__links {
            position: absolute;
            left: 0;
            right: 0;
            top: 68px;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            background: var(--paper);
            border-bottom: 1px solid var(--rule);
            padding: 8px var(--gutter) 16px;
            display: none;
          }
          .nav__links.is-open {
            display: flex;
          }
          .nav__links :global(a) {
            padding: 14px 0;
            border-bottom: 1px solid var(--rule-soft);
            font-size: 1.05rem;
          }
          .nav__links :global(a[aria-current="page"]) {
            border-bottom-color: var(--rule-soft);
            color: var(--cobalt);
          }
          .nav__links :global(.nav__cta) {
            margin: 14px 0 0;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}
