'use client'

import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { SupportedLanguage } from '@/types'
import '../blog.css'
import PageTitle from '../components/PageTitle'

interface BlogAdminProps {
  params: Promise<{
    lang: SupportedLanguage
  }>
}

export default function BlogAdmin({ params }: BlogAdminProps) {
  const { lang } = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [success, setSuccess] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
      setPosts(storedPosts)
      setLoading(false)
    }
  }, [])

  const labels = {
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Manage your blog content and settings',
      overview: 'Overview',
      posts: 'Blog Posts',
      users: 'Users',
      settings: 'Settings',
      home: 'Home',
      blog: 'Blog',
      logout: 'Logout'
    },
    es: {
      title: 'Panel de Administración',
      subtitle: 'Gestiona el contenido y configuración de tu blog',
      overview: 'Resumen',
      posts: 'Posts del Blog',
      users: 'Usuarios',
      settings: 'Configuración',
      home: 'Inicio',
      blog: 'Blog',
      logout: 'Cerrar Sesión'
    },
    fr: {
      title: 'Tableau de Bord Admin',
      subtitle: 'Gérez le contenu et les paramètres de votre blog',
      overview: 'Aperçu',
      posts: 'Articles du Blog',
      users: 'Utilisateurs',
      settings: 'Paramètres',
      home: 'Accueil',
      blog: 'Blog',
      logout: 'Déconnexion'
    },
    it: {
      title: 'Dashboard Amministratore',
      subtitle: 'Gestisci il contenuto e le impostazioni del tuo blog',
      overview: 'Panoramica',
      posts: 'Post del Blog',
      users: 'Utenti',
      settings: 'Impostazioni',
      home: 'Home',
      blog: 'Blog',
      logout: 'Logout'
    }
  }

  const currentLabels = labels[lang]

  const handleLogout = () => {
    localStorage.removeItem('currentBlogUser')
    window.location.href = `/${lang}/blog/login`
  }

  return (
    <>
      <PageTitle title={currentLabels.title} />
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
                  <li><Link href={`/${lang}`}>{currentLabels.home}</Link></li>
                  <li><Link href={`/${lang}/blog`}>{currentLabels.blog}</Link></li>
                  <li><button onClick={handleLogout} className="blog-nav-button">{currentLabels.logout}</button></li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Blog Main Content */}
          <main className="blog-main">
            <div className="blog-content">
              <div className="blog-admin-container">
                <div className="blog-admin-header">
                  <h1 className="blog-admin-title">{currentLabels.title}</h1>
                  <p className="blog-admin-subtitle">{currentLabels.subtitle}</p>
                </div>

                {success && (
                  <div className="blog-success-message">
                    {success}
                  </div>
                )}

                {/* Tabs */}
                <div className="blog-tabs">
                  <button
                    className={`blog-tab ${activeTab === 'overview' ? 'blog-tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    {currentLabels.overview}
                  </button>
                  <button
                    className={`blog-tab ${activeTab === 'posts' ? 'blog-tab-active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                  >
                    {currentLabels.posts}
                  </button>
                  <button
                    className={`blog-tab ${activeTab === 'users' ? 'blog-tab-active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    {currentLabels.users}
                  </button>
                  <button
                    className={`blog-tab ${activeTab === 'settings' ? 'blog-tab-active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    {currentLabels.settings}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="blog-tab-content">
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="blog-mb-3">{currentLabels.overview}</h3>
                      <div className="blog-stats-grid">
                        {loading ? (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#666', gridColumn: '1 / -1' }}>
                            <div className="blog-spinner" style={{ margin: '0 auto 1rem' }}></div>
                            <p>Loading stats...</p>
                          </div>
                        ) : (
                          <>
                            <div className="blog-stat-card">
                              <h4>Total Posts</h4>
                              <p className="blog-stat-number">{posts.length}</p>
                            </div>
                            <div className="blog-stat-card">
                              <h4>Published Posts</h4>
                              <p className="blog-stat-number">{posts.filter((post: any) => post.status === 'published').length}</p>
                            </div>
                            <div className="blog-stat-card">
                              <h4>Draft Posts</h4>
                              <p className="blog-stat-number">{posts.filter((post: any) => post.status === 'draft').length}</p>
                            </div>
                            <div className="blog-stat-card">
                              <h4>Total Users</h4>
                              <p className="blog-stat-number">1</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'posts' && (
                    <div>
                      <h3 className="blog-mb-3">{currentLabels.posts}</h3>
                      <div className="blog-table-container">
                        <table className="blog-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                  <div className="blog-spinner" style={{ margin: '0 auto 1rem' }}></div>
                                  <p>Loading posts...</p>
                                </td>
                              </tr>
                            ) : posts.length === 0 ? (
                              <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                  No blog posts found. 
                                  <br />
                                  <Link href={`/${lang}/blog/create`} className="blog-btn blog-btn-primary blog-btn-sm" style={{ marginTop: '1rem' }}>
                                    <i className="fas fa-plus"></i> Create First Post
                                  </Link>
                                </td>
                              </tr>
                            ) : (
                              posts.map((post: any) => (
                                <tr key={post.id}>
                                  <td>{post.title}</td>
                                  <td>
                                    <span className={`blog-status blog-status-${post.status}`}>
                                      {post.status}
                                    </span>
                                  </td>
                                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <div className="blog-actions">
                                      <Link href={`/${lang}/blog/${post.slug}`} className="blog-btn blog-btn-small">
                                        View
                                      </Link>
                                      <button className="blog-btn blog-btn-danger blog-btn-small">
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link href={`/${lang}/blog/create`} className="blog-btn blog-btn-primary">
                          <i className="fas fa-plus"></i> Create New Post
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === 'users' && (
                    <div>
                      <h3 className="blog-mb-3">{currentLabels.users}</h3>
                      <div className="blog-table-container">
                        <table className="blog-table">
                          <thead>
                            <tr>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Admin</td>
                              <td>admin@example.com</td>
                              <td>Today</td>
                              <td>
                                <button className="blog-btn blog-btn-small">Edit</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div>
                      <h3 className="blog-mb-3">{currentLabels.settings}</h3>
                      <p>Settings page coming soon...</p>
                    </div>
                  )}
                </div>
              </div>
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