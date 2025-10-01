# 📚 Sistema RAG + Knowledge Base para Stack21

## 📋 Resumen Ejecutivo

El sistema RAG (Retrieval-Augmented Generation) permite que los agentes de IA consulten documentación interna, políticas empresariales y bases de conocimiento antes de actuar, generando respuestas contextualizadas y precisas.

### **Ventaja Competitiva:**
- ❌ **Competencia:** Requieren copy-paste de documentación o integraciones externas
- ✅ **Stack21:** RAG nativo que aprende de tu documentación automáticamente

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTA DE DOCUMENTOS                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Upload de archivos (PDF, DOCX, MD, TXT)                │ │
│  │  • Conectar con Notion, Google Docs, Confluence           │ │
│  │  │  • Scraping de sitios web                                │ │
│  │  • APIs y documentación técnica                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESAMIENTO                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  1. Chunking inteligente (500-1000 tokens)                │ │
│  │  2. Generación de embeddings (text-embedding-3-large)     │ │
│  │  3. Extracción de metadata (título, fecha, autor)         │ │
│  │  4. Detección de idioma y entidades                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    VECTOR DATABASE                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Pinecone / Qdrant / Weaviate                  │ │
│  │                                                              │ │
│  │  Namespace por Workspace → Aislamiento total               │ │
│  │                                                              │ │
│  │  Índices:                                                   │ │
│  │  • workspace_id                                            │ │
│  │  • document_type                                           │ │
│  │  • created_at                                              │ │
│  │  • tags[]                                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RETRIEVAL + GENERATION                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  1. Query → Embedding                                      │ │
│  │  2. Similarity search (top K chunks)                       │ │
│  │  3. Re-ranking con Cohere/CrossEncoder                     │ │
│  │  4. Inyección de contexto en prompt                        │ │
│  │  5. Generación con LLM (GPT-4/Claude)                      │ │
│  │  6. Citación de fuentes                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementación Técnica

### **1. Ingesta de Documentos**

```typescript
// src/lib/rag/document-ingestion.ts

interface Document {
  id: string
  workspaceId: string
  title: string
  content: string
  type: 'pdf' | 'docx' | 'markdown' | 'txt' | 'url' | 'notion'
  metadata: DocumentMetadata
  source: string
  createdAt: Date
  updatedAt: Date
}

interface DocumentMetadata {
  author?: string
  tags: string[]
  language: string
  pageCount?: number
  wordCount: number
  entities?: Entity[]
  summary?: string
}

class DocumentIngestionService {
  /**
   * Ingesta un documento desde archivo
   */
  async ingestFile(
    workspaceId: string,
    file: File,
    metadata?: Partial<DocumentMetadata>
  ): Promise<Document> {
    // 1. Extraer texto según tipo de archivo
    const text = await this.extractText(file)
    
    // 2. Detectar metadata automáticamente
    const autoMetadata = await this.detectMetadata(text)
    
    // 3. Generar chunks
    const chunks = await this.chunkDocument(text)
    
    // 4. Generar embeddings
    const embeddings = await this.generateEmbeddings(chunks)
    
    // 5. Almacenar en vector DB
    await this.storeInVectorDB(workspaceId, chunks, embeddings, {
      ...autoMetadata,
      ...metadata
    })
    
    // 6. Guardar documento en DB
    return await this.saveDocument({
      workspaceId,
      title: file.name,
      content: text,
      type: this.detectFileType(file),
      metadata: { ...autoMetadata, ...metadata },
      source: file.name
    })
  }
  
  /**
   * Extrae texto de diferentes formatos
   */
  private async extractText(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'pdf':
        return await this.extractFromPDF(file)
      
      case 'docx':
        return await this.extractFromDOCX(file)
      
      case 'md':
      case 'txt':
        return await file.text()
      
      default:
        throw new Error(`Formato no soportado: ${extension}`)
    }
  }
  
  /**
   * Extrae texto de PDF
   */
  private async extractFromPDF(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Usar pdf-parse o API externa
    const response = await fetch('/api/rag/extract-pdf', {
      method: 'POST',
      body: formData
    })
    
    const { text } = await response.json()
    return text
  }
  
  /**
   * Ingesta desde URL (web scraping)
   */
  async ingestURL(
    workspaceId: string,
    url: string,
    options?: IngestOptions
  ): Promise<Document> {
    // 1. Scrapear contenido
    const content = await this.scrapeURL(url)
    
    // 2. Limpiar HTML y extraer texto relevante
    const cleanText = await this.cleanHTML(content)
    
    // 3. Procesar igual que archivo
    return await this.processDocument(workspaceId, {
      title: this.extractTitle(content),
      content: cleanText,
      type: 'url',
      source: url
    })
  }
  
  /**
   * Ingesta desde Notion
   */
  async ingestNotion(
    workspaceId: string,
    notionPageId: string,
    recursive: boolean = false
  ): Promise<Document[]> {
    // 1. Conectar con Notion API
    const notionClient = new Client({
      auth: await this.getNotionToken(workspaceId)
    })
    
    // 2. Obtener página y sub-páginas
    const pages = await this.getNotionPages(
      notionClient,
      notionPageId,
      recursive
    )
    
    // 3. Procesar cada página
    const documents = await Promise.all(
      pages.map(page => this.processNotionPage(workspaceId, page))
    )
    
    return documents
  }
}
```

