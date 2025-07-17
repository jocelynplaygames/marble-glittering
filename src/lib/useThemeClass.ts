// src/lib/useThemeClass.ts
"use client";
import { useTheme } from "~/components/ui/pixel_theme/use-theme";

export function useThemeClass({
    pixel,
    modern = "",
}: {
    pixel: string;
    modern?: string;
}) {
    const { theme } = useTheme();
    return theme === "pixel" ? pixel : modern;
}
