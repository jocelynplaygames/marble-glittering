// src/components/ui/pixel_theme/toggle-button.tsx
"use client";
import { useTheme } from "./use-theme";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="ml-4 text-xs">
      当前主题：{theme === "pixel" ? "🎮 像素风" : "✨ 现代风"}（点击切换）
    </button>
  );
}
