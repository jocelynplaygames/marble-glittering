// src/components/ui/pixel_theme/toggle-button.tsx
"use client";
import { useTheme } from "./use-theme";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="ml-4 text-xs">
      Theme：{theme === "pixel" ? "🎮 pixel" : "✨ modern"}（click to change）
    </button>
  );
}
