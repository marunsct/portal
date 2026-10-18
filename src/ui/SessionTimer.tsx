"use client";

import { useEffect, useState } from "react";

export function SessionTimer({ exp }: { exp: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const remaining = Math.max(0, exp * 1000 - now);
  const m = Math.floor(remaining / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  const ended = remaining === 0;
  const ends = new Date(exp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <p className={`status ${ended ? "status--down" : "status--up"}`}>{ended ? "Session ended" : "Session active"}</p>
      <p
        aria-live="polite"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.6rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginTop: 8,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </p>
      <p className="small muted" style={{ marginTop: 4 }}>
        {ended ? "Reload this page to start another." : `Ends at ${ends}`}
      </p>
    </div>
  );
}
