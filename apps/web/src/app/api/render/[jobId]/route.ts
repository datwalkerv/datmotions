export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getJob } from '@/lib/render-store'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const job = getJob(jobId)
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }
  return NextResponse.json({
    status: job.status,
    progress: job.progress,
    error: job.error,
  })
}
