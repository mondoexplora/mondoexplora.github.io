import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import HotelGrid from '@/components/HotelGrid';
import { getDestinationData } from '@/lib/data';
import { SupportedLanguage } from '@/types';

interface DestinationPageProps {
  params: {
    city: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const city = params.city;
  const lang = 'es' as SupportedLanguage; // Default to Spanish for now
  
  const data = await getDestinationData(lang, city);
  
  if (!data) {
    return {
      title: 'Destino no encontrado - MondoExplora',
      description: 'El destino que buscas no está disponible.',
    };
  }

  return {
    title: data.seo.title,
    description: data.seo.description,
    keywords: data.seo.keywords.join(', '),
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const city = params.city;
  const lang = 'es' as SupportedLanguage; // Default to Spanish for now
  
  const data = await getDestinationData(lang, city);
  
  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title={`Hoteles en ${data.city}`}
        subtitle={data.description}
        backgroundImage={data.hero_image}
        location={`${data.city}, ${data.country}`}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hoteles disponibles en {data.city}
          </h2>
          <p className="text-gray-600">
            Encuentra las mejores ofertas en {data.city}, {data.country}
          </p>
        </div>
        
        <HotelGrid 
          hotels={data.hotels} 
        />
      </main>
    </div>
  );
} 