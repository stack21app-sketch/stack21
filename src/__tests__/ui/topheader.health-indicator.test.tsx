import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import TopHeader from '@/components/layout/TopHeader'

// Simular entorno de desarrollo
beforeAll(() => {
  // @ts-ignore
  process.env.NODE_ENV = 'development'
})

describe('TopHeader health indicator (dev only)', () => {
  it('muestra el indicador de salud en desarrollo', async () => {
    render(<TopHeader />)
    // Debe existir un elemento con aria-label Estado de salud
    await waitFor(() => {
      expect(screen.getByLabelText('Estado de salud')).toBeInTheDocument()
    })
  })
})
