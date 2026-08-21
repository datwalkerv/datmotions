import { z } from 'zod'

const ProjectSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  name: z.string(),
  props: z.record(z.unknown()),
  format: z.enum(['1920x1080', '1080x1920', '1080x1080']),
  fps: z.union([z.literal(24), z.literal(30), z.literal(60)]),
  durationInFrames: z.number().int().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Project = z.infer<typeof ProjectSchema>

const KEY_PREFIX = 'datmotions:project:'

export function saveProject(project: Project): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${KEY_PREFIX}${project.id}`, JSON.stringify(project))
}

export function loadProject(id: string): Project | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${KEY_PREFIX}${id}`)
    if (!raw) return null
    return ProjectSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function loadProjectByTemplateId(templateId: string): Project | null {
  if (typeof window === 'undefined') return null
  const all = listProjects()
  return all.find((p) => p.templateId === templateId) ?? null
}

export function listProjects(): Project[] {
  if (typeof window === 'undefined') return []
  const projects: Project[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(KEY_PREFIX)) continue
    try {
      const raw = localStorage.getItem(key)
      if (raw) projects.push(ProjectSchema.parse(JSON.parse(raw)))
    } catch {
      // skip corrupted entries
    }
  }
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function deleteProject(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${KEY_PREFIX}${id}`)
}

export function generateId(): string {
  return crypto.randomUUID()
}
