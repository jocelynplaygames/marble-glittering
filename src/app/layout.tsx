//app/layout.tsx
//是一个 Next.js 应用的根布局（Root Layout），通常用于定义网站的整体结构，比如 <html>、<body> 的内容、全局字体、主题、导航栏等。

import { type Metadata } from "next";
import { Inter } from "next/font/google";

// ✅ 主题 
import {
  Analytics,
  Navbar,
  Providers,
  TailwindIndicator,
  ThemeProvider,
} from "~/components";
import { PixelThemeProvider } from "~/components/ui/pixel_theme/provider";
// ✅ 公共组件
import { Toaster } from "~/components/ui/toaster";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

//RootLayoutProps 就是告诉 TypeScript：「这个组件会接收两个属性：一个是 authModal（React 元素），一个是 children（也是 React 元素）」。
interface RootLayoutProps {// TypeScript 接口（interface）定义，用于约束 RootLayout 函数组件的 props（传入属性） 的类型
  authModal: React.ReactNode;//一般是登录注册模态框的内容，传给布局统一渲染
  children: React.ReactNode;//是 Next.js 每个页面的实际内容，自动传入布局中
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  creator: siteConfig.creator,
  authors: siteConfig.authors,
  keywords: siteConfig.keywords,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
    type: "website",
    locale: "en_US",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  metadataBase: new URL(siteConfig.url),
};

// <PixelThemeProvider>   {/* ✅ 像素风主题 Provider（控制是否使用像素风） */}
//    └── <ThemeProvider>       // 1️⃣ 提供 dark / light 模式切换功能（来自 shadcn/ui）
//         └── <Providers>      // 2️⃣ 项目统一的全局 Provider（自定义封装） 封装 Session、Theme、PixelTheme、Toast 等全局状态的统一入口（你定义的）

export default function RootLayout({ children, authModal }: RootLayoutProps) {
  return (
    <PixelThemeProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "min-h-screen bg-background pt-12 antialiased",
              inter.className
            )}
          >
            <Providers>
              <Navbar />
              {authModal}
              <div className="container mx-auto h-full max-w-7xl pt-12">
                {children}
              </div>
              <Analytics />
              <TailwindIndicator />
              <Toaster />
            </Providers>
          </body>
        </html>
      </ThemeProvider>
    </PixelThemeProvider>
  );
}