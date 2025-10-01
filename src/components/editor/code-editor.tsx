'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Copy, 
  Undo, 
  Redo,
  Search,
  Replace,
  FileText,
  Folder,
  Terminal,
  Bug,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Code,
  Palette,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  MoreVertical,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface CodeEditorProps {
  initialCode?: string
  language?: string
  theme?: 'light' | 'dark'
  onCodeChange?: (code: string) => void
  onSave?: (code: string) => void
  onRun?: (code: string) => void
  readOnly?: boolean
  showLineNumbers?: boolean
  showMinimap?: boolean
  fontSize?: number
  tabSize?: number
  wordWrap?: boolean
}

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
  language?: string
  isOpen?: boolean
}

const mockFiles: FileNode[] = [
  {
    id: '1',
    name: 'workflow.js',
    type: 'file',
    language: 'javascript',
    content: `// Workflow de Email Marketing
const workflow = {
  name: "Email Marketing Automation",
  version: "1.0.0",
  triggers: [
    {
      type: "webhook",
      url: "/api/webhooks/email-signup",
      method: "POST"
    }
  ],
  steps: [
    {
      id: "validate-email",
      type: "validation",
      config: {
        field: "email",
        pattern: "^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$"
      }
    },
    {
      id: "add-to-list",
      type: "database",
      config: {
        operation: "insert",
        table: "subscribers",
        data: {
          email: "{{trigger.email}}",
          created_at: "{{now}}",
          source: "website"
        }
      }
    },
    {
      id: "send-welcome",
      type: "email",
      config: {
        template: "welcome-email",
        to: "{{trigger.email}}",
        subject: "¡Bienvenido a nuestra plataforma!",
        variables: {
          name: "{{trigger.name}}",
          email: "{{trigger.email}}"
        }
      }
    }
  ]
};

module.exports = workflow;`
  },
  {
    id: '2',
    name: 'templates',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '3',
        name: 'welcome-email.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bienvenido</title>
</head>
<body>
    <h1>¡Bienvenido {{name}}!</h1>
    <p>Gracias por unirte a nuestra plataforma.</p>
    <p>Tu email: {{email}}</p>
</body>
</html>`
      },
      {
        id: '4',
        name: 'newsletter.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Newsletter</title>
</head>
<body>
    <h1>Nuestro Newsletter</h1>
    <p>Contenido del newsletter...</p>
</body>
</html>`
      }
    ]
  },
  {
    id: '5',
    name: 'config.json',
    type: 'file',
    language: 'json',
    content: `{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "workflow_db"
  },
  "email": {
    "provider": "sendgrid",
    "api_key": "{{env.SENDGRID_API_KEY}}"
  },
  "webhooks": {
    "base_url": "https://api.stack21.com",
    "timeout": 30000
  }
}`
  }
]

