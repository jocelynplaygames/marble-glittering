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


// // src/components/index.ts

// import { useTheme } from "~/components/ui/pixel_theme/use-theme";
// import { PixelButton } from "~/components/ui/pixel_ui";
// import { Button as ModernButton } from "~/components/ui/button";

// // 通过 React.ComponentProps 获取 PixelButton 和 ModernButton 的 props 类型
// export const Button = (props: React.ComponentProps<typeof PixelButton> | React.ComponentProps<typeof ModernButton>) => {
//   const { theme } = useTheme();
//   return theme === "pixel" ? <PixelButton {...props} /> : <ModernButton {...props} />;
// };

// // 客户端组件专用导出（这些组件不引入 server/db 或服务端逻辑）
// export { Analytics } from "./analytics";
// export { DialogWrapper } from "./dialog-wrapper";
// export { Icons } from "./icons";
// export { JoinLeaveToggle } from "./join-leave-toggle";
// export { MiniCreatePost } from "./mini-create-post";
// export { Navbar } from "./navbar";
// export { PostForm } from "./post/post-form";
// export { Providers } from "./providers";
// export { SignIn } from "./sign-in";
// export { SignUp } from "./sign-up";
// export { TailwindIndicator } from "./tailwind-indicator";
// export { ThemeProvider } from "./theme-provider";
// export { ToFeedButton } from "./to-feed-button";
// export { UsernameForm } from "./username-form";