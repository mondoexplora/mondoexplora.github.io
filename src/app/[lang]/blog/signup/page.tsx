'use client'

import Link from 'next/link'
import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { SupportedLanguage } from '@/types'
import '../blog.css'
import PageTitle from '../components/PageTitle'

interface BlogSignupProps {
  params: Promise<{
    lang: SupportedLanguage
  }>
}

export default function BlogSignup({ params }: BlogSignupProps) {
  const { lang } = use(params)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const labels = {
    en: {
      title: 'Join MondoExplora Blog',
      subtitle: 'Create your account and start sharing your travel stories',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      invitationCode: 'Invitation Code',
      signup: 'Sign Up',
      haveAccount: 'Already have an account?',
      login: 'Login here',
      home: 'Home',
      blog: 'Blog'
    },
    es: {
      title: 'Únete al Blog MondoExplora',
      subtitle: 'Crea tu cuenta y comienza a compartir tus historias de viaje',
      username: 'Usuario',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      invitationCode: 'Código de Invitación',
      signup: 'Registrarse',
      haveAccount: '¿Ya tienes cuenta?',
      login: 'Inicia sesión aquí',
      home: 'Inicio',
      blog: 'Blog'
    },
    fr: {
      title: 'Rejoignez le Blog MondoExplora',
      subtitle: 'Créez votre compte et commencez à partager vos histoires de voyage',
      username: 'Nom d\'utilisateur',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      invitationCode: 'Code d\'invitation',
      signup: 'S\'inscrire',
      haveAccount: 'Vous avez déjà un compte?',
      login: 'Connectez-vous ici',
      home: 'Accueil',
      blog: 'Blog'
    },
    it: {
      title: 'Unisciti al Blog MondoExplora',
      subtitle: 'Crea il tuo account e inizia a condividere le tue storie di viaggio',
      username: 'Nome utente',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Conferma Password',
      invitationCode: 'Codice di Invito',
      signup: 'Registrati',
      haveAccount: 'Hai già un account?',
      login: 'Accedi qui',
      home: 'Home',
      blog: 'Blog'
    }
  }

  const currentLabels = labels[lang]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(currentLabels.username === 'Username' ? 'Please fill in all fields' : 'Por favor completa todos los campos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(currentLabels.username === 'Username' ? 'Passwords do not match' : 'Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError(currentLabels.username === 'Username' ? 'Password must be at least 6 characters' : 'La contraseña debe tener al menos 6 caracteres')
      return
    }

    // Mock signup logic
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('blogUsers') || '[]')
      const existingUser = users.find((u: any) => u.username === formData.username || u.email === formData.email)

      if (existingUser) {
        setError(currentLabels.username === 'Username' ? 'User already exists' : 'El usuario ya existe')
        return
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        invitationCode: formData.invitationCode,
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('blogUsers', JSON.stringify(users))
      localStorage.setItem('currentBlogUser', JSON.stringify(newUser))

      setSuccess(currentLabels.username === 'Username' ? 'Account created successfully!' : '¡Cuenta creada exitosamente!')
      
      // Redirect to admin dashboard
      setTimeout(() => {
        router.push(`/${lang}/blog/admin`)
      }, 1000)
    } catch (error) {
      setError(currentLabels.username === 'Username' ? 'Signup failed' : 'Error al registrarse')
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
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="blog-form-input"
                        placeholder={currentLabels.username}
                        required
                      />
                    </div>

                    <div className="blog-form-group">
                      <label htmlFor="email" className="blog-form-label">
                        {currentLabels.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="blog-form-input"
                        placeholder={currentLabels.email}
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
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="blog-form-input"
                        placeholder={currentLabels.password}
                        required
                      />
                    </div>

                    <div className="blog-form-group">
                      <label htmlFor="confirmPassword" className="blog-form-label">
                        {currentLabels.confirmPassword}
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="blog-form-input"
                        placeholder={currentLabels.confirmPassword}
                        required
                      />
                    </div>

                    <div className="blog-form-group">
                      <label htmlFor="invitationCode" className="blog-form-label">
                        {currentLabels.invitationCode} <span className="blog-optional">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="invitationCode"
                        name="invitationCode"
                        value={formData.invitationCode}
                        onChange={handleInputChange}
                        className="blog-form-input"
                        placeholder={currentLabels.invitationCode}
                      />
                    </div>

                    <button type="submit" className="blog-btn blog-btn-primary blog-btn-full">
                      {currentLabels.signup}
                    </button>
                  </form>

                  <div className="blog-auth-footer">
                    <p>
                      {currentLabels.haveAccount}{' '}
                      <Link href={`/${lang}/blog/login`} className="blog-link">
                        {currentLabels.login}
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