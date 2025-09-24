import { z } from 'zod'

// Simulamos las validaciones básicas
const workflowSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  description: z.string().optional(),
  nodes: z.array(z.any()).default([]),
  connections: z.array(z.any()).default([]),
})

const userSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1, 'Nombre es requerido'),
})

describe('Validations', () => {
  describe('Workflow Schema', () => {
    it('should validate correct workflow data', () => {
      const validWorkflow = {
        name: 'Test Workflow',
        description: 'Test Description',
        nodes: [],
        connections: [],
      }

      const result = workflowSchema.safeParse(validWorkflow)
      expect(result.success).toBe(true)
    })

    it('should reject workflow without name', () => {
      const invalidWorkflow = {
        description: 'Test Description',
        nodes: [],
        connections: [],
      }

      const result = workflowSchema.safeParse(invalidWorkflow)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required')
      }
    })

    it('should provide default values for optional fields', () => {
      const minimalWorkflow = {
        name: 'Test Workflow',
      }

      const result = workflowSchema.safeParse(minimalWorkflow)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.nodes).toEqual([])
        expect(result.data.connections).toEqual([])
      }
    })
  })

  describe('User Schema', () => {
    it('should validate correct user data', () => {
      const validUser = {
        email: 'test@example.com',
        name: 'Test User',
      }

      const result = userSchema.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidUser = {
        email: 'invalid-email',
        name: 'Test User',
      }

      const result = userSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('should reject user without name', () => {
      const invalidUser = {
        email: 'test@example.com',
      }

      const result = userSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required')
      }
    })
  })
})
