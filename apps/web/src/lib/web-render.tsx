'use client'
import React from 'react'
import { useCurrentFrame } from 'remotion'
import type { CanRenderMediaOnWebResult } from '@remotion/web-renderer'
import type { TemplateDefinition } from '@datmotions/motion-engine'

export type ExportFormat = '1920x1080' | '1080x1920' | '1080x1080'

export const FORMAT_DIMENSIONS: Record<ExportFormat, { width: number; height: number }> = {
  '1920x1080': { width: 1920, height: 1080 },
  '1080x1920': { width: 1080, height: 1920 },
  '1080x1080': { width: 1080, height: 1080 },
}

// Mirrors the wrapper the editor Player uses, plus the optional chroma-key
// backdrop that the export modal offers.
function createExportComponent(
  template: TemplateDefinition<Record<string, unknown>>,
  width: number,
  height: number
) {
  const Comp = template.component
  return function ExportComposition(inputProps: Record<string, unknown>) {
    const frame = useCurrentFrame()
    const chromaBg = typeof inputProps.__chromaBg === 'string' ? inputProps.__chromaBg : null
    return (
      <div style={{ position: 'relative', width, height, overflow: 'hidden' }}>
        {chromaBg && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: chromaBg }} />
        )}
        <div style={{ position: 'relative' }}>
          <Comp frame={frame} props={inputProps as never} width={width} height={height} />
        </div>
      </div>
    )
  }
}

export interface RenderInBrowserOptions {
  template: TemplateDefinition<Record<string, unknown>>
  props: Record<string, unknown>
  format: ExportFormat
  fps: number
  durationInFrames: number
  onProgress: (progress: number) => void
  signal?: AbortSignal
}

/**
 * Renders a template to an MP4 entirely in the visitor's browser using
 * WebCodecs. No server involved — the app deploys as a static/edge Next.js
 * site with no render backend.
 */
export async function renderInBrowser({
  template,
  props,
  format,
  fps,
  durationInFrames,
  onProgress,
  signal,
}: RenderInBrowserOptions): Promise<Blob> {
  const { width, height } = FORMAT_DIMENSIONS[format]

  const { renderMediaOnWeb } = await import('@remotion/web-renderer')

  const { getBlob } = await renderMediaOnWeb({
    composition: {
      id: template.id,
      component: createExportComponent(template, width, height),
      width,
      height,
      fps,
      durationInFrames,
      calculateMetadata: null,
    },
    inputProps: props,
    container: 'mp4',
    videoCodec: 'h264',
    muted: true,
    onProgress: ({ progress }) => onProgress(progress),
    signal: signal ?? null,
    // Set NEXT_PUBLIC_REMOTION_LICENSE_KEY to a Remotion company key, or to
    // 'free-license' if you qualify (https://remotion.dev/license). Without it
    // the renderer logs a licensing warning to the console.
    licenseKey: process.env.NEXT_PUBLIC_REMOTION_LICENSE_KEY ?? null,
  })

  return getBlob()
}

export async function checkBrowserSupport(
  format: ExportFormat
): Promise<CanRenderMediaOnWebResult> {
  const { width, height } = FORMAT_DIMENSIONS[format]
  const { canRenderMediaOnWeb } = await import('@remotion/web-renderer')
  return canRenderMediaOnWeb({
    container: 'mp4',
    videoCodec: 'h264',
    width,
    height,
    muted: true,
  })
}
