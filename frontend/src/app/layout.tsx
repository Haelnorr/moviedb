import "@/app/ui/theme.scss";
import "@/app/globals.css";
import { techmono } from "@/app/ui/fonts";
import TopNav from "@/components/nav/topnav";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";

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
  return (
    <html lang="en" data-bs-theme="dark">
      <body id="root" className={`${techmono.className} antialiased`}>
        <Suspense>
          <TopNav />
          <div className="content">{children}</div>
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
