/**
 * Shared registry of island components. Imported by the server (to render) and by
 * the client entry (to hydrate), so names cannot drift.
 */
import { Nav } from "@/src/ui/Nav";
import { Rack } from "@/src/ui/Rack";
import { DemoStatusList } from "@/src/ui/DemoStatus";
import { SessionTimer } from "@/src/ui/SessionTimer";
import { HelpBrowser } from "@/src/ui/HelpBrowser";
import { SupportForm } from "@/src/ui/SupportForm";

export const islands = {
  Nav,
  Rack,
  DemoStatusList,
  SessionTimer,
  HelpBrowser,
  SupportForm,
} as const;

export type IslandName = keyof typeof islands;
