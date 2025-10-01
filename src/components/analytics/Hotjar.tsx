'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface HotjarProps {
  id: string
}

export function Hotjar({ id }: HotjarProps) {
  useEffect(() => {
    // Hotjar tracking code
    if (typeof window !== 'undefined' && id && id !== '1234567') {
      (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj = h.hj || function(...args: any[]) {
          (h.hj.q = h.hj.q || []).push(args)
        }
        h._hjSettings = {
          hjid: id,
          hjsv: 6
        }
        a = o.getElementsByTagName('head')[0]
        r = o.createElement('script')
        r.async = 1
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
        a.appendChild(r)
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
    }
  }, [id])

  return null
}

// Hook para Hotjar
export function useHotjar() {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).hj) {
      (window as any).hj('event', eventName, properties)
    }
  }

  const identifyUser = (userId: string, attributes?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).hj) {
      (window as any).hj('identify', userId, attributes)
    }
  }

  return { trackEvent, identifyUser }
}
