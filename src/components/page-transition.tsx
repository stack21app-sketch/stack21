'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Transición suave sin overlay que bloquee clicks
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  )
}
