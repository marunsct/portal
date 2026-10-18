import Link from "@/src/ui/Link";
import { docsNavigation, type Doc } from "@/src/lib/content";
import styles from "./DocsShell.module.css";

export function DocsShell({ current, children }: { current?: string[]; children: React.ReactNode }) {
  const groups = docsNavigation();
  const currentHref = current ? `/docs/${current.join("/")}` : "/docs";
  return (
    <div className={`container ${styles.shell}`}>
      <aside className={styles.sidebar} aria-label="Documentation">
        <details className={styles.mobileToggle}>
          <summary>Browse documentation</summary>
          <SidebarNav groups={groups} currentHref={currentHref} />
        </details>
        <div className={styles.desktopNav}>
          <SidebarNav groups={groups} currentHref={currentHref} />
        </div>
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}

function SidebarNav({
  groups,
  currentHref,
}: {
  groups: ReturnType<typeof docsNavigation>;
  currentHref: string;
}) {
  return (
    <nav className={styles.nav}>
      <Link href="/docs" aria-current={currentHref === "/docs" ? "page" : undefined} className={styles.home}>
        Documentation home
      </Link>
      {groups.map((g) => (
        <div key={g.key} className={styles.group}>
          <h4>{g.label}</h4>
          <ul>
            {g.items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} aria-current={currentHref === it.href ? "page" : undefined}>
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocToc({ doc }: { doc: Doc }) {
  const items = doc.headings.filter((h) => h.depth === 2);
  if (items.length < 2) return null;
  return (
    <nav className={styles.toc} aria-label="On this page">
      <h4>On this page</h4>
      <ul>
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PrevNext({ current }: { current: string[] }) {
  const flat = docsNavigation().flatMap((g) => g.items);
  const href = `/docs/${current.join("/")}`;
  const i = flat.findIndex((x) => x.href === href);
  const prev = i > 0 ? flat[i - 1] : null;
  const next = i >= 0 && i < flat.length - 1 ? flat[i + 1] : null;
  if (!prev && !next) return null;
  return (
    <div className={styles.prevNext}>
      {prev ? (
        <Link href={prev.href}>
          <span className="small muted">Previous</span>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={styles.next}>
          <span className="small muted">Next</span>
          <span>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
