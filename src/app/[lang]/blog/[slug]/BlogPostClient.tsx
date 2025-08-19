'use client'

import Link from 'next/link'
import { BlogPost, SupportedLanguage } from '@/types'
import PageTitle from '../components/PageTitle'
import '../blog.css'

interface BlogPostClientProps {
  post: BlogPost
  lang: SupportedLanguage
}

export default function BlogPostClient({ post, lang }: BlogPostClientProps) {
  const navigationLabels = {
    en: {
      backToBlog: 'Back to Blog',
      home: 'Home',
      blog: 'Blog',
      by: 'By',
      publishedOn: 'Published on'
    },
    es: {
      backToBlog: 'Volver al Blog',
      home: 'Inicio',
      blog: 'Blog',
      by: 'Por',
      publishedOn: 'Publicado el'
    },
    fr: {
      backToBlog: 'Retour au Blog',
      home: 'Accueil',
      blog: 'Blog',
      by: 'Par',
      publishedOn: 'Publié le'
    },
    it: {
      backToBlog: 'Torna al Blog',
      home: 'Home',
      blog: 'Blog',
      by: 'Di',
      publishedOn: 'Pubblicato il'
    }
  }

  const labels = navigationLabels[lang]

  return (
    <>
      <PageTitle title={post.title} />
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
                  <li><Link href={`/${lang}`}>{labels.home}</Link></li>
                  <li><Link href={`/${lang}/blog`}>{labels.blog}</Link></li>
                  <li><Link href={`/${lang}/blog/login`}>Login</Link></li>
                  <li><Link href={`/${lang}/blog/signup`} className="blog-cta-button">Become a Creator</Link></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Blog Main Content */}
          <main className="blog-main">
            <div className="blog-content">
              {/* Back to Blog Link */}
              <div className="blog-back-link">
                <Link href={`/${lang}/blog`} className="blog-btn blog-btn-secondary">
                  ← {labels.backToBlog}
                </Link>
              </div>

              {/* Blog Post */}
              <article className="blog-post">
                <header className="blog-post-header">
                  <h1 className="blog-post-title">{post.title}</h1>
                  <div className="blog-post-meta">
                    <span className="blog-post-author">
                      {labels.by} {post.author}
                    </span>
                    <span className="blog-post-date">
                      {labels.publishedOn} {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="blog-post-excerpt">{post.excerpt}</p>
                  )}
                </header>

                <div className="blog-post-content">
                  <div 
                    className="blog-post-body"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  {/* Destinations Section */}
                  {post.destinations && post.destinations.length > 0 && (
                    <section className="blog-destinations-section">
                      <h2>
                        {lang === 'en' ? 'Journey Map' :
                         lang === 'es' ? 'Mapa del Viaje' :
                         lang === 'fr' ? 'Carte du Voyage' : 'Mappa del Viaggio'}
                      </h2>
                      <div className="blog-destinations-list">
                        {post.destinations.map((destination: any, index: number) => (
                          <div key={index} className="blog-destination-item">
                            <div className="blog-destination-header">
                              <div className="blog-destination-number">{index + 1}</div>
                              <h3 className="blog-destination-name">{destination.name}</h3>
                            </div>
                            {destination.content && (
                              <p className="blog-destination-description">{destination.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Images Section */}
                  {post.images && post.images.length > 0 && (
                    <section className="blog-images-section">
                      <h2>
                        {lang === 'en' ? 'Gallery' :
                         lang === 'es' ? 'Galería' :
                         lang === 'fr' ? 'Galerie' : 'Galleria'}
                      </h2>
                      <div className="blog-images-grid">
                        {post.images.map((image: string, index: number) => (
                          <div key={index} className="blog-image-container">
                            <img src={image} alt={`${post.title} - Image ${index + 1}`} className="blog-post-image" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </article>

              {/* Related Posts Section */}
              <section className="blog-related">
                <h2>
                  {lang === 'en' ? 'Related Posts' :
                   lang === 'es' ? 'Posts Relacionados' :
                   lang === 'fr' ? 'Articles Connexes' : 'Post Correlati'}
                </h2>
                <div className="blog-related-posts">
                  {/* This would be populated with actual related posts */}
                  <p>
                    {lang === 'en' ? 'More travel stories coming soon...' :
                     lang === 'es' ? 'Más historias de viaje próximamente...' :
                     lang === 'fr' ? 'Plus d\'histoires de voyage bientôt...' : 'Altre storie di viaggio in arrivo...'}
                  </p>
                </div>
              </section>
            </div>
          </main>

          {/* Blog Footer */}
          <footer className="blog-footer">
            <div className="blog-footer-content">
              <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
} 