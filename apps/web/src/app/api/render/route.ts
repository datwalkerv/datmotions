export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createJob, updateJob } from '@/lib/render-store'
import { isValidTemplateId } from '@datmotions/motion-engine/metadata'

const RenderRequestSchema = z.object({
  templateId: z.string(),
  props: z.record(z.unknown()),
  format: z.enum(['1920x1080', '1080x1920', '1080x1080']),
  fps: z.union([z.literal(24), z.literal(30), z.literal(60)]),
  durationInFrames: z.number().int().positive().max(600),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = RenderRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }

  const { templateId, props, format, fps, durationInFrames } = parsed.data

  if (!isValidTemplateId(templateId)) {
    return NextResponse.json({ error: 'Unknown template' }, { status: 404 })
  }

  const jobId = crypto.randomUUID()
  const [width, height] = format.split('x').map(Number)

  createJob({
    id: jobId,
    templateId,
    props,
    format,
    fps,
    durationInFrames,
    status: 'queued',
    progress: 0,
    createdAt: new Date().toISOString(),
  })

  const renderPromise = import('@/lib/render-executor').then(({ executeRender }) =>
    executeRender(jobId, { templateId, props, format: { width, height }, fps, durationInFrames })
  )

  renderPromise.catch((err) => {
    updateJob(jobId, { status: 'error', error: String(err) })
  })

  return NextResponse.json({ jobId })
}
