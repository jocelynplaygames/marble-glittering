"use client";
import React, { useState, useEffect } from "react";
import { PixelThemeContext } from "./use-theme";
import type { PixelTheme } from "./types";

// 管理 theme 状态（默认 "modern"）
// 从 localStorage 读取 / 写入主题
// 使用 PixelThemeContext.Provider 包裹整个页面
// 这是把 状态注入到全局的核心组件。

export function PixelThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PixelTheme>("modern");

  useEffect(() => {
    const stored = localStorage.getItem("pixel-theme");
    if (stored === "pixel" || stored === "modern") {
      setTheme(stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "pixel" ? "modern" : "pixel";
    setTheme(next);
    localStorage.setItem("pixel-theme", next);
  };

  return (
    <PixelThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </PixelThemeContext.Provider>
  );
}
