import { createFileRoute } from "@tanstack/react-router";
import { FioShell } from "@/components/FioShell";

export const Route = createFileRoute("/_app")({
  component: FioShell,
});
