export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const typeBadgeColors: Record<string, string> = {
  personal: "bg-amber-500/15 text-amber-300 border-amber-500/35",
  coursework: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
  professional: "bg-coral-500/15 text-[#f0a090] border-[#e07050]/35",
  security: "bg-[#5ee87a]/15 text-[#5ee87a] border-[#5ee87a]/35",
};

export const typeLabels: Record<string, string> = {
  personal: "Personal",
  coursework: "Coursework",
  professional: "Professional",
  security: "Security",
};

/** Bento grid span classes — asymmetric layout */
export const bentoSpans: Record<string, string> = {
  large: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  default: "",
};
