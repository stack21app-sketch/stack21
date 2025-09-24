'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { I18nContext, getDictionary, Locale } from '@/lib/i18n'

export default function I18nProvider({ children, initialLocale = 'es' as Locale }: { children: React.ReactNode, initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    try {
      const cookieLocale = document.cookie
        .split('; ')
        .find((row) => row.startsWith('locale='))
        ?.split('=')[1] as Locale | undefined
      if (cookieLocale && (cookieLocale === 'es' || cookieLocale === 'en')) {
        setLocale(cookieLocale)
      }
    } catch {}
  }, [])

  const dict = useMemo(() => getDictionary(locale), [locale])

  const t = useMemo(() => (key: string) => dict[key] ?? key, [dict])

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}
