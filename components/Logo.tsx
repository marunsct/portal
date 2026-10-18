import { company } from "@/site.config";

/**
 * Wordmark: three stacked bars (the stack) and the company name.
 * The bars are the same motif the rack uses, so the mark and the hero rhyme.
 */
export function Logo({ size = 22, inverse = false }: { size?: number; inverse?: boolean }) {
  const ink = inverse ? "#ffffff" : "var(--ink)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: ink }}>
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="4" rx="1" fill={ink} />
        <rect x="3" y="10" width="18" height="4" rx="1" fill="var(--cobalt)" />
        <rect x="3" y="16" width="18" height="4" rx="1" fill={ink} />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: size * 0.95,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {company.name}
      </span>
    </span>
  );
}
