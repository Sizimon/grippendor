import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import CustomThemeProvider from "@/theme/ThemeProvider";
import Provider from "../context/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grippendor",
  description: "A bot for managing Discord servers with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CustomThemeProvider>
          <Provider>
            {children}
          </Provider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
