import { titleRevealDefinition } from './title-reveal/definition'
import { kineticTypographyDefinition } from './kinetic-typography/definition'
import { statCounterDefinition } from './stat-counter/definition'
import { lowerThirdDefinition } from './lower-third/definition'
import { quoteDefinition } from './quote/definition'
import { socialCalloutDefinition } from './social-callout/definition'
import { gradientRevealDefinition } from './gradient-reveal/definition'
import { countdownDefinition } from './countdown/definition'
import { dataChartDefinition } from './data-chart/definition'
import { cinematicTitleDefinition } from './cinematic-title/definition'
import type { TemplateDefinition } from './schema'

const registry = new Map<string, TemplateDefinition<Record<string, unknown>>>()

for (const def of [
  titleRevealDefinition,
  kineticTypographyDefinition,
  statCounterDefinition,
  lowerThirdDefinition,
  quoteDefinition,
  socialCalloutDefinition,
  gradientRevealDefinition,
  countdownDefinition,
  dataChartDefinition,
  cinematicTitleDefinition,
]) {
  registry.set(def.id, def as unknown as TemplateDefinition<Record<string, unknown>>)
}

export function getTemplate(id: string) {
  return registry.get(id)
}

export function getAllTemplates() {
  return Array.from(registry.values())
}
