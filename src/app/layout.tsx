import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {AuthProvider, useAuth} from "./context/AuthContext";
import { useRouter } from "next/navigation";
import {router} from "next/client";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Authentication Frontend",
    description: "Authentication Frontend by Nextjs",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang = "en">
        <body
            className = {`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            <Navbar/>
            <div className = "flex items-center justify-center min-h-screen min-w-full">
                {children}
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
