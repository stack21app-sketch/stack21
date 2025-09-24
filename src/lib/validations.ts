// Validaciones para formularios y datos

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateWorkspaceName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!name || name.trim().length === 0) {
    errors.push('El nombre del workspace es requerido')
  }
  
  if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres')
  }
  
  if (name.length > 50) {
    errors.push('El nombre no puede exceder 50 caracteres')
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    errors.push('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateWorkspaceSlug = (slug: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!slug || slug.trim().length === 0) {
    errors.push('El slug es requerido')
  }
  
  if (slug.length < 3) {
    errors.push('El slug debe tener al menos 3 caracteres')
  }
  
  if (slug.length > 30) {
    errors.push('El slug no puede exceder 30 caracteres')
  }
  
  if (!/^[a-z0-9\-]+$/.test(slug)) {
    errors.push('El slug solo puede contener letras minúsculas, números y guiones')
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('El slug no puede empezar o terminar con guión')
  }
  
  if (slug.includes('--')) {
    errors.push('El slug no puede contener guiones consecutivos')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateProjectName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!name || name.trim().length === 0) {
    errors.push('El nombre del proyecto es requerido')
  }
  
  if (name.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres')
  }
  
  if (name.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateDescription = (description: string, maxLength: number = 500): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (description && description.length > maxLength) {
    errors.push(`La descripción no puede exceder ${maxLength} caracteres`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML básicos
    .replace(/\s+/g, ' ') // Normalizar espacios
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones consecutivos
    .replace(/^-|-$/g, '') // Remover guiones al inicio y final
}

export const validateApiKey = (key: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!key || key.trim().length === 0) {
    errors.push('La clave API es requerida')
  }
  
  if (key.length < 20) {
    errors.push('La clave API debe tener al menos 20 caracteres')
  }
  
  if (key.length > 100) {
    errors.push('La clave API no puede exceder 100 caracteres')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateWorkspaceRole = (role: string): boolean => {
  const validRoles = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']
  return validRoles.includes(role)
}

export const validateWorkflowStatus = (status: string): boolean => {
  const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']
  return validStatuses.includes(status)
}

export const validateProjectStatus = (status: string): boolean => {
  const validStatuses = ['planning', 'development', 'active', 'completed', 'archived']
  return validStatuses.includes(status)
}