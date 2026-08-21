export type RenderStatus = 'queued' | 'rendering' | 'done' | 'error'

export interface RenderJob {
  id: string
  templateId: string
  props: Record<string, unknown>
  format: '1920x1080' | '1080x1920' | '1080x1080'
  fps: number
  durationInFrames: number
  status: RenderStatus
  progress: number
  tmpFilePath?: string
  error?: string
  createdAt: string
}

// Pinned to globalThis so the same Map instance is shared across all route
// module instances — required in Next.js dev mode where each route gets its
// own webpack module cache, which would otherwise give each route a separate Map.
const g = globalThis as typeof globalThis & { __datmotionsJobs?: Map<string, RenderJob> }
if (!g.__datmotionsJobs) g.__datmotionsJobs = new Map()
const jobs = g.__datmotionsJobs

export function createJob(job: RenderJob): void {
  jobs.set(job.id, job)
}

export function getJob(id: string): RenderJob | undefined {
  return jobs.get(id)
}

export function updateJob(id: string, updates: Partial<RenderJob>): void {
  const job = jobs.get(id)
  if (job) jobs.set(id, { ...job, ...updates })
}

export function deleteJob(id: string): void {
  jobs.delete(id)
}
