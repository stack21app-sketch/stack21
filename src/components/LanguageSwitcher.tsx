"use client"

import React, { useContext } from 'react'
import { I18nContext, Locale } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useContext(I18nContext)

  const change = (l: Locale) => {
    document.cookie = `locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}`
    setLocale?.(l)
  }

  return (
    <div style={{ display: 'inline-flex', gap: 8 }}>
      <button aria-pressed={locale === 'es'} onClick={() => change('es')}>ES</button>
      <button aria-pressed={locale === 'en'} onClick={() => change('en')}>EN</button>
    </div>
  )
}
