import "@/app/ui/theme.scss";
import "@/app/globals.css";
import { techmono } from "@/app/ui/fonts";
import TopNav from "@/components/nav/topnav";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
export const metadata: Metadata = {
  title: "MovieDB",
  description: "Movie reviews, suggestions and more - by Haelnorr",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const nodeEnv = process.env.NODE_ENV;

  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        {nodeEnv != "production" && (
          <Script
            crossOrigin="anonymous"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
      </head>
      <body id="root" className={`${techmono.className} antialiased`}>
        <TopNav />
        <div className="content">
          <Suspense>{children}</Suspense>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