---

### **2. Chunking Inteligente**

```typescript
// src/lib/rag/chunking.ts

interface Chunk {
  id: string
  documentId: string
  content: string
  startIndex: number
  endIndex: number
  tokens: number
  metadata: ChunkMetadata
}

interface ChunkMetadata {
  section?: string
  heading?: string
  pageNumber?: number
  importance: number // 0-1 score
}

class IntelligentChunker {
  private maxTokens = 512
  private overlapTokens = 50
  
  /**
   * Divide documento en chunks inteligentemente
   */
  async chunkDocument(text: string, documentMetadata?: DocumentMetadata): Promise<Chunk[]> {
    // 1. Detectar estructura del documento
    const structure = await this.detectStructure(text)
    
    // 2. Chunking según estructura
    if (structure.type === 'markdown') {
      return await this.chunkMarkdown(text, structure)
    } else if (structure.type === 'code') {
      return await this.chunkCode(text, structure)
    } else {
      return await this.chunkPlainText(text)
    }
  }
  
  /**
   * Chunking para Markdown (respeta estructura)
   */
  private async chunkMarkdown(text: string, structure: DocumentStructure): Promise<Chunk[]> {
    const chunks: Chunk[] = []
    const sections = this.extractSections(text)
    
    for (const section of sections) {
      // Si la sección es pequeña, es un chunk completo
      if (this.countTokens(section.content) <= this.maxTokens) {
        chunks.push({
          id: generateId(),
          documentId: '',
          content: section.content,
          startIndex: section.startIndex,
          endIndex: section.endIndex,
          tokens: this.countTokens(section.content),
          metadata: {
            section: section.title,
            heading: section.heading,
            importance: this.calculateImportance(section)
          }
        })
      } else {
        // Dividir sección en sub-chunks
        const subChunks = await this.splitLargeSection(section)
        chunks.push(...subChunks)
      }
    }
    
    return chunks
  }
  
  /**
   * Chunking para código (respeta bloques de código)
   */
  private async chunkCode(text: string, structure: DocumentStructure): Promise<Chunk[]> {
    const chunks: Chunk[] = []
    const codeBlocks = this.extractCodeBlocks(text)
    
    for (const block of codeBlocks) {
      // Mantener funciones/clases completas cuando sea posible
      if (block.type === 'function' || block.type === 'class') {
        chunks.push({
          id: generateId(),
          documentId: '',
          content: block.content,
          startIndex: block.startIndex,
          endIndex: block.endIndex,
          tokens: this.countTokens(block.content),
          metadata: {
            section: block.name,
            heading: block.type,
            importance: 0.9 // Código es muy importante
          }
        })
      }
    }
    
    return chunks
  }
  
  /**
   * Chunking para texto plano
   */
  private async chunkPlainText(text: string): Promise<Chunk[]> {
    const chunks: Chunk[] = []
    const sentences = this.splitIntoSentences(text)
    
    let currentChunk = ''
    let currentTokens = 0
    let startIndex = 0
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i]
      const sentenceTokens = this.countTokens(sentence)
      
      if (currentTokens + sentenceTokens > this.maxTokens && currentChunk) {
        // Guardar chunk actual
        chunks.push({
          id: generateId(),
          documentId: '',
          content: currentChunk,
          startIndex,
          endIndex: startIndex + currentChunk.length,
          tokens: currentTokens,
          metadata: { importance: 0.5 }
        })
        
        // Comenzar nuevo chunk con overlap
        const overlapSentences = this.getLastSentences(currentChunk, this.overlapTokens)
        currentChunk = overlapSentences + sentence
        currentTokens = this.countTokens(currentChunk)
        startIndex = startIndex + currentChunk.length - currentTokens
      } else {
        currentChunk += sentence
        currentTokens += sentenceTokens
      }
    }
    
    // Agregar último chunk
    if (currentChunk) {
      chunks.push({
        id: generateId(),
        documentId: '',
        content: currentChunk,
        startIndex,
        endIndex: startIndex + currentChunk.length,
        tokens: currentTokens,
        metadata: { importance: 0.5 }
      })
    }
    
    return chunks
  }
  
  /**
   * Calcula importancia del chunk basándose en:
   * - Posición en documento (intro/conclusión más importantes)
   * - Palabras clave
   * - Longitud
   * - Estructura (headings, etc.)
   */
  private calculateImportance(section: Section): number {
    let score = 0.5
    
    // Títulos y encabezados
    if (section.heading) {
      const level = section.heading.match(/^#+/)?.[0].length || 0
      score += (4 - level) * 0.1 // H1 más importante que H4
    }
    
    // Palabras clave importantes
    const keywords = ['importante', 'clave', 'resumen', 'conclusión', 'requisito']
    const hasKeywords = keywords.some(kw => 
      section.content.toLowerCase().includes(kw)
    )
    if (hasKeywords) score += 0.2
    
    // Posición (inicio y fin más importantes)
    if (section.position < 0.2 || section.position > 0.8) {
      score += 0.1
    }
    
    return Math.min(score, 1.0)
  }
}
```

