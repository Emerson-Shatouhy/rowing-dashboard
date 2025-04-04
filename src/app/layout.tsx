import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WPI Rowing Dashboard",
  description: "A dashboard for WPI Rowing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

        <Toaster />

        <footer className="mt-auto">
          <div className="flex items-center gap-4 text-sm p-4 border-red-900 w-full bg-red-800 opacity-89 text-white align-bottom">
            Developed by Emerson Shatouhy &apos;25
            <a href="https://github.com/Emerson-Shatouhy/rowing-dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Image src="/github-mark-white.svg" alt="GitHub Logo" width={25} height={25} />
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
