'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/contexts/theme-context'
import { ToastProvider } from '@/components/advanced-toast'
import { PageTransition } from '@/components/page-transition'
import { TranslationProvider } from '@/contexts/translation-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <SessionProvider>
        <ThemeProvider>
          <ToastProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </SessionProvider>
    </TranslationProvider>
  )
}
