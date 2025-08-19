import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';

import Footer from '@/components/Footer';
import { 
  getAllDestinations,
  getAllCountries,
  getDestinationData,
  getCountryData
} from '@/lib/data';
import { SupportedLanguage } from '@/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  
  try {
    // Get ALL destinations and countries to sort properly by hotel count
    const allDestinations = await getAllDestinations(lang as SupportedLanguage);
    const allCountries = await getAllCountries(lang as SupportedLanguage);
    
    // Get full data for each destination and sort by hotel count
    const destinationsWithData = [];
    for (const destSlug of allDestinations) {
      const destData = await getDestinationData(lang as SupportedLanguage, destSlug);
      if (destData) {
        destinationsWithData.push({
          slug: destSlug,
          name: destData.city || destSlug,
          country: destData.country || '',
          image: destData.hero_image,
          avg_price: destData.hotels?.[0]?.price || 0,
          hotel_deals: destData.hotels?.length || 0
        });
      }
    }
    
    // Get full data for each country and sort by destination count
    const countriesWithData = [];
    for (const countrySlug of allCountries) {
      const countryData = await getCountryData(lang as SupportedLanguage, countrySlug);
      if (countryData) {
        countriesWithData.push({
          slug: countrySlug,
          name: countryData.name || countrySlug,
          hero_image: countryData.hero_image,
          description: countryData.description || '',
          popular_destinations: countryData.popular_destinations || []
        });
      }
    }

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero
          title="Discover Amazing Destinations"
          subtitle="Find the best hotel deals and travel routes around the world. Plan your next adventure with exclusive offers and insider tips."
          backgroundImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1748&&auto=format&fit=crop&w=1600&q=80"
          homeHref={`/${lang}`}
        />
        
        <div className="main-content">


                     {/* Popular Destinations Section */}
           <section className="mb-12">
                         <div className="destination-tiles-grid">
               {destinationsWithData
                 .sort((a: any, b: any) => (b.hotel_deals || 0) - (a.hotel_deals || 0))
                 .slice(0, 9)
                 .map((destination: any, index: number) => (
                <Link 
                  key={destination.slug} 
                  href={`/${lang}/destination/${destination.slug}`}
                  className="destination-tile"
                >
                  <div className="destination-tile-image">
                    {destination.image ? (
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="destination-tile-img"
                      />
                    ) : (
                      <div className="destination-tile-placeholder">
                        <span className="destination-tile-icon">🌍</span>
                      </div>
                    )}
                  </div>
                  <div className="destination-tile-info">
                    <h3 className="destination-tile-name">{destination.name}</h3>
                    <p className="destination-tile-country">{destination.country}</p>
                    <div className="destination-tile-stats">
                      <span className="destination-tile-hotels">{destination.hotel_deals || 0} hotels</span>
                      {destination.avg_price > 0 && (
                        <span className="destination-tile-price">From ${destination.avg_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>



                     {/* Popular Countries Section */}
           <section className="mb-12">
                         <div className="destination-tiles-grid">
               {countriesWithData
                 .sort((a: any, b: any) => (b.popular_destinations?.length || 0) - (a.popular_destinations?.length || 0))
                 .slice(0, 9)
                 .map((country: any, index: number) => (
                <Link 
                  key={country.slug} 
                  href={`/${lang}/country/${country.slug}`}
                  className="destination-tile"
                >
                  <div className="destination-tile-image">
                    {country.hero_image ? (
                      <img 
                        src={country.hero_image} 
                        alt={country.name}
                        className="destination-tile-img"
                      />
                    ) : (
                      <div className="destination-tile-placeholder">
                        <span className="destination-tile-icon">🏛️</span>
                      </div>
                    )}
                  </div>
                                     <div className="destination-tile-info">
                     <h3 className="destination-tile-name">{country.name}</h3>
                     <p className="destination-tile-country">{country.description}</p>
                   </div>
                </Link>
              ))}
            </div>
          </section>

          
        </div>
        
        <Footer currentLang={lang} />
      </main>
    );
  } catch (error) {
    console.error('Error loading homepage data:', error);
    notFound();
  }
}

// Generate static params for all supported languages
export async function generateStaticParams() {
  return [
    { lang: 'en' }
  ];
} 