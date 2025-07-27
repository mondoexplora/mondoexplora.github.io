import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{
    lang: string;
    origin: string;
    destination: string;
  }>;
}

export default async function TravelModesPage({ params }: PageProps) {
  const { lang, origin, destination } = await params;
  
  // Format origin and destination for display
  const formatLocation = (location: string) => {
    return location.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const displayOrigin = formatLocation(origin);
  const displayDestination = formatLocation(destination);

  return (
    <main className="min-h-screen">
      <Hero
        title={`Transport Options: ${displayOrigin} to ${displayDestination}`}
        subtitle="Compare flights, trains, buses and car rentals"
        backgroundImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop"
      />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-600 text-lg">
            Detailed transport comparison for {displayOrigin} to {displayDestination} will be available soon.
          </p>
          <p className="text-gray-500 mt-2">
            This page will show real-time prices and options for all transport modes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-lg font-semibold mb-2">Flights</h3>
            <p className="text-gray-600 text-sm">Air travel options and prices</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🚄</div>
            <h3 className="text-lg font-semibold mb-2">Trains</h3>
            <p className="text-gray-600 text-sm">Rail connections and schedules</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🚌</div>
            <h3 className="text-lg font-semibold mb-2">Buses</h3>
            <p className="text-gray-600 text-sm">Coach and bus services</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold mb-2">Car Rental</h3>
            <p className="text-gray-600 text-sm">Self-drive options</p>
          </div>
        </div>
      </div>
      
      <Footer currentLang={lang} />
    </main>
  );
}

// Generate static params for travel modes pages
export async function generateStaticParams() {
  const languages = ['en'];
  
  // Popular routes based on destinations from CSV
  const popularRoutes = [
    { origin: 'madrid', destination: 'barcelona' },
    { origin: 'london', destination: 'paris' },
    { origin: 'new-york', destination: 'los-angeles' },
    { origin: 'sydney', destination: 'melbourne' },
    { origin: 'bangkok', destination: 'chiang-mai' },
    { origin: 'tokyo', destination: 'osaka' },
    { origin: 'rome', destination: 'milan' },
    { origin: 'berlin', destination: 'munich' },
    { origin: 'madrid', destination: 'bali' },
    { origin: 'london', destination: 'bangkok' },
    { origin: 'new-york', destination: 'tokyo' },
    { origin: 'sydney', destination: 'singapore' }
  ];
  
  const params = [];
  for (const lang of languages) {
    for (const route of popularRoutes) {
      params.push({
        lang,
        origin: route.origin,
        destination: route.destination
      });
    }
  }
  
  return params;
} 