---

### **3. Generación de Embeddings**

```typescript
// src/lib/rag/embeddings.ts

class EmbeddingService {
  private openai: OpenAI
  private model = 'text-embedding-3-large' // 3072 dimensions
  
  /**
   * Genera embeddings para chunks
   */
  async generateEmbeddings(chunks: Chunk[]): Promise<Embedding[]> {
    // Batch processing para optimizar costos
    const batchSize = 100
    const embeddings: Embedding[] = []
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      const batchEmbeddings = await this.generateBatch(batch)
      embeddings.push(...batchEmbeddings)
    }
    
    return embeddings
  }
  
  private async generateBatch(chunks: Chunk[]): Promise<Embedding[]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: chunks.map(c => c.content)
    })
    
    return response.data.map((embedding, index) => ({
      chunkId: chunks[index].id,
      vector: embedding.embedding,
      model: this.model,
      dimensions: embedding.embedding.length
    }))
  }
  
  /**
   * Genera embedding para query
   */
  async embedQuery(query: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: query
    })
    
    return response.data[0].embedding
  }
}
```

---

### **4. Vector Database (Pinecone)**

```typescript
// src/lib/rag/vector-store.ts

class VectorStore {
  private pinecone: Pinecone
  private index: Index
  
  async initialize() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    })
    
    this.index = this.pinecone.index('stack21-knowledge')
  }
  
  /**
   * Almacena chunks con embeddings
   */
  async upsert(
    workspaceId: string,
    chunks: Chunk[],
    embeddings: Embedding[]
  ): Promise<void> {
    const vectors = chunks.map((chunk, index) => ({
      id: chunk.id,
      values: embeddings[index].vector,
      metadata: {
        workspaceId,
        documentId: chunk.documentId,
        content: chunk.content,
        tokens: chunk.tokens,
        section: chunk.metadata.section,
        heading: chunk.metadata.heading,
        importance: chunk.metadata.importance,
        createdAt: new Date().toISOString()
      }
    }))
    
    // Batch upsert (max 100 vectors por request)
    const batchSize = 100
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize)
      await this.index.namespace(workspaceId).upsert(batch)
    }
  }
  
  /**
   * Busca chunks relevantes
   */
  async query(
    workspaceId: string,
    queryEmbedding: number[],
    options: QueryOptions = {}
  ): Promise<QueryResult[]> {
    const {
      topK = 5,
      minScore = 0.7,
      filter = {}
    } = options
    
    const results = await this.index.namespace(workspaceId).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: {
        workspaceId,
        ...filter
      }
    })
    
    return results.matches
      .filter(match => match.score && match.score >= minScore)
      .map(match => ({
        chunkId: match.id,
        content: match.metadata?.content as string,
        score: match.score || 0,
        metadata: match.metadata as ChunkMetadata
      }))
  }
  
  /**
   * Elimina documento y sus chunks
   */
  async deleteDocument(workspaceId: string, documentId: string): Promise<void> {
    await this.index.namespace(workspaceId).deleteMany({
      documentId
    })
  }
}
```

