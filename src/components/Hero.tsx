import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  location?: string;
  cta?: ReactNode;
  homeHref?: string;
}

export default function Hero({ title, subtitle, backgroundImage, location, cta, homeHref }: HeroProps) {
  return (
    <div className="hero-section" style={{ backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(42, 63, 89, 0.8) 100%), url(${backgroundImage})` }}>
      <div className="page-header">
        {/* Logo en la esquina superior derecha */}
        <Link href={homeHref ?? '/en'} className="logo-overlay" aria-label="MondoExplora Home">
          <span>Mondo</span>
          <span>Explora</span>
        </Link>
        
        <div className="text-center text-white">
          <h1 className="page-header h1">
            {title}
          </h1>
          
          {subtitle && (
            <p className="page-header p">
              {subtitle}
            </p>
          )}
          
          {location && (
            <p className="text-sm text-gray-300 mb-6">
              📍 {location}
            </p>
          )}
          
          {cta && (
            <div className="mt-20">
              {cta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 