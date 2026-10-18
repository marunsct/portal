export function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="section" style={{ paddingBottom: "clamp(32px, 5vw, 56px)" }}>
      <div className="container stack" style={{ ["--stack-gap" as string]: "1.1rem" }}>
        {kicker && <p className="kicker" style={{ marginBottom: 0 }}>{kicker}</p>}
        <h1 style={{ maxWidth: "20ch" }}>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
