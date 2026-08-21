// Server-safe template metadata — no React or Remotion imports.
// Use this in API routes / server code to avoid pulling in client-only code.

export const TEMPLATE_IDS = [
  'title-reveal',
  'kinetic-typography',
  'stat-counter',
  'lower-third',
  'quote',
  'social-callout',
  'gradient-reveal',
  'countdown',
  'data-chart',
  'cinematic-title',
] as const

export type TemplateId = (typeof TEMPLATE_IDS)[number]

export function isValidTemplateId(id: string): id is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(id)
}
