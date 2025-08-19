import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { SupportedLanguage, BlogPost } from '@/types'

const postsDirectory = path.join(process.cwd(), 'src/posts')





export function getAllPosts(): BlogPost[] {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const allPostsData: BlogPost[] = []

  // Get all language directories
  const langDirs = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  // Process each language directory
  for (const lang of langDirs) {
    const langPath = path.join(postsDirectory, lang)
    const fileNames = fs.readdirSync(langPath)
    
    const langPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(langPath, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the slug and language
        return {
          id: `${lang}-${slug}`,
          slug,
          content: matterResult.content,
          lang: lang as SupportedLanguage,
          ...matterResult.data,
          createdAt: matterResult.data.date || new Date().toISOString(),
          updatedAt: matterResult.data.date || new Date().toISOString(),
        } as BlogPost
      })

    allPostsData.push(...langPosts)
  }

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostBySlug(slug: string, lang: SupportedLanguage): BlogPost | null {
  try {
    const langPath = path.join(postsDirectory, lang)
    const fullPath = path.join(langPath, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    return {
      id: `${lang}-${slug}`,
      slug,
      content: matterResult.content,
      lang,
      ...matterResult.data,
      createdAt: matterResult.data.date || new Date().toISOString(),
      updatedAt: matterResult.data.date || new Date().toISOString(),
    } as BlogPost
  } catch (error) {
    console.error(`Error reading post ${slug} in ${lang}:`, error)
    return null
  }
}

export function getPublishedPosts(lang?: SupportedLanguage): BlogPost[] {
  const allPosts = getAllPosts()
  const publishedPosts = allPosts.filter(post => post.status === 'published')
  
  if (lang) {
    return publishedPosts.filter(post => post.lang === lang)
  }
  
  return publishedPosts
}

export function getPostsByAuthor(author: string, lang?: SupportedLanguage): BlogPost[] {
  const allPosts = getAllPosts()
  const authorPosts = allPosts.filter(post => post.author === author)
  
  if (lang) {
    return authorPosts.filter(post => post.lang === lang)
  }
  
  return authorPosts
}

export function getPostsByLanguage(lang: SupportedLanguage): BlogPost[] {
  return getAllPosts().filter(post => post.lang === lang)
} 