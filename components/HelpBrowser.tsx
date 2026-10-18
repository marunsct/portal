"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./HelpBrowser.module.css";

interface Article {
  slug: string;
  title: string;
  description: string;
  section: string;
  text: string;
}

export function HelpBrowser({ articles }: { articles: Article[] }) {
  const [q, setQ] = useState("");
  const sections = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = terms.length
      ? articles.filter((a) => terms.every((t) => a.text.includes(t)))
      : articles;
    const map = new Map<string, Article[]>();
    for (const a of matches) {
      if (!map.has(a.section)) map.set(a.section, []);
      map.get(a.section)!.push(a);
    }
    return [...map.entries()];
  }, [q, articles]);

  const total = sections.reduce((n, [, items]) => n + items.length, 0);

  return (
    <div>
      <div className={styles.search}>
        <label htmlFor="help-search" className="sr-only" style={{ position: "absolute", left: -9999 }}>
          Search help articles
        </label>
        <input
          id="help-search"
          type="search"
          className="input"
          placeholder="Search, for example “model server”, “licence”, “port”"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
        <span className="small muted" aria-live="polite">
          {q ? `${total} article${total === 1 ? "" : "s"}` : `${articles.length} articles`}
        </span>
      </div>

      {total === 0 ? (
        <div className="notice notice--amber" style={{ marginTop: 24 }}>
          Nothing matches those words. Try a shorter query, or <Link href={`/support?topic=question&q=${encodeURIComponent(q)}`}>ask support</Link> and we will answer and add an article.
        </div>
      ) : (
        <div className={styles.sections}>
          {sections.map(([section, items]) => (
            <div key={section} className={styles.section}>
              <h2>{section}</h2>
              <ul className={styles.list}>
                {items.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/help/${a.slug}`}>{a.title}</Link>
                    {a.description && <p className="small muted">{a.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
