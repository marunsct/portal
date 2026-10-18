import { hydrateRoot } from "react-dom/client";
import { createElement } from "react";
import { islands } from "./islands";
import "@/src/styles/globals.css";

function hydrate() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-island]");
  nodes.forEach((el) => {
    const name = el.dataset.island as keyof typeof islands;
    const Component = islands[name] as React.ComponentType<Record<string, unknown>>;
    if (!Component) return;
    let props: Record<string, unknown> = {};
    try {
      props = JSON.parse(el.dataset.props ?? "{}");
    } catch {
      /* leave empty */
    }
    hydrateRoot(el, createElement(Component, props));
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hydrate);
else hydrate();
