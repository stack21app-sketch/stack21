import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import CookieBanner from '@/components/legal/cookie-banner'
import I18nProvider from './i18n-provider'
import TopHeader from '@/components/layout/TopHeader'
import AppLayout from '@/components/layout/AppLayout'

// Usamos la variante con variable CSS para que tailwind "font-sans" funcione correctamente
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Stack21 - Automatización Inteligente',
  description: 'La plataforma de automatización más potente. Conecta aplicaciones, crea workflows visuales y automatiza tareas repetitivas con IA.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <I18nProvider>
            {/* Contenedor principal limpio */}
            <div className="min-h-screen">
              <TopHeader />
              <AppLayout>
                {children}
              </AppLayout>
            </div>
            <CookieBanner />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}
