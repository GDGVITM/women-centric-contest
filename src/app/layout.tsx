import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Break the Loop — Coding Competition",
  description: "Debug buggy code snippets and solve challenges in this team-based coding competition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-animated bg-grid">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        {children}
      </body>
    </html>
  );
}
