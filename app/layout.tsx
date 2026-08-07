import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sync",
  description: "Sync - Smart Scheduling",
  authors: [{ name: "AHNayef", url: "https://github.com/ahnayef" }],
  keywords: [
    "education",
    "school",
    "college",
    "university",
    "scheduling",
    "management",
  ],
  metadataBase: new URL("https://neub-sync.vercel.app"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sync",
    startupImage: [
      {
        url: "/icons/512.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: "https://neub-sync.vercel.app",
    siteName: "Sync",
    images: [
      {
        url: "meta.png",
        width: 177,
        height: 112,
        alt: "Meta Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icons/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/128.png",
        sizes: "128x128",
        type: "image/png",
      },
    ],
  },
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
        <Providers>
          {children}
          <PwaInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
