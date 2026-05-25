import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZETA ATS Resume Analyzer",
  description: "AI-Powered Applicant Tracking System Score Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative">
        {children}
        
        {/* ZETA Sovereign Branding Footer */}
        <div className="fixed bottom-4 left-0 w-full flex justify-center pointer-events-none z-50">
          <div className="glass-panel px-6 py-2 rounded-full pointer-events-auto border border-primary/20 bg-background/40 hover:bg-background/80 transition-all duration-300">
            <p className="text-xs md:text-sm font-mono text-muted-foreground">
              Designed & Engineered by <span className="text-gradient font-bold">BALAVIGNESHWARTG</span> | ZETA Sovereign Engine
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
