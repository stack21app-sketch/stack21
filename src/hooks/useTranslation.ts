import { useTranslation as useTranslationContext } from '@/contexts/translation-context'

export function useTranslation(namespace?: string) {
  return useTranslationContext()
}
