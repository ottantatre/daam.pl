// Tailwind color families (excluding grays) × shades 400–800
export const COLOR_FAMILIES: string[][] = [
  ["#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b"], // red
  ["#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412"], // orange
  ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e"], // amber
  ["#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e"], // yellow
  ["#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212"], // lime
  ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534"], // green
  ["#34d399", "#10b981", "#059669", "#047857", "#065f46"], // emerald
  ["#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59"], // teal
  ["#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75"], // cyan
  ["#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985"], // sky
  ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"], // blue
  ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3"], // indigo
  ["#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"], // violet
  ["#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8"], // purple
  ["#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f"], // fuchsia
  ["#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d"], // pink
  ["#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239"], // rose
];

export const PRESET_COLORS = COLOR_FAMILIES.flat();
export const DEFAULT_COLOR = "#3b82f6"; // blue-500
