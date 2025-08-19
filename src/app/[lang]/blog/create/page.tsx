'use client'

import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { SupportedLanguage } from '@/types'
import '../blog.css'
import PageTitle from '../components/PageTitle'

interface BlogCreateProps {
  params: Promise<{
    lang: SupportedLanguage
  }>
}

interface Destination {
  id: number
  name: string
  content: string
  lat?: number
  lng?: number
}

export default function BlogCreate({ params }: BlogCreateProps) {
  const { lang } = use(params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: 1, name: '', content: '' }
  ])
  const [countries, setCountries] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '', ''])

  const labels = {
    en: {
      title: 'Create New Blog Post',
      subtitle: 'Share your travel adventures with the world',
      home: 'Home',
      blog: 'Blog',
      basicInfo: 'Basic Information',
      postTitle: 'Post Title',
      postTitlePlaceholder: 'Enter an engaging title for your post',
      description: 'Description',
      descriptionPlaceholder: 'Write a brief description of your journey (this will appear in search results)',
      urlSlug: 'URL Slug',
      urlSlugPlaceholder: 'your-awesome-journey (leave empty for auto-generation)',
      urlSlugNote: 'This will create the URL: /blog/your-slug',
      journeyMap: 'Journey Map',
      destination: 'Destination',
      destinationPlaceholder: 'Start typing a destination...',
      whatYouDid: 'What you did there',
      whatYouDidPlaceholder: 'Describe your experience at this destination',
      addStop: 'Add Stop',
      remove: 'Remove',
      routePreview: 'Route Preview',
      mainContent: 'Main Content',
      yourStory: 'Your Story',
      yourStoryPlaceholder: 'Tell your travel story...',
      images: 'Images (3 required)',
      uploadImage: 'Upload Image',
      seoCategories: 'SEO & Categories',
      countriesVisited: 'Countries Visited',
      countriesPlaceholder: 'Start typing a country...',
      countriesNote: 'Select countries from the dropdown',
      tags: 'Tags',
      tagsPlaceholder: 'Add tags...',
      tagsNote: 'Press Enter to add a tag',
      cancel: 'Cancel',
      publishPost: 'Publish Post',
      publishing: 'Publishing...',
      maxDestinations: 'Maximum 15 destinations allowed'
    },
    es: {
      title: 'Crear Nuevo Post del Blog',
      subtitle: 'Comparte tus aventuras de viaje con el mundo',
      home: 'Inicio',
      blog: 'Blog',
      basicInfo: 'Información Básica',
      postTitle: 'Título del Post',
      postTitlePlaceholder: 'Ingresa un título atractivo para tu post',
      description: 'Descripción',
      descriptionPlaceholder: 'Escribe una breve descripción de tu viaje (aparecerá en los resultados de búsqueda)',
      urlSlug: 'Slug de URL',
      urlSlugPlaceholder: 'tu-viaje-increible (deja vacío para generación automática)',
      urlSlugNote: 'Esto creará la URL: /blog/tu-slug',
      journeyMap: 'Mapa del Viaje',
      destination: 'Destino',
      destinationPlaceholder: 'Comienza a escribir un destino...',
      whatYouDid: 'Qué hiciste allí',
      whatYouDidPlaceholder: 'Describe tu experiencia en este destino',
      addStop: 'Agregar Parada',
      remove: 'Eliminar',
      routePreview: 'Vista Previa de la Ruta',
      mainContent: 'Contenido Principal',
      yourStory: 'Tu Historia',
      yourStoryPlaceholder: 'Cuenta tu historia de viaje...',
      images: 'Imágenes (3 requeridas)',
      uploadImage: 'Subir Imagen',
      seoCategories: 'SEO y Categorías',
      countriesVisited: 'Países Visitados',
      countriesPlaceholder: 'Comienza a escribir un país...',
      countriesNote: 'Selecciona países del menú desplegable',
      tags: 'Etiquetas',
      tagsPlaceholder: 'Agregar etiquetas...',
      tagsNote: 'Presiona Enter para agregar una etiqueta',
      cancel: 'Cancelar',
      publishPost: 'Publicar Post',
      publishing: 'Publicando...',
      maxDestinations: 'Máximo 15 destinos permitidos'
    },
    fr: {
      title: 'Créer un Nouvel Article de Blog',
      subtitle: 'Partagez vos aventures de voyage avec le monde',
      home: 'Accueil',
      blog: 'Blog',
      basicInfo: 'Informations de Base',
      postTitle: 'Titre de l\'Article',
      postTitlePlaceholder: 'Entrez un titre accrocheur pour votre article',
      description: 'Description',
      descriptionPlaceholder: 'Écrivez une brève description de votre voyage (apparaîtra dans les résultats de recherche)',
      urlSlug: 'Slug d\'URL',
      urlSlugPlaceholder: 'votre-voyage-incroyable (laissez vide pour la génération automatique)',
      urlSlugNote: 'Cela créera l\'URL: /blog/votre-slug',
      journeyMap: 'Carte du Voyage',
      destination: 'Destination',
      destinationPlaceholder: 'Commencez à taper une destination...',
      whatYouDid: 'Ce que vous avez fait là',
      whatYouDidPlaceholder: 'Décrivez votre expérience à cette destination',
      addStop: 'Ajouter un Arrêt',
      remove: 'Supprimer',
      routePreview: 'Aperçu de l\'Itinéraire',
      mainContent: 'Contenu Principal',
      yourStory: 'Votre Histoire',
      yourStoryPlaceholder: 'Racontez votre histoire de voyage...',
      images: 'Images (3 requises)',
      uploadImage: 'Télécharger une Image',
      seoCategories: 'SEO et Catégories',
      countriesVisited: 'Pays Visités',
      countriesPlaceholder: 'Commencez à taper un pays...',
      countriesNote: 'Sélectionnez les pays dans le menu déroulant',
      tags: 'Tags',
      tagsPlaceholder: 'Ajouter des tags...',
      tagsNote: 'Appuyez sur Entrée pour ajouter un tag',
      cancel: 'Annuler',
      publishPost: 'Publier l\'Article',
      publishing: 'Publication...',
      maxDestinations: 'Maximum 15 destinations autorisées'
    },
    it: {
      title: 'Crea Nuovo Post del Blog',
      subtitle: 'Condividi le tue avventure di viaggio con il mondo',
      home: 'Home',
      blog: 'Blog',
      basicInfo: 'Informazioni di Base',
      postTitle: 'Titolo del Post',
      postTitlePlaceholder: 'Inserisci un titolo accattivante per il tuo post',
      description: 'Descrizione',
      descriptionPlaceholder: 'Scrivi una breve descrizione del tuo viaggio (apparirà nei risultati di ricerca)',
      urlSlug: 'Slug URL',
      urlSlugPlaceholder: 'il-tuo-viaggio-incredibile (lascia vuoto per la generazione automatica)',
      urlSlugNote: 'Questo creerà l\'URL: /blog/tuo-slug',
      journeyMap: 'Mappa del Viaggio',
      destination: 'Destinazione',
      destinationPlaceholder: 'Inizia a digitare una destinazione...',
      whatYouDid: 'Cosa hai fatto lì',
      whatYouDidPlaceholder: 'Descrivi la tua esperienza in questa destinazione',
      addStop: 'Aggiungi Tappa',
      remove: 'Rimuovi',
      routePreview: 'Anteprima del Percorso',
      mainContent: 'Contenuto Principale',
      yourStory: 'La Tua Storia',
      yourStoryPlaceholder: 'Racconta la tua storia di viaggio...',
      images: 'Immagini (3 richieste)',
      uploadImage: 'Carica Immagine',
      seoCategories: 'SEO e Categorie',
      countriesVisited: 'Paesi Visitati',
      countriesPlaceholder: 'Inizia a digitare un paese...',
      countriesNote: 'Seleziona i paesi dal menu a tendina',
      tags: 'Tag',
      tagsPlaceholder: 'Aggiungi tag...',
      tagsNote: 'Premi Invio per aggiungere un tag',
      cancel: 'Annulla',
      publishPost: 'Pubblica Post',
      publishing: 'Pubblicazione...',
      maxDestinations: 'Massimo 15 destinazioni consentite'
    }
  }

  const currentLabels = labels[lang]

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
      setSlug(generatedSlug)
    }
  }, [title, slug])

  // Add destination
  const addDestination = () => {
    if (destinations.length >= 15) {
      alert(currentLabels.maxDestinations)
      return
    }
    const newId = Math.max(...destinations.map(d => d.id)) + 1
    setDestinations([...destinations, { id: newId, name: '', content: '' }])
  }

  // Remove destination
  const removeDestination = (id: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter(d => d.id !== id))
    }
  }

  // Update destination
  const updateDestination = (id: number, field: 'name' | 'content', value: string) => {
    setDestinations(destinations.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ))
  }

  // Handle image upload
  const handleImageUpload = (index: number, file: File) => {
    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)

    const reader = new FileReader()
    reader.onload = (e) => {
      const newPreviews = [...imagePreviews]
      newPreviews[index] = e.target?.result as string
      setImagePreviews(newPreviews)
    }
    reader.readAsDataURL(file)
  }

  // Add country
  const addCountry = (country: string) => {
    if (country && !countries.includes(country)) {
      setCountries([...countries, country])
    }
  }

  // Remove country
  const removeCountry = (country: string) => {
    setCountries(countries.filter(c => c !== country))
  }

  // Add tag
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Validate required fields
      if (!title || !description || !content) {
        throw new Error('Title, description, and content are required')
      }

      if (destinations.length < 1 || destinations[0].name.trim() === '') {
        throw new Error('At least one destination is required')
      }

      if (images.length < 3) {
        throw new Error('Three images are required')
      }

      // Create post data
      const postData = {
        title,
        description,
        content,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-'),
        destinations: destinations.map(d => ({
          name: d.name,
          content: d.content,
          lat: d.lat,
          lng: d.lng
        })),
        countries,
        tags,
        images: imagePreviews.filter(p => p), // Only include uploaded images
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        author: 'Travel Creator', // This would come from user session
        lang
      }

      // Get existing posts from localStorage
      const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
      
      // Add new post
      const newPost = {
        id: Date.now().toString(),
        ...postData
      }
      
      existingPosts.push(newPost)
      localStorage.setItem('blogPosts', JSON.stringify(existingPosts))

      setSuccess('Post created successfully!')
      
      // Reset form
      setTitle('')
      setDescription('')
      setContent('')
      setSlug('')
      setDestinations([{ id: 1, name: '', content: '' }])
      setCountries([])
      setTags([])
      setImages([])
      setImagePreviews(['', '', ''])

      // Redirect to blog after a short delay
      setTimeout(() => {
        window.location.href = `/${lang}/blog`
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
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
              <div className="blog-create-container">
                <div className="blog-create-header">
                  <h1 className="blog-create-title">
                    <i className="fas fa-edit"></i> {currentLabels.title}
                  </h1>
                  <p className="blog-create-subtitle">{currentLabels.subtitle}</p>
                </div>

                {success && (
                  <div className="blog-success-message">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="blog-error-message">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="blog-create-form">
                  {/* Basic Information */}
                  <div className="blog-form-section">
                    <h2 className="blog-section-title">
                      <i className="fas fa-info-circle"></i>
                      {currentLabels.basicInfo}
                    </h2>
                    
                    <div className="blog-form-group">
                      <label htmlFor="title">{currentLabels.postTitle} *</label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="blog-form-control"
                        required
                        placeholder={currentLabels.postTitlePlaceholder}
                      />
                    </div>

                    <div className="blog-form-group">
                      <label htmlFor="description">{currentLabels.description} *</label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="blog-form-control blog-textarea"
                        required
                        placeholder={currentLabels.descriptionPlaceholder}
                      />
                    </div>

                    <div className="blog-form-group">
                      <label htmlFor="slug">{currentLabels.urlSlug}</label>
                      <input
                        type="text"
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="blog-form-control"
                        placeholder={currentLabels.urlSlugPlaceholder}
                      />
                      <small className="blog-form-help">{currentLabels.urlSlugNote}</small>
                    </div>
                  </div>

                  {/* Journey Map */}
                  <div className="blog-form-section">
                    <h2 className="blog-section-title">
                      <i className="fas fa-map-marked-alt"></i>
                      {currentLabels.journeyMap}
                    </h2>
                    
                    {destinations.map((destination, index) => (
                      <div key={destination.id} className="blog-destination-item">
                        <div className="blog-destination-header">
                          <div className="blog-destination-number">{index + 1}</div>
                          {index > 0 && (
                            <button
                              type="button"
                              className="blog-btn blog-btn-danger blog-btn-sm"
                              onClick={() => removeDestination(destination.id)}
                            >
                              <i className="fas fa-trash"></i> {currentLabels.remove}
                            </button>
                          )}
                        </div>
                        
                        <div className="blog-destination-content">
                          <div className="blog-form-group">
                            <label htmlFor={`destination${destination.id}`}>
                              {currentLabels.destination} {index === 0 ? '*' : ''}
                            </label>
                            <input
                              type="text"
                              id={`destination${destination.id}`}
                              value={destination.name}
                              onChange={(e) => updateDestination(destination.id, 'name', e.target.value)}
                              className="blog-form-control"
                              required={index === 0}
                              placeholder={currentLabels.destinationPlaceholder}
                            />
                          </div>
                          
                          <div className="blog-form-group">
                            <label htmlFor={`destination${destination.id}_content`}>
                              {currentLabels.whatYouDid}
                            </label>
                            <textarea
                              id={`destination${destination.id}_content`}
                              value={destination.content}
                              onChange={(e) => updateDestination(destination.id, 'content', e.target.value)}
                              className="blog-form-control"
                              placeholder={currentLabels.whatYouDidPlaceholder}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="blog-btn blog-btn-secondary blog-btn-sm"
                      onClick={addDestination}
                    >
                      <i className="fas fa-plus"></i> {currentLabels.addStop}
                    </button>

                    <div className="blog-map-section">
                      <h3 className="blog-map-title">
                        <i className="fas fa-map"></i> {currentLabels.routePreview}
                      </h3>
                      <div className="blog-map-preview">
                        <div className="blog-map-placeholder">
                          Map preview will be implemented with Google Maps API
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="blog-form-section">
                    <h2 className="blog-section-title">
                      <i className="fas fa-pen-fancy"></i>
                      {currentLabels.mainContent}
                    </h2>
                    
                    <div className="blog-form-group">
                      <label htmlFor="content">{currentLabels.yourStory} *</label>
                      <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="blog-form-control blog-textarea"
                        required
                        placeholder={currentLabels.yourStoryPlaceholder}
                        rows={10}
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="blog-form-section">
                    <h2 className="blog-section-title">
                      <i className="fas fa-images"></i>
                      {currentLabels.images}
                    </h2>
                    
                    <div className="blog-image-upload-section">
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="blog-image-upload-item">
                          <input
                            type="file"
                            id={`image${index + 1}`}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImageUpload(index, file)
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <div
                            className="blog-image-upload-content"
                            onClick={() => document.getElementById(`image${index + 1}`)?.click()}
                          >
                            {imagePreviews[index] ? (
                              <img
                                src={imagePreviews[index]}
                                alt={`Preview ${index + 1}`}
                                className="blog-image-preview"
                              />
                            ) : (
                              <>
                                <i className="fas fa-cloud-upload-alt"></i>
                                <p>{currentLabels.uploadImage} {index + 1}</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO & Categories */}
                  <div className="blog-form-section">
                    <h2 className="blog-section-title">
                      <i className="fas fa-search"></i>
                      {currentLabels.seoCategories}
                    </h2>
                    
                    <div className="blog-countries-tags">
                      <div className="blog-form-group">
                        <label>{currentLabels.countriesVisited} *</label>
                        <div className="blog-tag-input">
                          <input
                            type="text"
                            placeholder={currentLabels.countriesPlaceholder}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const country = e.currentTarget.value.trim()
                                if (country) {
                                  addCountry(country)
                                  e.currentTarget.value = ''
                                }
                              }
                            }}
                          />
                          {countries.map((country) => (
                            <span key={country} className="blog-tag">
                              {country}
                              <i
                                className="fas fa-times"
                                onClick={() => removeCountry(country)}
                              ></i>
                            </span>
                          ))}
                        </div>
                        <small className="blog-form-help">{currentLabels.countriesNote}</small>
                      </div>
                      
                      <div className="blog-form-group">
                        <label>{currentLabels.tags}</label>
                        <div className="blog-tag-input">
                          <input
                            type="text"
                            placeholder={currentLabels.tagsPlaceholder}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const tag = e.currentTarget.value.trim()
                                if (tag) {
                                  addTag(tag)
                                  e.currentTarget.value = ''
                                }
                              }
                            }}
                          />
                          {tags.map((tag) => (
                            <span key={tag} className="blog-tag">
                              {tag}
                              <i
                                className="fas fa-times"
                                onClick={() => removeTag(tag)}
                              ></i>
                            </span>
                          ))}
                        </div>
                        <small className="blog-form-help">{currentLabels.tagsNote}</small>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="blog-form-actions">
                    <Link href={`/${lang}/blog`} className="blog-btn blog-btn-secondary">
                      <i className="fas fa-arrow-left"></i> {currentLabels.cancel}
                    </Link>
                    <button
                      type="submit"
                      className="blog-btn blog-btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="blog-spinner"></div>
                          {currentLabels.publishing}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          {currentLabels.publishPost}
                        </>
                      )}
                    </button>
                  </div>
                </form>
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