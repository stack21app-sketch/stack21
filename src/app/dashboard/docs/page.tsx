'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BookOpen, 
  Search,
  Star,
  Clock,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowLeft,
  Filter,
  SortAsc,
  ChevronRight,
  Code,
  Zap,
  Plug,
  Brain
} from 'lucide-react'
import { useWorkspace } from '@/hooks/use-workspace'

interface DocSection {
  id: string
  title: string
  description: string
  icon: string
  category: string
  articles: DocArticle[]
}

interface DocArticle {
  id: string
  title: string
  content: string
  lastUpdated: string
  readTime: string
  tags: string[]
}

interface SearchResult {
  section: {
    id: string
    title: string
    icon: string
  }
  article: {
    id: string
    title: string
    description: string
    lastUpdated: string
    readTime: string
    tags: string[]
  }
}

export default function DocsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { currentWorkspace } = useWorkspace()
  const [sections, setSections] = useState<DocSection[]>([])
  const [currentSection, setCurrentSection] = useState<DocSection | null>(null)
  const [currentArticle, setCurrentArticle] = useState<DocArticle | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/docs?type=sections')
      const data = await response.json()
      if (response.ok) {
        setSections(data)
      }
    } catch (error) {
      setError('Error al cargar documentación')
    } finally {
      setLoading(false)
    }
  }

  const fetchSection = async (sectionId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/docs?type=section&sectionId=${sectionId}`)
      const data = await response.json()
      if (response.ok) {
        setCurrentSection(data)
        setCurrentArticle(null)
      }
    } catch (error) {
      setError('Error al cargar sección')
    } finally {
      setLoading(false)
    }
  }

  const fetchArticle = async (sectionId: string, articleId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/docs?type=article&sectionId=${sectionId}&articleId=${articleId}`)
      const data = await response.json()
      if (response.ok) {
        setCurrentArticle(data)
      }
    } catch (error) {
      setError('Error al cargar artículo')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/docs?type=search&q=${encodeURIComponent(query)}`)
      const data = await response.json()
      if (response.ok) {
        setSearchResults(data)
      }
    } catch (error) {
      setError('Error en la búsqueda')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = async (action: 'like' | 'dislike' | 'submit') => {
    if (!currentSection || !currentArticle) return

    try {
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'feedback',
          sectionId: currentSection.id,
          articleId: currentArticle.id,
          feedback: action === 'submit' ? feedback : '',
          rating: action === 'like' ? 5 : action === 'dislike' ? 1 : rating
        }),
      })

      if (response.ok) {
        setFeedback('')
        setRating(0)
      }
    } catch (error) {
      console.error('Error enviando feedback:', error)
    }
  }

  const handleBookmark = async () => {
    if (!currentSection || !currentArticle) return

    try {
      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bookmark',
          sectionId: currentSection.id,
          articleId: currentArticle.id
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setBookmarked(data.bookmarked)
      }
    } catch (error) {
      console.error('Error con bookmark:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics':
        return <BookOpen className="h-5 w-5" />
      case 'api':
        return <Code className="h-5 w-5" />
      case 'integrations':
        return <Plug className="h-5 w-5" />
      case 'ai':
        return <Brain className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (loading && !sections.length) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando documentación...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
              Documentación
            </h1>
            <p className="text-gray-600 mt-2">
              Guías, tutoriales y referencias para usar la plataforma
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar en la documentación..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resultados de búsqueda para "{searchQuery}"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((result, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  fetchSection(result.section.id)
                  fetchArticle(result.section.id, result.article.id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{result.section.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{result.article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{result.article.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {result.article.readTime}
                        </span>
                        <span>{formatDate(result.article.lastUpdated)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!searchResults.length && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Sections */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={currentSection?.id === section.id ? 'default' : 'ghost'}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => fetchSection(section.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{section.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500">
                          {section.articles.length} artículos
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentSection && !currentArticle && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{currentSection.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentSection.title}
                    </h2>
                    <p className="text-gray-600">{currentSection.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSection.articles.map((article) => (
                    <Card 
                      key={article.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => fetchArticle(currentSection.id, article.id)}
                    >
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {article.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {article.readTime}
                            </span>
                            <span>{formatDate(article.lastUpdated)}</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentArticle && (
              <div className="space-y-6">
                {/* Article Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentArticle(null)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentArticle.title}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {currentArticle.readTime}
                        </span>
                        <span>Actualizado: {formatDate(currentArticle.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Article Content */}
                <Card>
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: currentArticle.content
                          .replace(/\n/g, '<br>')
                          .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
                          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
                          .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                          .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
                          .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
                          .replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
                          .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                      }} />
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">¿Te ayudó este artículo?</CardTitle>
                    <CardDescription>
                      Tu feedback nos ayuda a mejorar la documentación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeedback('like')}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Útil
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeedback('dislike')}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        No útil
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Comentarios adicionales (opcional)</label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="¿Qué podemos mejorar en este artículo?"
                        rows={3}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleFeedback('submit')}
                        disabled={!feedback.trim()}
                      >
                        Enviar Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!currentSection && !currentArticle && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Bienvenido a la Documentación
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Selecciona una sección para comenzar a explorar las guías y tutoriales
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {sections.map((section) => (
                      <Badge key={section.id} variant="outline" className="text-sm">
                        {section.icon} {section.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
