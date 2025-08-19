'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SupportedLanguage } from '@/types'

interface BlogPostsDisplayProps {
  lang: SupportedLanguage
}

export default function BlogPostsDisplay({ lang }: BlogPostsDisplayProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
    const publishedPosts = storedPosts.filter((post: any) => post.status === 'published')
    setPosts(publishedPosts)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="blog-posts-grid">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }}>
          <div className="blog-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading posts...</p>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="blog-posts-grid">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            {lang === 'en' ? 'No posts yet. Be the first to share your travel story!' :
             lang === 'es' ? 'Aún no hay posts. ¡Sé el primero en compartir tu historia de viaje!' :
             lang === 'fr' ? 'Aucun article encore. Soyez le premier à partager votre histoire de voyage !' : 
             'Nessun post ancora. Sii il primo a condividere la tua storia di viaggio!'}
          </p>
          <Link href={`/${lang}/blog/create`} className="blog-btn blog-btn-primary">
            <i className="fas fa-plus"></i> 
            {lang === 'en' ? 'Create First Post' :
             lang === 'es' ? 'Crear Primer Post' :
             lang === 'fr' ? 'Créer le Premier Article' : 'Crea il Primo Post'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-posts-grid">
      {posts.slice(0, 6).map((post) => (
        <article key={post.id} className="blog-post-card">
          <div className="blog-post-image">
            {post.images && post.images[0] ? (
              <img src={post.images[0]} alt={post.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            ) : (
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop" alt="Default" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            )}
          </div>
          <div className="blog-post-content">
            <h3 className="blog-post-title">
              <Link href={`/${lang}/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h3>
            <p className="blog-post-excerpt">{post.description}</p>
            <div className="blog-post-meta">
              <span className="blog-post-author">By {post.author}</span>
              <span className="blog-post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
} 