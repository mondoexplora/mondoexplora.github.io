// TypeScript types for MondoExplora

export interface Hotel {
  link: string;
  hero_image: string;
  vendor_name: string;
  title: string;
  description: string;
  location_heading: string;
  location_subheading: string;
  price: number;
  value: number;
  discount_percentage?: number;
  original_price?: number;
}

export interface DestinationData {
  city: string;
  country: string;
  description: string;
  hero_title: string;
  hero_image: string;
  hotels: Hotel[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface RouteData {
  origin: string;
  destination: string;
  origin_country: string;
  destination_country: string;
  transport_modes: {
    flight: {
      duration: string;
      price_range: string;
      providers: string[];
    };
    train: {
      duration: string;
      price_range: string;
      providers: string[];
    };
    bus: {
      duration: string;
      price_range: string;
      providers: string[];
    };
    car: {
      duration: string;
      distance: string;
      price_range: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface CountryData {
  name: string;
  code: string;
  description: string;
  hero_title: string;
  hero_image: string;
  popular_destinations: {
    name: string;
    slug: string;
    image: string;
    description: string;
    hotel_count: number;
    hotel_deals: number;
    avg_price: number;
  }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface DealData {
  city: string;
  country: string;
  deals: Hotel[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export type SupportedLanguage = 'es' | 'en' | 'fr' | 'it' | string;

export interface PageProps {
  params: {
    lang?: SupportedLanguage;
    city?: string;
    origin?: string;
    destination?: string;
    country?: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
} 