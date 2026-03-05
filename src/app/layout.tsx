import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import BottomNav from "@/components/shared/BottomNav";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Water App",
    description: "Water consumption tracker",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
        <main className=" mx-auto min-h-screen pb-24 p-4 space-y-4 bg-white">

            <Header
                streak={12} energy={2950} />

            {children}

        </main>

        <BottomNav />

        </body>
        </html>
    );
}