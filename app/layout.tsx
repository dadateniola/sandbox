import type { Metadata } from "next";

// CSS
import "./globals.css";

// Metadata
export const metadata: Metadata = {
  title: "Sandbox",
  description: "A sandbox for testing out new ideas and technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased no-scrollbar">
      <body>{children}</body>
    </html>
  );
}
