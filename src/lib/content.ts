import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, type Tokens } from "marked";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface Doc {
  slug: string[]; // e.g. ["devflow", "quickstart"]
  title: string;
  description?: string;
  order: number;
  section?: string;
  html: string;
  headings: { depth: number; text: string; id: string }[];
  updated?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Minimal token-based highlighter: keeps code readable without a dependency. */
function highlight(code: string, lang: string): string {
  const esc = escapeHtml(code);
  if (!lang || lang === "text" || lang === "txt") return esc;
  if (lang === "bash" || lang === "sh" || lang === "shell" || lang === "console") {
    return esc
      .split("\n")
      .map((line) => {
        if (/^\s*#/.test(line)) return `<span class="tok-c">${line}</span>`;
        return line.replace(/^(\s*\$ ?)/, '<span class="tok-p">$1</span>');
      })
      .join("\n");
  }
  if (lang === "yaml" || lang === "yml" || lang === "toml" || lang === "ini" || lang === "env" || lang === "dotenv") {
    return esc
      .split("\n")
      .map((line) => {
        if (/^\s*#/.test(line)) return `<span class="tok-c">${line}</span>`;
        return line.replace(/^(\s*[\w.\-\[\]]+)(\s*[:=])/, '<span class="tok-k">$1</span>$2');
      })
      .join("\n");
  }
  return esc;
}

const renderer = new marked.Renderer();

renderer.heading = function ({ text, depth, tokens }: Tokens.Heading) {
  const plain = this.parser.parseInline(tokens).replace(/<[^>]+>/g, "");
  const id = slugify(plain);
  return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}">${this.parser.parseInline(tokens)}</a></h${depth}>\n`;
};

renderer.code = function ({ text, lang }: Tokens.Code) {
  const language = (lang ?? "").trim().split(/\s+/)[0];
  return `<pre data-lang="${escapeHtml(language)}"><code>${highlight(text, language)}</code></pre>\n`;
};

renderer.table = function ({ header, rows }: Tokens.Table) {
  const th = header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
  const body = rows
    .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="table-scroll"><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>\n`;
};

marked.use({ renderer, gfm: true });

function extractHeadings(markdown: string) {
  const out: Doc["headings"] = [];
  const lines = markdown.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (m) out.push({ depth: m[1].length, text: m[2].replace(/`/g, ""), id: slugify(m[2]) });
  }
  return out;
}

function formatDate(v: unknown): string | undefined {
  if (!v) return undefined;
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toISOString().slice(0, 10);
}

function readMarkdownFile(file: string, slug: string[]): Doc {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content) as string;
  return {
    slug,
    title: data.title ?? slug[slug.length - 1],
    description: data.description,
    order: typeof data.order === "number" ? data.order : 999,
    section: data.section,
    html,
    headings: extractHeadings(content),
    updated: formatDate(data.updated),
  };
}

/** Load one doc under content/<area>/<...slug>.md */
export function loadDoc(area: "docs" | "help" | "legal" | "changelog", slug: string[]): Doc | null {
  const file = path.join(CONTENT_ROOT, area, ...slug) + ".md";
  if (!fs.existsSync(file)) {
    const index = path.join(CONTENT_ROOT, area, ...slug, "index.md");
    if (fs.existsSync(index)) return readMarkdownFile(index, slug);
    return null;
  }
  return readMarkdownFile(file, slug);
}

/** List all docs in an area (recursively), sorted by section then order. */
export function listDocs(area: "docs" | "help" | "legal" | "changelog"): Doc[] {
  const root = path.join(CONTENT_ROOT, area);
  if (!fs.existsSync(root)) return [];
  const out: Doc[] = [];
  const walk = (dir: string, prefix: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name), [...prefix, entry.name]);
      else if (entry.name.endsWith(".md")) {
        const base = entry.name.replace(/\.md$/, "");
        const slug = base === "index" ? prefix : [...prefix, base];
        out.push(readMarkdownFile(path.join(dir, entry.name), slug));
      }
    }
  };
  walk(root, []);
  return out.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function docHref(area: string, slug: string[]): string {
  return `/${area}${slug.length ? "/" + slug.join("/") : ""}`;
}

/** Sidebar structure for /docs: group by first slug segment. */
export interface DocsGroup {
  key: string;
  label: string;
  items: { title: string; href: string; slug: string[] }[];
}

const GROUP_LABELS: Record<string, string> = {
  suite: "The suite",
  devflow: "DevFlow",
  agentcanvas: "AgentCanvas",
  matura: "Matura",
};
const GROUP_ORDER = ["suite", "devflow", "agentcanvas", "matura"];

export function docsNavigation(): DocsGroup[] {
  const docs = listDocs("docs");
  const groups = new Map<string, DocsGroup>();
  for (const d of docs) {
    if (d.slug.length === 0) continue;
    const key = d.slug[0];
    if (!groups.has(key)) groups.set(key, { key, label: GROUP_LABELS[key] ?? key, items: [] });
    groups.get(key)!.items.push({ title: d.title, href: docHref("docs", d.slug), slug: d.slug });
  }
  return [...groups.values()].sort(
    (a, b) => (GROUP_ORDER.indexOf(a.key) + 100) % 100 - ((GROUP_ORDER.indexOf(b.key) + 100) % 100),
  );
}

export function searchText(doc: Doc): string {
  return `${doc.title} ${doc.description ?? ""} ${doc.html.replace(/<[^>]+>/g, " ")}`.toLowerCase();
}
