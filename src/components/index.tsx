// ⚠️ 不加 "use client"！！这个文件必须是服务端安全的

// ✅ 从 client-only 单独导入带 hook 的 Button
export { Button } from "./client-only";

// ✅ 服务端或通用组件导出
export { CommentSection } from "./comments/comment-section";
export { CustomFeed } from "./home-page/custom-feed";
export { GeneralFeed } from "./home-page/general-feed";
export { PostVoteServer } from "./post-vote/post-vote-server";
export { PostFeed } from "./post/post-feed";

// ✅ 客户端组件（不使用 server/db/env）
export { Analytics } from "./analytics";
export { DialogWrapper } from "./dialog-wrapper";
export { Icons } from "./icons";
export { JoinLeaveToggle } from "./join-leave-toggle";
export { MiniCreatePost } from "./mini-create-post";
export { Navbar } from "./navbar";
export { PostForm } from "./post/post-form";
export { Providers } from "./providers";
export { SignIn } from "./sign-in";
export { SignUp } from "./sign-up";
export { TailwindIndicator } from "./tailwind-indicator";
export { ThemeProvider } from "./theme-provider";
export { ToFeedButton } from "./to-feed-button";
export { UsernameForm } from "./username-form";



// // "use client";
// export { CommentSection } from "./comments/comment-section";
// export { CustomFeed } from "./home-page/custom-feed";
// export { GeneralFeed } from "./home-page/general-feed";
// export { PostVoteServer } from "./post-vote/post-vote-server";
// export { PostFeed } from "./post/post-feed";
// // export { DialogWrapper } from "./dialog-wrapper";
// // export { Analytics } from "./analytics";
// // export { Icons } from "./icons";
// // export { JoinLeaveToggle } from "./join-leave-toggle";
// // export { MiniCreatePost } from "./mini-create-post";
// // export { Navbar } from "./navbar";
// // export { PostForm } from "./post/post-form";
// // export { Providers } from "./providers";
// // export { SignIn } from "./sign-in";
// // export { SignUp } from "./sign-up";
// // export { TailwindIndicator } from "./tailwind-indicator";
// // export { ThemeProvider } from "./theme-provider";
// // export { ToFeedButton } from "./to-feed-button";
// // export { UsernameForm } from "./username-form";


// // src/components/index.tsx

// import { useTheme } from "~/components/ui/pixel_theme/use-theme";
// import { PixelButton } from "~/components/ui/pixel_ui";
// import { Button as ModernButton } from "~/components/ui/button";
// type ButtonProps = React.ComponentProps<typeof PixelButton>;

// export const Button = (props: ButtonProps) => {
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