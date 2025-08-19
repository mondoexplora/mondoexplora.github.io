'use client'

import Link from 'next/link'
import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { SupportedLanguage } from '@/types'
import '../blog.css'
import PageTitle from '../components/PageTitle'

interface BlogLoginProps {
  params: Promise<{
    lang: SupportedLanguage
  }>
}

export default function BlogLogin({ params }: BlogLoginProps) {
  const { lang } = use(params)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const labels = {
    en: {
      title: 'Login to MondoExplora Blog',
      subtitle: 'Access your blog dashboard and start creating content',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      noAccount: "Don't have an account?",
      signup: 'Sign up here',
      home: 'Home',
      blog: 'Blog'
    },
    es: {
      title: 'Iniciar Sesión en MondoExplora Blog',
      subtitle: 'Accede a tu panel de blog y comienza a crear contenido',
      username: 'Usuario',
      password: 'Contraseña',
      login: 'Iniciar Sesión',
      noAccount: '¿No tienes cuenta?',
      signup: 'Regístrate aquí',
      home: 'Inicio',
      blog: 'Blog'
    },
    fr: {
      title: 'Connexion au Blog MondoExplora',
      subtitle: 'Accédez à votre tableau de bord de blog et commencez à créer du contenu',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      login: 'Se connecter',
      noAccount: 'Vous n\'avez pas de compte?',
      signup: 'Inscrivez-vous ici',
      home: 'Accueil',
      blog: 'Blog'
    },
    it: {
      title: 'Accedi al Blog MondoExplora',
      subtitle: 'Accedi alla tua dashboard del blog e inizia a creare contenuti',
      username: 'Nome utente',
      password: 'Password',
      login: 'Accedi',
      noAccount: 'Non hai un account?',
      signup: 'Registrati qui',
      home: 'Home',
      blog: 'Blog'
    }
  }

  const currentLabels = labels[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Simple validation
    if (!username || !password) {
      setError(currentLabels.username === 'Username' ? 'Please fill in all fields' : 'Por favor completa todos los campos')
      return
    }

    // Mock login logic
    try {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('blogUsers') || '[]')
      const user = users.find((u: any) => u.username === username && u.password === password)

      if (user) {
        setSuccess(currentLabels.username === 'Username' ? 'Login successful!' : '¡Inicio de sesión exitoso!')
        localStorage.setItem('currentBlogUser', JSON.stringify(user))
        
        // Redirect to admin dashboard
        setTimeout(() => {
          router.push(`/${lang}/blog/admin`)
        }, 1000)
      } else {
        setError(currentLabels.username === 'Username' ? 'Invalid credentials' : 'Credenciales inválidas')
      }
    } catch (error) {
      setError(currentLabels.username === 'Username' ? 'Login failed' : 'Error al iniciar sesión')
    }
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
                 <li><Link href={`/${lang}/blog/login`}>Login</Link></li>
                 <li><Link href={`/${lang}/blog/signup`} className="blog-cta-button">Become a Creator</Link></li>
               </ul>
             </nav>
            </div>
          </header>

          {/* Blog Main Content */}
          <main className="blog-main">
            <div className="blog-content">
              <div className="blog-auth-container">
                <div className="blog-auth-card">
                  <h1 className="blog-auth-title">{currentLabels.title}</h1>
                  <p className="blog-auth-subtitle">{currentLabels.subtitle}</p>

                  {error && (
                    <div className="blog-error-message">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="blog-success-message">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="blog-auth-form">
                    <div className="blog-form-group">
                      <label htmlFor="username" className="blog-form-label">
                        {currentLabels.username}
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="blog-form-input"
                        placeholder={currentLabels.username}
                        required
                      />
                    </div>

                    <div className="blog-form-group">
                      <label htmlFor="password" className="blog-form-label">
                        {currentLabels.password}
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="blog-form-input"
                        placeholder={currentLabels.password}
                        required
                      />
                    </div>

                    <button type="submit" className="blog-btn blog-btn-primary blog-btn-full">
                      {currentLabels.login}
                    </button>
                  </form>

                  <div className="blog-auth-footer">
                    <p>
                      {currentLabels.noAccount}{' '}
                      <Link href={`/${lang}/blog/signup`} className="blog-link">
                        {currentLabels.signup}
                      </Link>
                    </p>
                  </div>
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