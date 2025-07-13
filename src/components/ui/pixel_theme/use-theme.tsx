// src/components/ui/pixel_theme/use-theme.tsx
"use client";
import { createContext, useContext } from "react";
import type { PixelThemeContextType } from "./types";

export const PixelThemeContext = createContext<PixelThemeContextType | null>(null);

export function useTheme() {//React 的 Context，用来提供“全局主题状态”。这是一个自定义 Hook，任何组件都可以通过它访问和切换主题。
  const context = useContext(PixelThemeContext);
  if (!context) throw new Error("useTheme must be used within PixelThemeProvider");
  return context;
}
