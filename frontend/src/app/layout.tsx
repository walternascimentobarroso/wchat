import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/presentation/providers/AppProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "wchat - Modern Chat UI",
  description: "A clean, modern chat interface inspired by ChatGPT and Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 dark:from-[#0d0820] dark:via-[#110c2e] dark:to-[#0f1035]">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
