"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function TopHeader() {
  const pathname = usePathname()
  const [health, setHealth] = useState<'ok' | 'fail' | 'na'>('na')

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    let isMounted = true
    fetch('/api/health')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(() => {
        if (isMounted) setHealth('ok')
      })
      .catch(() => {
        if (isMounted) setHealth('fail')
      })
    return () => {
      isMounted = false
    }
  }, [])

  if (pathname.startsWith('/dashboard')) return null
  return (
    <header className="flex items-center justify-end gap-3 p-2">
      {process.env.NODE_ENV === 'development' && (
        <span
          aria-label="Estado de salud"
          className={
            health === 'ok'
              ? 'rounded-full w-2.5 h-2.5 bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]'
              : health === 'fail'
              ? 'rounded-full w-2.5 h-2.5 bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.25)]'
              : 'rounded-full w-2.5 h-2.5 bg-gray-400'
          }
          title={health === 'ok' ? 'Healthy' : health === 'fail' ? 'Fail' : 'N/A'}
        />
      )}
      <LanguageSwitcher />
    </header>
  )
}


