import { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ tenantSlug: string }> 
}): Promise<Metadata> {
  const { tenantSlug } = await params;
  const tenantName = tenantSlug === 'brewops' ? 'BrewOps Coffee Co.' : 'Mocha & Co.';
  
  return {
    title: `${tenantName} - Online Menu | Order Coffee & Pastries`,
    description: `Browse our specialty coffee menu and order online. Fresh espresso, lattes, cappuccinos, and artisan pastries. QR code ordering available for dine-in customers at ${tenantName}.`,
    keywords: [
      'coffee menu',
      'online coffee ordering',
      'specialty coffee',
      'espresso drinks',
      'cafe menu',
      'QR code menu',
      'mobile ordering',
      tenantName,
      'coffee shop near me',
      'order coffee online',
      'latte menu',
      'cappuccino',
      'artisan coffee',
    ],
    openGraph: {
      title: `${tenantName} - Order Coffee Online`,
      description: `Browse our specialty coffee menu and order for pickup or dine-in at ${tenantName}.`,
      type: 'website',
      images: [
        {
          url: '/menu-og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${tenantName} Coffee Menu`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tenantName} - Coffee Menu`,
      description: 'Browse our specialty coffee menu and order online.',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
