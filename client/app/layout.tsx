import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Squirtle Chords - Free Guitar Tabs & Chords",
    description: "Discover thousands of free guitar chords and tabs. Upload documents, transpose chords, and learn your favorite songs.",
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-black text-white`}>
                <div className="flex">
                    <Sidebar />
                    <div className="flex-1 flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-1 p-8 ml-64">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
