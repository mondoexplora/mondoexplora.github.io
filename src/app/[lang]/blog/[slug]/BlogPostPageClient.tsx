'use client'

import { useState, useEffect } from 'react'
import { SupportedLanguage } from '@/types'
import BlogPostClient from './BlogPostClient'

interface BlogPostPageClientProps {
  lang: SupportedLanguage
  slug: string
}

export default function BlogPostPageClient({ lang, slug }: BlogPostPageClientProps) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
    const foundPost = posts.find((p: any) => p.slug === slug)
    
    if (foundPost) {
      setPost(foundPost)
    } else {
      setNotFound(true)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="blog-reset">
        <div className="blog-container">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div className="blog-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="blog-reset">
        <div className="blog-container">
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <h1>Post Not Found</h1>
            <p>The requested blog post could not be found.</p>
            <a href={`/${lang}/blog`} className="blog-btn blog-btn-primary">
              Back to Blog
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <BlogPostClient post={post} lang={lang} />
} 