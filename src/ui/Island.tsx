import type { ComponentType } from "react";

/**
 * Islands: components that need JavaScript in the browser. The server renders them
 * normally inside a marker element; the client bundle finds every marker and hydrates
 * the same component with the same props. Props must be JSON-serialisable.
 *
 * Register each island in src/server/islands.ts so both sides agree on the name.
 */
export function Island<P extends object>({
  name,
  component: Component,
  props,
}: {
  name: string;
  component: ComponentType<P>;
  props: P;
}) {
  return (
    <div data-island={name} data-props={JSON.stringify(props)} style={{ display: "contents" }}>
      <Component {...props} />
    </div>
  );
}
