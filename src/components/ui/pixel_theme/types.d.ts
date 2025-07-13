// src/components/ui/types.d.ts
//表示你有两个主题类型。
export type PixelTheme = "modern" | "pixel";

export interface PixelThemeContextType {//是全局上下文的数据结构：包含当前主题值和切换方法
  theme: PixelTheme;
  toggleTheme: () => void;
}
