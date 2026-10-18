import Link from "@/src/ui/Link";
import { company } from "@/site.config";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Products",
    links: [
      { href: "/products/devflow", label: "DevFlow" },
      { href: "/products/agentcanvas", label: "AgentCanvas" },
      { href: "/products/matura", label: "Matura" },
      { href: "/products", label: "Compare the three" },
      { href: "/demo", label: "Hosted demos" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { href: "/docs", label: "Docs home" },
      { href: "/docs/devflow/quickstart", label: "DevFlow quick start" },
      { href: "/docs/agentcanvas/quickstart", label: "AgentCanvas quick start" },
      { href: "/docs/matura/quickstart", label: "Matura quick start" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/vision", label: "Vision" },
      { href: "/company", label: "About" },
      { href: "/pricing", label: "Pricing and licensing" },
      { href: "/security", label: "Security and trust" },
      { href: company.github, label: "GitHub", external: true },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/help", label: "Help centre" },
      { href: "/support", label: "Contact support" },
      { href: "/support?topic=sales", label: "Talk to sales" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo inverse />
            <p className={styles.tagline}>{company.tagline}</p>
            <p className={styles.meta}>
              {company.location}
              <br />
              <a href={`mailto:${company.emails.hello}`}>{company.emails.hello}</a>
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className={styles.colTitle}>{c.title}</h4>
              <ul className={styles.list}>
                {c.links.map((l) => (
                  <li key={l.href}>
                    {"external" in l && l.external ? (
                      <a href={l.href} rel="noopener">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {company.legalName}. Self-hosted software; nothing on this site tracks you.
          </span>
          <span>
            <Link href="/legal/eula">Licence agreement</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
