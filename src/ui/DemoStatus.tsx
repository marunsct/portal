"use client";

import Link from "@/src/ui/Link";
import { useEffect, useState } from "react";
import styles from "./DemoStatus.module.css";

type Status = "up" | "busy" | "down" | "unknown";
interface Entry {
  status: Status;
  active: number;
  max: number;
  available: number;
}

export function useDemoStatus() {
  const [data, setData] = useState<Record<string, Entry>>({});
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/demo/status", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          if (alive) setData(j.products ?? {});
        }
      } catch {
        /* decorative */
      }
    };
    load();
    const t = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return data;
}

export function statusLabel(e?: Entry): { cls: string; text: string } {
  if (!e || e.status === "unknown") return { cls: "", text: "Checking availability" };
  if (e.status === "down") return { cls: "status--down", text: "Offline right now" };
  if (e.status === "busy") return { cls: "status--busy", text: `All ${e.max} seats in use` };
  return { cls: "status--up", text: `${e.available} of ${e.max} seats free` };
}

export function DemoStatusList({
  items,
}: {
  items: { id: string; name: string; layer: string; tagline: string; expectation: string; href: string; color: string }[];
}) {
  const status = useDemoStatus();
  return (
    <div className={styles.list}>
      {items.map((it) => {
        const s = statusLabel(status[it.id]);
        return (
          <article key={it.id} className={styles.item} style={{ ["--accent" as string]: it.color }}>
            <div className={styles.head}>
              <p className="kicker" style={{ marginBottom: 4 }}>
                {it.layer}
              </p>
              <h2>{it.name}</h2>
              <p className="muted">{it.tagline}</p>
            </div>
            <div className={styles.body}>
              <p>{it.expectation}</p>
              <p className={`status ${s.cls}`}>{s.text}</p>
            </div>
            <div className={styles.action}>
              <Link href={it.href} className="btn btn--primary">
                Open the {it.name} demo
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
