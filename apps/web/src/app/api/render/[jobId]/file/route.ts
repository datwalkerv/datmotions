export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getJob, deleteJob } from '@/lib/render-store'
import { createReadStream, existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { Readable } from 'stream'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const job = getJob(jobId)

  if (!job || job.status !== 'done' || !job.tmpFilePath) {
    return NextResponse.json({ error: 'File not ready' }, { status: 404 })
  }

  if (!existsSync(job.tmpFilePath)) {
    return NextResponse.json({ error: 'File expired' }, { status: 410 })
  }

  const filePath = job.tmpFilePath
  const stream = createReadStream(filePath)
  const webStream = Readable.toWeb(stream) as ReadableStream

  stream.on('end', async () => {
    try { await unlink(filePath) } catch {}
    deleteJob(jobId)
  })

  return new NextResponse(webStream, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="datmotions-${job.templateId}.mp4"`,
    },
  })
}
