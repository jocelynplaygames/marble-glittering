"use client";

import { useTheme } from "~/components/ui/pixel_theme/use-theme";
import { PixelButton } from "~/components/ui/pixel_ui";
import { Button as ModernButton } from "~/components/ui/button";

type PixelButtonProps = React.ComponentProps<typeof PixelButton>;
type ModernButtonProps = React.ComponentProps<typeof ModernButton>;

// 👇 联合类型：允许支持两种风格组件的 props
type ButtonProps = PixelButtonProps & ModernButtonProps;

export const Button = (props: ButtonProps) => {
  const { theme } = useTheme();
  return theme === "pixel" ? <PixelButton {...props} /> : <ModernButton {...props} />;
};
