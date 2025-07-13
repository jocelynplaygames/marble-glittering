//components/providers.tsx
//提供通用的全局 Provider（如 Toast、Session、QueryClient）等
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
//import { PixelThemeProvider } from "../components/ui/pixel_theme/provider";//加上 Pixel 主题切换逻辑

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