---

### **5. RAG Query Engine**

```typescript
// src/lib/rag/query-engine.ts

class RAGQueryEngine {
  constructor(
    private vectorStore: VectorStore,
    private embeddingService: EmbeddingService,
    private llm: OpenAI
  ) {}
  
  /**
   * Responde pregunta usando RAG
   */
  async query(
    workspaceId: string,
    question: string,
    options?: RAGOptions
  ): Promise<RAGResponse> {
    // 1. Generar embedding de la pregunta
    const queryEmbedding = await this.embeddingService.embedQuery(question)
    
    // 2. Buscar chunks relevantes
    const relevantChunks = await this.vectorStore.query(
      workspaceId,
      queryEmbedding,
      {
        topK: options?.topK || 5,
        minScore: options?.minScore || 0.7,
        filter: options?.filter
      }
    )
    
    if (relevantChunks.length === 0) {
      return {
        answer: "No encontré información relevante en la base de conocimiento.",
        sources: [],
        confidence: 0
      }
    }
    
    // 3. Re-ranking (opcional pero mejora calidad)
    const rerankedChunks = await this.rerank(question, relevantChunks)
    
    // 4. Construir contexto
    const context = this.buildContext(rerankedChunks)
    
    // 5. Generar respuesta con LLM
    const answer = await this.generateAnswer(question, context)
    
    // 6. Extraer citaciones
    const sources = this.extractSources(rerankedChunks)
    
    return {
      answer,
      sources,
      confidence: this.calculateConfidence(rerankedChunks),
      chunksUsed: rerankedChunks.length
    }
  }
  
  /**
   * Re-ranking con cross-encoder para mejor precisión
   */
  private async rerank(
    query: string,
    chunks: QueryResult[]
  ): Promise<QueryResult[]> {
    // Usar Cohere rerank API o modelo local
    const response = await fetch('https://api.cohere.ai/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'rerank-english-v2.0',
        query,
        documents: chunks.map(c => c.content),
        top_n: 3
      })
    })
    
    const { results } = await response.json()
    
    // Reordenar chunks según scores de reranking
    return results.map((result: any) => chunks[result.index])
  }
  
  /**
   * Construye contexto para el prompt
   */
  private buildContext(chunks: QueryResult[]): string {
    return chunks
      .map((chunk, index) => {
        const source = chunk.metadata.section || chunk.metadata.heading || 'Documento'
        return `[Fuente ${index + 1}: ${source}]\n${chunk.content}\n`
      })
      .join('\n---\n\n')
  }
  
  /**
   * Genera respuesta con LLM
   */
  private async generateAnswer(
    question: string,
    context: string
  ): Promise<string> {
    const prompt = `Eres un asistente experto que responde preguntas basándote ÚNICAMENTE en el contexto proporcionado.

CONTEXTO:
${context}

PREGUNTA: ${question}

INSTRUCCIONES:
1. Responde la pregunta usando solo la información del contexto
2. Si el contexto no contiene información suficiente, dilo claramente
3. Cita las fuentes cuando sea relevante (ej: "Según la Fuente 1...")
4. Sé conciso pero completo
5. Usa bullet points cuando sea apropiado

