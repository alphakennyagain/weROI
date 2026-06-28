export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const typeStripeColors: Record<string, string> = {
  professional: "bg-[#4338ca]",
  personal: "bg-violet-500",
  coursework: "bg-emerald-500",
  security: "bg-green-500",
};

export const typeBadgeColors: Record<string, string> = {
  personal: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  coursework: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  professional: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
  security: "border-green-500/40 bg-green-500/10 text-green-400",
};

export const projectAccentColors: Record<string, string> = {
  weroi: "#b8ff3c",
  pntcog: "#d4a843",
  "studysync-api": "#6366f1",
  "webhook-relay-api": "#f59e0b",
  "openapi-devkit": "#14b8a6",
  "phone-store-api": "#ec4899",
  "ds-bst-lab": "#22c55e",
  "db-library-system": "#3b82f6",
  "prog-fund-algorithms": "#a855f7",
  "cyber-network-hardening": "#06b6d4",
  "portfolio-site": "#1500ff",
};

export const projectImageFit: Record<string, "cover" | "contain"> = {
  pntcog: "contain",
};

export function getProjectAccent(slug: string): string {
  return projectAccentColors[slug] ?? "#1500ff";
}

export const typeLabels: Record<string, string> = {
  personal: "Personal",
  coursework: "Coursework",
  professional: "Contract",
  security: "Security",
};

export const bentoSpans: Record<string, string> = {
  large: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  default: "",
};
