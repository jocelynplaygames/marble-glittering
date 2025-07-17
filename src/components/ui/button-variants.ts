//components/ui/button-variants.ts
import { useTheme } from "~/components/ui/pixel_theme/use-theme";
import { buttonVariants as modernButtonVariants } from "./button";
import { pixelButtonVariants } from "./pixel_ui/pixel_button"; // 你需要确保像素按钮也定义了类似的 variants 函数

export function useButtonVariants() {
    const { theme } = useTheme();
    return theme === "pixel" ? pixelButtonVariants : modernButtonVariants;
}