RESPUESTA:`
    
    const completion = await this.llm.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto que responde basándote en documentación proporcionada.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Baja temperatura para respuestas más precisas
      max_tokens: 500
    })
    
    return completion.choices[0].message.content || ''
  }
  
  /**
   * Extrae información de fuentes
   */
  private extractSources(chunks: QueryResult[]): Source[] {
    return chunks.map(chunk => ({
      documentId: chunk.metadata.documentId,
      section: chunk.metadata.section,
      heading: chunk.metadata.heading,
      score: chunk.score,
      preview: chunk.content.substring(0, 200) + '...'
    }))
  }
  
  /**
   * Calcula confianza de la respuesta
   */
  private calculateConfidence(chunks: QueryResult[]): number {
    if (chunks.length === 0) return 0
    
    // Promedio de scores de los chunks
    const avgScore = chunks.reduce((sum, c) => sum + c.score, 0) / chunks.length
    
    // Penalizar si hay pocos chunks
    const countPenalty = Math.min(chunks.length / 3, 1)
    
    return avgScore * countPenalty
  }
}
```

---

## 📊 Casos de Uso

### **1. Documentación Técnica de APIs**

```typescript
// Usuario sube documentación de API de Stripe
await ingestion.ingestURL(
  workspaceId,
  'https://stripe.com/docs/api'
)

// Agente pregunta antes de integrar
const response = await rag.query(
  workspaceId,
  "¿Cómo creo un customer en Stripe y le asigno un payment method?"
)

// Respuesta con contexto y citas:
// "Para crear un customer en Stripe:
// 1. Usa el endpoint POST /v1/customers (Fuente 1)
// 2. Parámetros requeridos: email, name (Fuente 1)
// 3. Para asignar payment method, usa el campo 'payment_method' al crear el customer o actualiza después con POST /v1/customers/:id (Fuente 2)
// ..."
```

### **2. Políticas Empresariales**

```typescript
// Usuario sube manual de políticas
await ingestion.ingestFile(
  workspaceId,
  policyManualPDF
)

// Workflow respeta políticas automáticamente
const response = await rag.query(
  workspaceId,
  "¿Cuál es el proceso de aprobación para órdenes mayores a $10,000?"
)

// Workflow se auto-configura según la política
```

### **3. Base de Conocimiento de Soporte**

```typescript
// Ingestar toda la documentación de soporte
await ingestion.ingestNotion(
  workspaceId,
  notionPageId,
  recursive: true
)

// Agente de soporte responde tickets automáticamente
const response = await rag.query(
  workspaceId,
  "¿Cómo reseteo mi contraseña?"
)
```

---

## 🚀 Plan de Implementación (3-4 Semanas)

### **Semana 1: Setup e Ingesta Básica**
- [ ] Configurar Pinecone
- [ ] Implementar ingesta de archivos (PDF, TXT, MD)
- [ ] Implementar chunking básico
- [ ] Generar embeddings

### **Semana 2: Vector Store y Query**
- [ ] Integrar Pinecone
- [ ] Implementar query engine básico
- [ ] Testing de similarity search

### **Semana 3: Mejoras y Re-ranking**
- [ ] Implementar re-ranking con Cohere
- [ ] Chunking inteligente (markdown, code)
- [ ] Detección de metadata automática

### **Semana 4: Integraciones y UI**
- [ ] Ingestar desde Notion, Google Docs
- [ ] UI para gestionar knowledge base
- [ ] Integrar con agentes de IA

---

## 💰 Costos Estimados

| Componente | Costo Mensual (10K docs, 100K queries) |
|------------|----------------------------------------|
| Pinecone (Vector DB) | $70-100 |
| OpenAI Embeddings | $20-30 |
| Cohere Reranking | $10-20 |
| Storage (S3) | $5-10 |
| **TOTAL** | **$105-160/mes** |

**Precio al usuario:** $49-99/mes → **Margen: 60-70%** ✅

---

## 🎯 Próximos Pasos

**¿Empezamos con la implementación?** 🚀

- **Opción J:** Setup Pinecone y ingesta básica
- **Opción K:** Implementar query engine completo
- **Opción L:** Crear UI para knowledge base

