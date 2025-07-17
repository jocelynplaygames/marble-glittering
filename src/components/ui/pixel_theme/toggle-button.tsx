// src/components/ui/pixel_theme/toggle-button.tsx
"use client";
import { useTheme } from "./use-theme";

import { toast } from "~/components/ui/use-toast"; // 或你项目的 toast 工具

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
    toast({
      title: "Theme Switched",
      description: `Switched to ${theme === "pixel" ? "✨ Modern Style" : "🎮 Pixel Style"}`,
    });
  };

  return (
    <button onClick={handleClick} className="ml-4 text-xs">
      Current Theme: {theme === "pixel" ? "🎮 Pixel" : "✨ Modern"} (Click to toggle)
    </button>
  );
}