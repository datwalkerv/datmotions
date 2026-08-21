import { useEffect } from 'react'
import { delayRender, continueRender } from 'remotion'

const GOOGLE_FONT_QUERIES: Record<string, string> = {
  'space-grotesk': 'Space+Grotesk:wght@300;400;500;600;700',
  'playfair': 'Playfair+Display:ital,wght@0,400;0,700;1,400;1,700',
  'bebas': 'Bebas+Neue',
  'dm-sans': 'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700',
  'syne': 'Syne:wght@400;600;700;800',
  'inter': 'Inter:wght@300;400;500;600;700;800',
  'outfit': 'Outfit:wght@300;400;500;600;700;800',
}

const loaded = new Set<string>()
const loading = new Set<string>()

export function useFont(fontId: string): void {
  useEffect(() => {
    const query = GOOGLE_FONT_QUERIES[fontId]
    if (!query || loaded.has(fontId) || loading.has(fontId)) return
    loading.add(fontId)
    const handle = delayRender(`Loading font: ${fontId}`)
    const url = `https://fonts.googleapis.com/css2?family=${query}&display=swap`
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => { loaded.add(fontId); loading.delete(fontId); continueRender(handle) }
    link.onerror = () => { loading.delete(fontId); continueRender(handle) }
    document.head.appendChild(link)
  }, [fontId])
}

export function getFontFamily(fontId: string): string {
  switch (fontId) {
    case 'space-grotesk': return '"Space Grotesk", system-ui, sans-serif'
    case 'playfair': return '"Playfair Display", Georgia, serif'
    case 'bebas': return '"Bebas Neue", Impact, sans-serif'
    case 'dm-sans': return '"DM Sans", system-ui, sans-serif'
    case 'syne': return '"Syne", system-ui, sans-serif'
    case 'inter': return '"Inter", system-ui, sans-serif'
    case 'outfit': return '"Outfit", system-ui, sans-serif'
    case 'sf-pro-display': return '"SF Pro Display", system-ui, sans-serif'
    case 'fraunces': return '"Fraunces", Georgia, serif'
    default: return 'system-ui, sans-serif'
  }
}

export const FONT_OPTIONS = [
  { value: 'space-grotesk', label: 'Space Grotesk' },
  { value: 'syne', label: 'Syne' },
  { value: 'outfit', label: 'Outfit' },
  { value: 'dm-sans', label: 'DM Sans' },
  { value: 'inter', label: 'Inter' },
  { value: 'bebas', label: 'Bebas Neue' },
  { value: 'playfair', label: 'Playfair Display' },
]