export default function CodeEditor({
  initialCode = '',
  language = 'javascript',
  theme = 'light',
  onCodeChange,
  onSave,
  onRun,
  readOnly = false,
  showLineNumbers = true,
  showMinimap = true,
  fontSize = 14,
  tabSize = 2,
  wordWrap = true
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(mockFiles[0])
  const [files, setFiles] = useState<FileNode[]>(mockFiles)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [showOutput, setShowOutput] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [selectedText, setSelectedText] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (selectedFile?.content) {
      setCode(selectedFile.content)
      setLanguage(selectedFile.language || 'javascript')
    }
  }, [selectedFile])

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code)
    }
  }, [code, onCodeChange])

  const setLanguage = (lang: string) => {
    // Simular cambio de lenguaje
    console.log('Language changed to:', lang)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    
    // Agregar al historial
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newCode)
      return newHistory.slice(-50) // Mantener solo los últimos 50 cambios
    })
    setHistoryIndex(prev => prev + 1)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(code)
    }
    
    // Actualizar archivo actual
    if (selectedFile) {
      setFiles(prev => updateFileContent(prev, selectedFile.id, code))
    }
    
    console.log('Code saved')
  }

  const handleRun = async () => {
    setIsRunning(true)
    setErrors([])
    setOutput([])
    
    try {
      // Simular ejecución
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular output
      const mockOutput = [
        '✓ Workflow validado correctamente',
        '✓ Conexión a base de datos establecida',
        '✓ Template de email cargado',
        '✓ Webhook configurado en /api/webhooks/email-signup',
        '✓ Workflow desplegado exitosamente'
      ]
      
      setOutput(mockOutput)
      setShowOutput(true)
    } catch (error) {
      setErrors([`Error: ${error}`])
    } finally {
      setIsRunning(false)
    }
  }

  const updateFileContent = (files: FileNode[], fileId: string, content: string): FileNode[] => {
    return files.map(file => {
      if (file.id === fileId) {
        return { ...file, content }
      }
      if (file.children) {
        return { ...file, children: updateFileContent(file.children, fileId, content) }
      }
      return file
    })
  }

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file)
    } else {
      // Toggle folder
      setFiles(prev => toggleFolder(prev, file.id))
    }
  }

  const toggleFolder = (files: FileNode[], folderId: string): FileNode[] => {
    return files.map(file => {
      if (file.id === folderId) {
        return { ...file, isOpen: !file.isOpen }
      }
      if (file.children) {
        return { ...file, children: toggleFolder(file.children, folderId) }
      }
      return file
    })
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setCode(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setCode(history[historyIndex + 1])
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const handleSearch = () => {
    if (searchTerm) {
      const lines = code.split('\n')
      const results = lines
        .map((line, index) => ({ line: index + 1, content: line }))
        .filter(({ content }) => content.toLowerCase().includes(searchTerm.toLowerCase()))
      
      console.log('Search results:', results)
    }
  }

  const handleReplace = () => {
    if (searchTerm && replaceTerm) {
      const newCode = code.replace(new RegExp(searchTerm, 'g'), replaceTerm)
      setCode(newCode)
    }
  }

  const getLanguageIcon = (lang?: string) => {
    switch (lang) {
      case 'javascript': return '🟨'
      case 'html': return '🟧'
      case 'css': return '🟦'
      case 'json': return '🟫'
      case 'python': return '🐍'
      case 'java': return '☕'
      case 'typescript': return '🔷'
      default: return '📄'
    }
  }

  const renderFileTree = (files: FileNode[], level = 0) => {
    return files.map(file => (
      <div key={file.id} className="select-none">
        <div
          className={`flex items-center space-x-2 py-1 px-2 cursor-pointer hover:bg-gray-100 rounded ${
            selectedFile?.id === file.id ? 'bg-blue-100' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => handleFileSelect(file)}
        >
          {file.type === 'folder' ? (
            file.isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
          
          <span className="text-sm">
            {file.type === 'folder' ? '📁' : getLanguageIcon(file.language)}
          </span>
          
          <span className="text-sm text-gray-700">{file.name}</span>
        </div>
        
        {file.type === 'folder' && file.isOpen && file.children && (
          <div>
            {renderFileTree(file.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className={`flex flex-col h-full bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-blue-500" />
              Editor de Código
            </CardTitle>
            
            {selectedFile && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {getLanguageIcon(selectedFile.language)} {selectedFile.name}
                </span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {selectedFile.language || 'text'}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplace(!showReplace)}
            >
              <Replace className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search/Replace Bar */}
        {(showSearch || showReplace) && (
          <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              {showReplace && (
                <div className="flex-1">
                  <Input
                    placeholder="Reemplazar con..."
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                  />
                </div>
              )}
              <Button onClick={handleSearch} size="sm">
                Buscar
              </Button>
              {showReplace && (
                <Button onClick={handleReplace} size="sm">
                  Reemplazar
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSearch(false)
                  setShowReplace(false)
                }}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Explorador de Archivos</h3>
            <div className="space-y-1">
              {renderFileTree(files)}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              readOnly={readOnly}
              className="w-full h-full p-4 font-mono text-sm resize-none border-0 focus:outline-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
                tabSize: tabSize
              }}
              placeholder="Escribe tu código aquí..."
              onSelect={(e) => {
                const target = e.target as HTMLTextAreaElement
                const start = target.selectionStart
                const end = target.selectionEnd
                setSelectedText(code.substring(start, end))
                
                // Calcular posición del cursor
                const textBeforeCursor = code.substring(0, start)
                const lines = textBeforeCursor.split('\n')
                setCursorPosition({
                  line: lines.length,
                  column: lines[lines.length - 1].length + 1
                })
              }}
            />
            
            {/* Line Numbers */}
            {showLineNumbers && (
              <div className="absolute left-0 top-0 h-full w-12 bg-gray-100 border-r border-gray-200 p-4 font-mono text-xs text-gray-500 select-none">
                {code.split('\n').map((_, index) => (
                  <div key={index} className="h-5 leading-5">
                    {index + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Línea {cursorPosition.line}, Columna {cursorPosition.column}</span>
              <span>{code.split('\n').length} líneas</span>
              <span>{code.length} caracteres</span>
              {selectedText && <span>{selectedText.length} seleccionados</span>}
            </div>
            
            <div className="flex items-center space-x-4">
              <span>{selectedFile?.language || 'text'}</span>
              <span>UTF-8</span>
              <span>Espacios: {tabSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      {showOutput && (
        <div className="border-t border-gray-200 bg-gray-900 text-green-400 p-4 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center">
              <Terminal className="h-4 w-4 mr-2" />
              Output
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOutput(false)}
              className="text-green-400 hover:text-green-300"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-1 font-mono text-sm">
            {output.map((line, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                {line}
              </div>
            ))}
          </div>
          
          {errors.length > 0 && (
            <div className="mt-4 space-y-1">
              <div className="text-red-400 font-medium">Errores:</div>
              {errors.map((error, index) => (
                <div key={index} className="flex items-center text-red-400">
                  <AlertCircle className="h-3 w-3 mr-2" />
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
