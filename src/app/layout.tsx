import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import CookieBanner from '@/components/legal/cookie-banner'
import I18nProvider from './i18n-provider'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stack21',
  description: 'La plataforma SaaS definitiva para automatizar tu negocio con IA, facturación inteligente y gestión multi-tenant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <I18nProvider>
            <header style={{display:'flex',justifyContent:'flex-end',padding:'8px 12px'}}>
              <LanguageSwitcher />
            </header>
            {children}
            <CookieBanner />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}
