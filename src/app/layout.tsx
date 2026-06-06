import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandCenterProvider } from "@/components/command-center";
import { AppShell } from "@/components/shell/app-shell";
import { themeIds, defaultThemeId } from "@/lib/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Celestra Research AI — Your AI Strategy Department",
  description:
    "AI-Powered Strategic Intelligence Network. Operate a global intelligence network across markets, competitors, trends, opportunities, and risks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultThemeId}
          themes={themeIds}
          enableSystem={false}
        >
          <CommandCenterProvider>
            <AppShell>{children}</AppShell>
          </CommandCenterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
