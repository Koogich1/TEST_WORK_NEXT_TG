import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Anonymous_Pro } from "next/font/google";
import { TmaProvider } from "@/shared/lib/tma";
import "./globals.css";

const anonymousPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-anonymous-pro",
});

export const metadata: Metadata = {
  title: "Open Foundation",
  description: "Mini-app — Create sustained impact. Support verified projects.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${anonymousPro.variable} font-sans min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <TmaProvider>{children}</TmaProvider>
      </body>
    </html>
  );
}
