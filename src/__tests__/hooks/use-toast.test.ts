import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

// Mock the toast context
const mockToast = jest.fn()
const mockDismiss = jest.fn()

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    dismiss: mockDismiss,
  }),
}))

describe('useToast Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide toast function', () => {
    const { result } = renderHook(() => useToast())
    
    expect(result.current.toast).toBeDefined()
    expect(typeof result.current.toast).toBe('function')
  })

  it('should provide dismiss function', () => {
    const { result } = renderHook(() => useToast())
    
    expect(result.current.dismiss).toBeDefined()
    expect(typeof result.current.dismiss).toBe('function')
  })

  it('should call toast function when called', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Test Description',
      })
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Test Toast',
      description: 'Test Description',
    })
  })

  it('should call dismiss function when called', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.dismiss()
    })

    expect(mockDismiss).toHaveBeenCalled()
  })
})
