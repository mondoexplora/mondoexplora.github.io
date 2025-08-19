import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { SupportedLanguage } from '@/types'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'
import BlogPostClient from './BlogPostClient'

interface BlogPostPageProps {
  params: Promise<{
    lang: SupportedLanguage
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params
  
  const post = getPostBySlug(slug, lang)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = getPublishedPosts()
  
  return posts.map((post) => ({
    lang: post.lang,
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params
  
  const post = getPostBySlug(slug, lang)
  
  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} lang={lang} />
} 