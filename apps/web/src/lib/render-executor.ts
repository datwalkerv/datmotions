import { updateJob } from './render-store'
import { tmpdir } from 'os'
import { join } from 'path'

interface RenderOptions {
  templateId: string
  props: Record<string, unknown>
  format: { width: number; height: number }
  fps: number
  durationInFrames: number
}

export async function executeRender(jobId: string, options: RenderOptions): Promise<void> {
  updateJob(jobId, { status: 'rendering', progress: 0 })

  try {
    const { bundle } = await import('@remotion/bundler')
    const { renderMedia, selectComposition } = await import('@remotion/renderer')

    const entryPoint = process.env.REMOTION_ENTRY_POINT
    if (!entryPoint) throw new Error('REMOTION_ENTRY_POINT env var not set')

    const bundleLocation = await bundle({
      entryPoint,
    })

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: options.templateId,
      inputProps: options.props,
    })

    const outPath = join(tmpdir(), `render-${jobId}.mp4`)

    await renderMedia({
      composition: {
        ...composition,
        width: options.format.width,
        height: options.format.height,
        fps: options.fps,
        durationInFrames: options.durationInFrames,
      },
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outPath,
      inputProps: options.props,
      onProgress: ({ progress }: { progress: number }) => {
        updateJob(jobId, { progress })
      },
    })

    updateJob(jobId, { status: 'done', progress: 1, tmpFilePath: outPath })
  } catch (err) {
    updateJob(jobId, { status: 'error', error: String(err) })
    throw err
  }
}
