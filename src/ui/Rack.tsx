"use client";

import Link from "@/src/ui/Link";
import { useEffect, useState } from "react";
import styles from "./Rack.module.css";

type Status = "up" | "busy" | "down" | "unknown";

export interface RackUnit {
  id: string;
  name: string;
  layer: string;
  line: string;
  port: number;
  href: string;
  color: string;
}

interface StatusPayload {
  products: Record<string, { status: Status; active: number; max: number }>;
}

export function Rack({ units }: { units: RackUnit[] }) {
  const [status, setStatus] = useState<StatusPayload["products"]>({});
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/demo/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as StatusPayload;
        if (!cancelled) setStatus(data.products ?? {});
      } catch {
        /* status is decorative; stay silent */
      }
    };
    load();
    const t = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <figure className={styles.rack} aria-label="The three products shown as units in a server rack on your hardware">
      <div className={styles.rail} aria-hidden="true" />
      <ul className={styles.units}>
        {units.map((u, i) => {
          const s = status[u.id]?.status ?? "unknown";
          const isActive = active === u.id;
          return (
            <li
              key={u.id}
              className={`${styles.unit} ${isActive ? styles.unitActive : ""}`}
              style={{ ["--unit-color" as string]: u.color, animationDelay: `${160 + i * 110}ms` }}
              onMouseEnter={() => setActive(u.id)}
              onMouseLeave={() => setActive(null)}
            >
              <Link
                href={u.href}
                className={styles.face}
                onFocus={() => setActive(u.id)}
                onBlur={() => setActive(null)}
              >
                <span className={styles.screws} aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className={styles.stripe} aria-hidden="true" />
                <span className={styles.label}>
                  <span className={styles.layer}>{u.layer}</span>
                  <span className={styles.name}>{u.name}</span>
                </span>
                <span className={styles.line}>{u.line}</span>
                <span className={styles.right}>
                  <span className={styles.port} aria-label={`port ${u.port}`}>
                    :{u.port}
                  </span>
                  <span className={`${styles.led} ${styles[`led_${s}`]}`} aria-hidden="true" />
                  <span className={styles.ledText}>
                    {s === "up" ? "demo live" : s === "busy" ? "demo full" : s === "down" ? "demo offline" : "demo"}
                  </span>
                </span>
                <span className={styles.screws} aria-hidden="true">
                  <i />
                  <i />
                </span>
              </Link>
            </li>
          );
        })}
        <li className={`${styles.unit} ${styles.base}`} style={{ animationDelay: "520ms" }}>
          <div className={styles.face}>
            <span className={styles.screws} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className={styles.stripeNone} aria-hidden="true" />
            <span className={styles.label}>
              <span className={styles.layer}>Runs on</span>
              <span className={styles.name}>Your hardware</span>
            </span>
            <span className={styles.line}>LM Studio · Ollama · vLLM · llama.cpp · your Postgres · your Keycloak</span>
            <span className={styles.right}>
              <span className={styles.vents} aria-hidden="true">
                {Array.from({ length: 9 }).map((_, i) => (
                  <i key={i} />
                ))}
              </span>
            </span>
            <span className={styles.screws} aria-hidden="true">
              <i />
              <i />
            </span>
          </div>
        </li>
      </ul>
      <div className={styles.rail} aria-hidden="true" />
      <figcaption className={styles.caption}>
        Each unit is a product you run in Docker. The lights show whether a hosted demo seat is free right now.
      </figcaption>
    </figure>
  );
}
