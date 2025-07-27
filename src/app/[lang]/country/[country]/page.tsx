import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { getCountryData } from '@/lib/data';

interface PageProps {
  params: Promise<{
    lang: string;
    country: string;
  }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { lang, country } = await params;
  
  try {
    const countryData = await getCountryData(lang, country);
    
    if (!countryData) {
      console.log(`Country data not found for: ${country}`);
      notFound();
    }

    return (
      <main className="min-h-screen">
        <Hero
          title={countryData.hero_title}
          subtitle={countryData.description}
          backgroundImage={countryData.hero_image}
          location={countryData.name}
        />
        
        <div className="main-content">
          <div className="section-header">
            <h2>Welcome to {countryData.name}</h2>
            <p>{countryData.description}</p>
          </div>
          
          {/* Popular Destinations Section */}
          {countryData.popular_destinations && countryData.popular_destinations.length > 0 && (
            <div className="popular-destinations">
              <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countryData.popular_destinations.map((destination, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{destination.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{destination.description}</p>
                    <div className="text-sm text-gray-500">
                      {destination.hotel_deals} hotel deals from ${destination.avg_price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Country content would go here */}
          <div className="text-center py-8">
            <p className="text-gray-600">More country information coming soon...</p>
          </div>
        </div>
        
        <Footer currentLang={lang} />
      </main>
    );
  } catch (error) {
    console.error(`Error loading country data for ${country}:`, error);
    notFound();
  }
}

// Generate static params for all supported languages and countries
export async function generateStaticParams() {
  const languages = ['en'];
  
  // Get all available countries from the generated JSON files
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const dataDir = path.join(process.cwd(), 'data', 'en', 'country');
    const files = await fs.readdir(dataDir);
    const countries = files
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''));
    
    const params = [];
    for (const lang of languages) {
      for (const country of countries) {
        params.push({ lang, country });
      }
    }
    
    return params;
  } catch (error) {
    console.log('No country files found, using default');
    return [{ lang: 'en', country: 'thailand' }];
  }
} 