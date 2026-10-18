import type { ProductId } from "@/lib/products";

/**
 * Schematic drawings of each product's interface. They stand in until real
 * screenshots are dropped into public/screens/<id>.png (see docs/OPERATIONS.md),
 * and they are honest about being drawings: no fake data, only structure.
 */
export function ProductSketch({ id, color }: { id: ProductId; color: string }) {
  const common = {
    width: "100%",
    viewBox: "0 0 640 400",
    role: "img" as const,
    style: { borderRadius: 10, border: "1px solid var(--rule)", background: "var(--paper)" },
  };
  const frame = (
    <>
      <rect x="0" y="0" width="640" height="34" fill="#eef0eb" />
      <circle cx="18" cy="17" r="5" fill="#d2d6cf" />
      <circle cx="36" cy="17" r="5" fill="#d2d6cf" />
      <circle cx="54" cy="17" r="5" fill="#d2d6cf" />
      <rect x="220" y="9" width="200" height="16" rx="8" fill="#e2e5df" />
    </>
  );
  const ink = "#15181d";
  const soft = "#c9cec6";
  const softer = "#e4e7e1";

  if (id === "devflow") {
    const stages = ["Intake", "Spec", "Acceptance", "Sprint 1", "Sprint 2", "Review", "Release"];
    return (
      <svg {...common} aria-label="Schematic of the DevFlow run dashboard: stage strip, live agent activity and artifacts">
        {frame}
        {stages.map((s, i) => (
          <g key={s} transform={`translate(${24 + i * 86}, 54)`}>
            <rect width="78" height="26" rx="5" fill={i < 4 ? color : i === 4 ? "#f0e4c8" : softer} />
            <text x="39" y="17" textAnchor="middle" fontSize="11" fontFamily="var(--font-text)" fill={i < 4 ? "#fff" : ink}>
              {s}
            </text>
          </g>
        ))}
        <rect x="24" y="100" width="380" height="276" rx="8" fill="#f7f8f5" stroke={soft} />
        <text x="40" y="126" fontSize="12" fill={ink} fontFamily="var(--font-text)" fontWeight="600">
          Agent activity
        </text>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} transform={`translate(40, ${142 + i * 32})`}>
            <circle cx="6" cy="8" r="5" fill={i < 2 ? color : soft} />
            <rect x="20" y="2" width={[150, 220, 180, 260, 120, 200, 170][i]} height="12" rx="6" fill={i < 2 ? "#d6dcf6" : softer} />
            <rect x="300" y="2" width="40" height="12" rx="6" fill={softer} />
          </g>
        ))}
        <rect x="420" y="100" width="196" height="130" rx="8" fill="#f7f8f5" stroke={soft} />
        <text x="436" y="126" fontSize="12" fill={ink} fontFamily="var(--font-text)" fontWeight="600">
          Acceptance suite
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(436, ${140 + i * 16})`}>
            <rect width="10" height="10" rx="2" fill={i < 4 ? "#3c7a3e" : "#b8791b"} />
            <rect x="18" y="1" width={[120, 100, 140, 90, 110][i]} height="8" rx="4" fill={softer} />
          </g>
        ))}
        <rect x="420" y="246" width="196" height="130" rx="8" fill="#f7f8f5" stroke={soft} />
        <text x="436" y="272" fontSize="12" fill={ink} fontFamily="var(--font-text)" fontWeight="600">
          Artifacts
        </text>
        {["technical_specification.md", "acceptance_criteria.md", "decision_log.md", "sprint-02/record.md"].map((n, i) => (
          <text key={n} x="436" y={292 + i * 18} fontSize="10.5" fontFamily="var(--font-mono)" fill="#5b6470">
            {n}
          </text>
        ))}
      </svg>
    );
  }

  if (id === "agentcanvas") {
    const nodes = [
      { x: 60, y: 150, w: 120, label: "Ask AI" },
      { x: 240, y: 90, w: 130, label: "Choose a path" },
      { x: 240, y: 230, w: 130, label: "AI Agent" },
      { x: 430, y: 150, w: 130, label: "Ask for approval" },
    ];
    return (
      <svg {...common} aria-label="Schematic of the AgentCanvas editor: palette, canvas with wired blocks, inspector">
        {frame}
        <rect x="0" y="34" width="150" height="366" fill="#f7f8f5" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x="16" y={54 + i * 30} width={[100, 80, 110, 90, 70, 100, 85, 95][i]} height="14" rx="7" fill={softer} />
        ))}
        <rect x="150" y="34" width="330" height="366" fill="#fbfcfa" />
        <g stroke={soft} strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={150 + i * 33} y1="34" x2={150 + i * 33} y2="400" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="150" y1={34 + i * 33} x2="480" y2={34 + i * 33} />
          ))}
        </g>
        <g fill="none" stroke={color} strokeWidth="2">
          <path d="M180 170 C 210 170, 210 110, 240 110" />
          <path d="M180 170 C 210 170, 210 250, 240 250" />
          <path d="M370 110 C 400 110, 400 170, 430 170" />
          <path d="M370 250 C 400 250, 400 170, 430 170" />
        </g>
        {nodes.map((n) => (
          <g key={n.label} transform={`translate(${n.x}, ${n.y})`}>
            <rect width={n.w} height="40" rx="7" fill="#fff" stroke={soft} />
            <rect width="6" height="40" rx="3" fill={color} />
            <text x="16" y="25" fontSize="12" fontFamily="var(--font-text)" fill={ink}>
              {n.label}
            </text>
            <circle cx="0" cy="20" r="4" fill="#fff" stroke={color} strokeWidth="2" />
            <circle cx={n.w} cy="20" r="4" fill="#fff" stroke={color} strokeWidth="2" />
          </g>
        ))}
        <rect x="480" y="34" width="160" height="366" fill="#f7f8f5" />
        <text x="496" y="60" fontSize="12" fontWeight="600" fontFamily="var(--font-text)" fill={ink}>
          Inspector
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(496, ${78 + i * 40})`}>
            <rect width="60" height="8" rx="4" fill={soft} />
            <rect y="14" width="128" height="18" rx="4" fill="#fff" stroke={soft} />
          </g>
        ))}
        <rect x="496" y="330" width="128" height="26" rx="5" fill={color} />
        <text x="560" y="347" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="var(--font-text)">
          Run
        </text>
      </svg>
    );
  }

  return (
    <svg {...common} aria-label="Schematic of the Matura tenant portal: navigation, members table and security policy">
      {frame}
      <rect x="0" y="34" width="150" height="366" fill="#f7f8f5" />
      {["Overview", "Members", "Invitations", "Apps", "Workspaces", "Roles", "Security", "Audit"].map((n, i) => (
        <g key={n}>
          {i === 1 && <rect x="8" y={50 + i * 30} width="134" height="24" rx="5" fill="#fff" stroke={soft} />}
          <text x="20" y={66 + i * 30} fontSize="12" fontFamily="var(--font-text)" fill={i === 1 ? ink : "#5b6470"}>
            {n}
          </text>
        </g>
      ))}
      <text x="176" y="68" fontSize="16" fontWeight="600" fontFamily="var(--font-display)" fill={ink}>
        Members
      </text>
      <rect x="520" y="52" width="96" height="24" rx="5" fill={color} />
      <text x="568" y="68" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="var(--font-text)">
        Invite
      </text>
      <line x1="176" y1="92" x2="616" y2="92" stroke={ink} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(176, ${104 + i * 32})`}>
          <circle cx="10" cy="10" r="9" fill={softer} />
          <rect x="30" y="4" width={[120, 90, 140, 100, 110, 130][i]} height="12" rx="6" fill={softer} />
          <rect x="260" y="4" width="56" height="12" rx="6" fill={i === 0 ? "#d6dcf6" : softer} />
          <rect x="340" y="4" width="70" height="12" rx="6" fill={softer} />
          <line x1="0" y1="26" x2="440" y2="26" stroke={soft} />
        </g>
      ))}
      <rect x="176" y="312" width="440" height="68" rx="8" fill="#f7f8f5" stroke={soft} />
      <text x="192" y="336" fontSize="12" fontWeight="600" fontFamily="var(--font-text)" fill={ink}>
        Security policy
      </text>
      {["MFA required", "Session 12h", "Allowed domains: 1", "IP allow-list: on"].map((t, i) => (
        <g key={t} transform={`translate(${192 + i * 106}, 348)`}>
          <rect width="10" height="10" rx="5" fill="#3c7a3e" />
          <text x="16" y="9" fontSize="10.5" fontFamily="var(--font-text)" fill="#5b6470">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
