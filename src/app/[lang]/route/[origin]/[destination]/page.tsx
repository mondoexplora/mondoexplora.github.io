import { notFound } from 'next/navigation';
import Link from 'next/link';
import Hero from '@/components/Hero';
import RouteCTA from '@/components/RouteCTA';
import HotelGrid from '@/components/HotelGrid';
import Footer from '@/components/Footer';
import { getDestinationData, getDestinationUrlData } from '@/lib/data';

interface PageProps {
  params: Promise<{
    lang: string;
    origin: string;
    destination: string;
  }>;
}

export default async function RoutePage({ params }: PageProps) {
  const { lang, origin, destination } = await params;
  
  try {
    // Get destination data for hotels
    const destinationData = await getDestinationData(lang, destination);
    
    // Get destination URL data for affiliate link and country name
    const destinationUrlData = await getDestinationUrlData(destination);
    
    if (!destinationData || !destinationUrlData) {
      notFound();
    }

    // Format display names with proper capitalization
    const formatCityName = (cityName: string) => {
      return cityName
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
    
    const displayOrigin = formatCityName(origin);
    const displayDestination = formatCityName(destination);
    
    // Create headline
    const headline = `${displayOrigin} to ${displayDestination}`;

    return (
      <main className="min-h-screen">
        <Hero
          title={headline}
          subtitle={`Discover the best way to travel from ${displayOrigin} to ${displayDestination}. Compare travel modes and find exclusive hotel deals.`}
          backgroundImage={destinationData.hero_image}
          cta={<RouteCTA origin={origin} destination={destination} lang={lang} affiliateLink={destinationUrlData?.affiliate_link} />}
        />
        
        <div className="main-content">
          {/* Hotel Deals Section */}
          <div className="hotel-section-header">
            <h2>Hotel Deals in {displayDestination}</h2>
            <p>Find the best accommodation options for your stay in {displayDestination}</p>
          </div>
          
          <HotelGrid hotels={destinationData.hotels.slice(0, 6)} lang={lang} />
          
          {/* Related Links Section */}
          <div className="related-links">
            <h3>Explore More</h3>
            <div className="related-links-grid">
              {destinationUrlData && (
                <Link
                  href={`/${lang}/country/${destinationUrlData.country_name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="related-link-card"
                >
                  <h4>{destinationUrlData.country_name} Travel Guide</h4>
                  <p>Discover more destinations and travel information for {destinationUrlData.country_name}</p>
                </Link>
              )}
              
              <Link
                href={`/${lang}/destination/${destination}`}
                className="related-link-card"
              >
                <h4>{displayDestination} Destination Guide</h4>
                <p>Explore {displayDestination} in detail with our comprehensive travel guide</p>
              </Link>
              
              <Link
                href={`/${lang}/travel_modes/${origin}/${destination}`}
                className="related-link-card"
              >
                <h4>Compare Travel Modes</h4>
                <p>Find the best way to travel from {displayOrigin} to {displayDestination}</p>
              </Link>
            </div>
          </div>
        </div>
        
        <Footer currentLang={lang} />
      </main>
    );
  } catch (error) {
    console.error('Error loading route data:', error);
    notFound();
  }
}

// Generate static params for all supported routes
export async function generateStaticParams() {
  const languages = ['en'];
  
  // Define some popular routes
  const routes = [
    { origin: 'madrid', destination: 'barcelona' },
    { origin: 'london', destination: 'paris' },
    { origin: 'new-york', destination: 'los-angeles' },
    { origin: 'tokyo', destination: 'osaka' },
    { origin: 'sydney', destination: 'melbourne' },
    { origin: 'rome', destination: 'milan' },
    { origin: 'berlin', destination: 'munich' },
    { origin: 'bangkok', destination: 'chiang-mai' }
  ];
  
  const params = [];
  for (const lang of languages) {
    for (const route of routes) {
      params.push({
        lang,
        origin: route.origin,
        destination: route.destination
      });
    }
  }
  
  return params;
} 