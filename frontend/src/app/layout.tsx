import type { Metadata } from "next";
import "@/app/ui/theme.scss";
import "./globals.css";
import { techmono } from "./ui/fonts";
import TopNav from "./ui/nav/topnav";

export const metadata: Metadata = {
  title: "MovieDB",
  description: "Movie reviews, suggestions and more - by Haelnorr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body
        className={`${techmono.className} antialiased`}
      >
        <TopNav />
        {children}
      </body>
    </html>
  );
}
