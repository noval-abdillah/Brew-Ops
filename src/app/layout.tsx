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
  title: "BrewOps | AI-Powered Coffee Shop Management SaaS Platform",
  description: "Complete coffee shop management system with smart POS, inventory tracking, staff scheduling, and AI sales predictions. Trusted by 500+ cafes worldwide. Start your free trial today!",
  keywords: [
    "coffee shop management software",
    "cafe POS system",
    "coffee shop inventory management",
    "barista scheduling software",
    "coffee business management",
    "cafe point of sale",
    "coffee shop SaaS",
    "AI sales prediction coffee",
    "restaurant management system",
    "coffee shop analytics",
    "online menu ordering system",
    "QR code menu coffee shop",
    "multi-tenant coffee software",
    "cloud POS system",
    "coffee shop automation"
  ],
  authors: [{ name: "BrewOps Team" }],
  creator: "BrewOps",
  publisher: "BrewOps",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://brewops.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BrewOps | AI-Powered Coffee Shop Management SaaS",
    description: "Transform your coffee business with smart POS, inventory management, and AI predictions. Trusted by 500+ coffee shops worldwide.",
    url: 'https://brewops.com',
    siteName: 'BrewOps',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BrewOps Coffee Shop Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrewOps | AI-Powered Coffee Shop Management',
    description: 'Complete coffee shop management with smart POS, inventory, and AI predictions.',
    images: ['/twitter-image.jpg'],
    creator: '@brewops',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || undefined,
    yandex: process.env.YANDEX_VERIFICATION_CODE || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BrewOps',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: '14-day free trial',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'AI-powered coffee shop management platform with POS, inventory, and sales predictions',
    featureList: [
      'Point of Sale System',
      'Inventory Management',
      'Staff Scheduling',
      'AI Sales Predictions',
      'Online Menu & Ordering',
      'Real-time Analytics',
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#d97706" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
