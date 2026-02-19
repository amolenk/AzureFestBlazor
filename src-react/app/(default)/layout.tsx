import type { Metadata } from "next";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/(default)/global.css";

export const metadata: Metadata = {
  title: "Azure Fest - Free one-day event for all things Azure",
  description:
    "Azure Fest NL is a 100% free, single-day, in-person community event for all things Azure.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Azure Fest - Free one-day event for all things Azure",
    description:
      "Azure Fest NL is a 100% free, single-day, in-person community event for all things Azure.",
    url: "https://www.azurefest.nl/",
    siteName: "Azure Fest",
    images: [
      {
        url: "https://www.azurefest.nl/img/2024/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png"
      }
    ]
  },
  icons: {
    icon: "/img/icons/favicon.png",
    apple: "/img/icons/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,700,700i" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Lobster+Two:400,400i,700" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,600,700" rel="stylesheet" />
        <link href="/aos/aos.css" rel="stylesheet" />
        <link href="/bootstrap-icons/bootstrap-icons.min.css" rel="stylesheet" />
      </head>
      <body>
        {children}

        <Script src="/aos/aos.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
