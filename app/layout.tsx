import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Loop — Schedule Management",
    template: "%s | Loop",
  },
  description:
    "Loop is a modern schedule management app for students and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      style={{
        colorScheme: "dark",
        backgroundColor: "#080c10",
      }}
    >
      <body
        style={{
          backgroundColor: "#080c10",
          color: "#e6edf3",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
