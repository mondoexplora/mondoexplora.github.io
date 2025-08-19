import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { SupportedLanguage } from '@/types'
import './blog.css'
import BlogPostsDisplay from './components/BlogPostsDisplay'

interface BlogPageProps {
  params: Promise<{
    lang: SupportedLanguage
  }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params
  
  const titles = {
    en: 'Travel Blog',
    es: 'Blog de Viajes',
    fr: 'Blog de Voyage',
    it: 'Blog di Viaggio'
  }
  
  const descriptions = {
    en: 'Discover amazing travel stories, tips, and adventures from our community of bloggers at MondoExplora',
    es: 'Descubre increíbles historias de viaje, consejos y aventuras de nuestra comunidad de bloggers en MondoExplora',
    fr: 'Découvrez des histoires de voyage incroyables, des conseils et des aventures de notre communauté de blogueurs chez MondoExplora',
    it: 'Scopri incredibili storie di viaggio, consigli e avventure dalla nostra comunità di blogger su MondoExplora'
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
  }
}

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'it' }
  ]
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params

  const titles = {
    en: 'MondoExplora Travel Blog',
    es: 'Blog de Viajes MondoExplora',
    fr: 'Blog de Voyage MondoExplora',
    it: 'Blog di Viaggio MondoExplora'
  }

  const subtitles = {
    en: 'Discover amazing travel stories, tips, and adventures from our community of bloggers',
    es: 'Descubre increíbles historias de viaje, consejos y aventuras de nuestra comunidad de bloggers',
    fr: 'Découvrez des histoires de voyage incroyables, des conseils et des aventures de notre communauté de blogueurs',
    it: 'Scopri incredibili storie di viaggio, consigli e avventure dalla nostra comunità di blogger'
  }

  const featuredPosts = [
    {
      id: 1,
      title: {
        en: 'Amazing Adventures in Thailand',
        es: 'Increíbles Aventuras en Tailandia',
        fr: 'Aventures Incroyables en Thaïlande',
        it: 'Incredibili Avventure in Thailandia'
      },
      excerpt: {
        en: 'Explore the beautiful beaches, temples, and street food of Thailand...',
        es: 'Explora las hermosas playas, templos y comida callejera de Tailandia...',
        fr: 'Explorez les belles plages, temples et street food de Thaïlande...',
        it: 'Esplora le belle spiagge, templi e street food della Thailandia...'
      },
      slug: 'amazing-adventures-thailand',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      author: 'Travel Blogger',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: {
        en: 'Exploring the Streets of Tokyo',
        es: 'Explorando las Calles de Tokio',
        fr: 'Explorer les Rues de Tokyo',
        it: 'Esplorando le Strade di Tokyo'
      },
      excerpt: {
        en: 'A journey through the vibrant neighborhoods and hidden gems of Tokyo...',
        es: 'Un viaje a través de los vibrantes barrios y joyas ocultas de Tokio...',
        fr: 'Un voyage à travers les quartiers vibrants et les joyaux cachés de Tokyo...',
        it: 'Un viaggio attraverso i quartieri vibranti e i gioielli nascosti di Tokyo...'
      },
      slug: 'exploring-tokyo-streets',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop',
      author: 'Travel Blogger',
      date: '2024-01-10'
    }
  ]

  return (
    <div className="blog-reset">
      <div className="blog-container">
        {/* Blog Header */}
        <header className="blog-header">
          <div className="blog-header-content">
            <Link href={`/${lang}`} className="blog-logo">
              MondoExplora
            </Link>
                         <nav>
               <ul className="blog-nav">
                 <li><Link href={`/${lang}`}>Home</Link></li>
                 <li><Link href={`/${lang}/blog`}>Blog</Link></li>
                 <li><Link href={`/${lang}/blog/login`}>Login</Link></li>
                 <li><Link href={`/${lang}/blog/signup`} className="blog-cta-button">Become a Creator</Link></li>
               </ul>
             </nav>
          </div>
        </header>

        {/* Blog Main Content */}
        <main className="blog-main">
          {/* Hero Section */}
          <section className="blog-hero">
            <div className="blog-hero-content">
              <h1 className="blog-hero-title">{titles[lang]}</h1>
              <p className="blog-hero-subtitle">{subtitles[lang]}</p>
              <div className="blog-hero-actions">
                <Link href={`/${lang}/blog/login`} className="blog-btn blog-btn-primary">
                  {lang === 'en' ? 'Start Writing' : 
                   lang === 'es' ? 'Empezar a Escribir' :
                   lang === 'fr' ? 'Commencer à Écrire' : 'Inizia a Scrivere'}
                </Link>
                <Link href={`/${lang}/blog/signup`} className="blog-btn blog-btn-secondary">
                  {lang === 'en' ? 'Join as Creator' :
                   lang === 'es' ? 'Únete como Creador' :
                   lang === 'fr' ? 'Rejoindre comme Créateur' : 'Unisciti come Creatore'}
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Posts */}
          <section className="blog-featured">
            <div className="blog-section-header">
              <h2>
                {lang === 'en' ? 'Featured Posts' :
                 lang === 'es' ? 'Posts Destacados' :
                 lang === 'fr' ? 'Articles en Vedette' : 'Post in Evidenza'}
              </h2>
            </div>
            <BlogPostsDisplay lang={lang} />
          </section>

          {/* Categories */}
          <section className="blog-categories">
            <div className="blog-section-header">
              <h2>
                {lang === 'en' ? 'Categories' :
                 lang === 'es' ? 'Categorías' :
                 lang === 'fr' ? 'Catégories' : 'Categorie'}
              </h2>
            </div>
            <div className="blog-categories-grid">
              <Link href={`/${lang}/blog/category/adventure`} className="blog-category-card">
                <h3>
                  {lang === 'en' ? 'Adventure' :
                   lang === 'es' ? 'Aventura' :
                   lang === 'fr' ? 'Aventure' : 'Avventura'}
                </h3>
              </Link>
              <Link href={`/${lang}/blog/category/culture`} className="blog-category-card">
                <h3>
                  {lang === 'en' ? 'Culture' :
                   lang === 'es' ? 'Cultura' :
                   lang === 'fr' ? 'Culture' : 'Cultura'}
                </h3>
              </Link>
              <Link href={`/${lang}/blog/category/food`} className="blog-category-card">
                <h3>
                  {lang === 'en' ? 'Food' :
                   lang === 'es' ? 'Comida' :
                   lang === 'fr' ? 'Nourriture' : 'Cibo'}
                </h3>
              </Link>
              <Link href={`/${lang}/blog/category/budget`} className="blog-category-card">
                <h3>
                  {lang === 'en' ? 'Budget Travel' :
                   lang === 'es' ? 'Viaje Económico' :
                   lang === 'fr' ? 'Voyage Économique' : 'Viaggio Economico'}
                </h3>
              </Link>
            </div>
          </section>
        </main>

        {/* Blog Footer */}
        <footer className="blog-footer">
          <div className="blog-footer-content">
            <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
} 