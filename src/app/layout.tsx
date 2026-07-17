import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "三伏天：40日生存挑战",
  description: "40日夏季生存成长模拟器",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "三伏天" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false,
  themeColor: "#F7F1E8", viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-base">
        <main className="flex-1 pb-24 mx-auto w-full max-w-lg px-4 pt-6">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
