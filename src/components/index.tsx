// src/components/index.ts

// 统一出口（barrel file），方便你在其他文件中更简洁地导入多个组件、工具或模块。
//	整体导出当前主题使用的组件（根据主题切换：pixel / modern）



// 🧠 主题感知导出按钮
import { useTheme } from "~/components/ui/pixel_theme/use-theme";
import { PixelButton } from "~/components/ui/pixel_ui";
import { Button as ModernButton } from "~/components/ui/button";

// 包装组件，根据主题决定使用哪个按钮
export const Button = (props: any) => {
  const { theme } = useTheme();
  return theme === "pixel" ? <PixelButton {...props} /> : <ModernButton {...props} />;
};





export { Analytics } from "./analytics";
export { CommentSection } from "./comments/comment-section";
export { DialogWrapper } from "./dialog-wrapper";
export { CustomFeed } from "./home-page/custom-feed";
export { GeneralFeed } from "./home-page/general-feed";
export { Icons } from "./icons";
export { JoinLeaveToggle } from "./join-leave-toggle";
export { MiniCreatePost } from "./mini-create-post";
export { Navbar } from "./navbar";
export { PostVoteServer } from "./post-vote/post-vote-server";
export { PostFeed } from "./post/post-feed";
export { PostForm } from "./post/post-form";
export { Providers } from "./providers";
export { SignIn } from "./sign-in";
export { SignUp } from "./sign-up";
export { TailwindIndicator } from "./tailwind-indicator";
export { ThemeProvider } from "./theme-provider";
export { ToFeedButton } from "./to-feed-button";
export { UsernameForm } from "./username-form";


// //按主题导出

// import { useTheme } from "~/components/ui/pixel_theme/use-theme";
// import { Button as ModernButton } from "./button";
// import { Input as ModernInput } from "./input";
// import { Card as ModernCard } from "./card";
// import { Label as ModernLabel } from "./label";
// import { Textarea as ModernTextarea } from "./textarea";

// import {
//   PixelButton,
//   PixelCard,
//   PixelInput,
//   PixelLabel,
//   PixelTextarea,
// } from "./pixel_ui";

// export const Button = (props: any) => {
//   const { theme } = useTheme();
//   return theme === "pixel" ? <PixelButton {...props} /> : <ModernButton {...props} />;
// };

// export const Input = (props: any) => {
//   const { theme } = useTheme();
//   return theme === "pixel" ? <PixelInput {...props} /> : <ModernInput {...props} />;
// };

// export const Card = (props: any) => {
//   const { theme } = useTheme();
//   return theme === "pixel" ? <PixelCard {...props} /> : <ModernCard {...props} />;
// };

// export const Label = (props: any) => {
//   const { theme } = useTheme();
//   return theme === "pixel" ? <PixelLabel {...props} /> : <ModernLabel {...props} />;
// };

// export const Textarea = (props: any) => {
//   const { theme } = useTheme();
//   return theme === "pixel" ? <PixelTextarea {...props} /> : <ModernTextarea {...props} />;
// };
