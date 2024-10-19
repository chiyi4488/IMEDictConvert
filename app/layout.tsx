import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import "@fontsource/noto-sans-tc";
import "./globals.css";



export const metadata: Metadata = {
  title: "輸入法詞庫轉換工具",
  description: "輸入法詞庫轉換工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`antialiased font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
