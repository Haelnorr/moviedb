import type { Metadata, Viewport } from "next";
import "@/app/ui/theme.scss";
import "./globals.css";
import { techmono } from "./ui/fonts";
import TopNav from "@/app/ui/components/nav/topnav";

export const metadata: Metadata = {
    title: "MovieDB",
    description: "Movie reviews, suggestions and more - by Haelnorr",
};

export const viewport: Viewport = {
    initialScale: 1,
    width: "device-width",
}

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en" data-bs-theme="dark">
            <body
                className={`${techmono.className} antialiased`}
            >
                <TopNav />
                <div className="content">
                    {children}
                </div>
            </body>
        </html>
    );
}

export default RootLayout;
