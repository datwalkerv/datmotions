'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { X, Download, Loader2 } from 'lucide-react'
import type { TemplateDefinition } from '@datmotions/motion-engine'
import {
  renderInBrowser,
  checkBrowserSupport,
  FORMAT_DIMENSIONS,
  type ExportFormat,
} from '@/lib/web-render'

interface ExportModalProps {
  template: TemplateDefinition<Record<string, unknown>>
  props: Record<string, unknown>
  format: ExportFormat
  fps: number
  durationInFrames: number
  onClose: () => void
}

type ExportStatus = 'idle' | 'rendering' | 'done' | 'error'
type SceneBackground = 'default' | 'green-screen' | 'blue-screen'

const SCENE_BG_OPTIONS: { value: SceneBackground; label: string; color?: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'green-screen', label: 'Green Screen', color: '#00FF00' },
  { value: 'blue-screen', label: 'Blue Screen', color: '#0000FF' },
]

export function ExportModal({
  template,
  props,
  format,
  fps,
  durationInFrames,
  onClose,
}: ExportModalProps) {
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unsupported, setUnsupported] = useState<string | null>(null)
  const [sceneBg, setSceneBg] = useState<SceneBackground>('default')
  const abortRef = useRef<AbortController | null>(null)
  const urlRef = useRef<string | null>(null)

  // WebCodecs is required: Chrome 94+, Firefox 130+, Safari 26+.
  useEffect(() => {
    let cancelled = false
    checkBrowserSupport(format)
      .then((result) => {
        if (cancelled) return
        setUnsupported(
          result.canRender
            ? null
            : result.issues.find((i) => i.severity === 'error')?.message ??
                'This browser cannot render video. Try Chrome, Edge or Firefox.'
        )
      })
      .catch(() => {
        if (!cancelled) setUnsupported('This browser cannot render video. Try Chrome, Edge or Firefox.')
      })
    return () => {
      cancelled = true
    }
  }, [format])

  // Release the blob URL and stop any in-flight render when the modal closes.
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  const startRender = useCallback(async () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
      setDownloadUrl(null)
    }
    setStatus('rendering')
    setProgress(0)
    setError(null)

    const controller = new AbortController()
    abortRef.current = controller

    const bgOverride = SCENE_BG_OPTIONS.find((o) => o.value === sceneBg)?.color
    const exportProps = bgOverride ? { ...props, __chromaBg: bgOverride } : props

    try {
      const blob = await renderInBrowser({
        template,
        props: exportProps,
        format,
        fps,
        durationInFrames,
        onProgress: setProgress,
        signal: controller.signal,
      })
      const url = URL.createObjectURL(blob)
      urlRef.current = url
      setDownloadUrl(url)
      setProgress(1)
      setStatus('done')
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus('idle')
        return
      }
      setStatus('error')
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      abortRef.current = null
    }
  }, [template, props, format, fps, durationInFrames, sceneBg])

  const cancelRender = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const { width: w, height: h } = FORMAT_DIMENSIONS[format]
  const durationSec = (durationInFrames / fps).toFixed(1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-canvas-subtle border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">Export Video</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-5 text-sm text-text-secondary">
          <div className="flex justify-between">
            <span>Resolution</span>
            <span className="text-text-primary font-medium">{w}×{h}</span>
          </div>
          <div className="flex justify-between">
            <span>Frame rate</span>
            <span className="text-text-primary font-medium">{fps} fps</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="text-text-primary font-medium">{durationSec}s ({durationInFrames} frames)</span>
          </div>
          <div className="flex justify-between">
            <span>Format</span>
            <span className="text-text-primary font-medium">H.264 MP4</span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Scene Background</label>
          <div className="flex gap-2">
            {SCENE_BG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSceneBg(opt.value)}
                className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                  sceneBg === opt.value
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-text-secondary hover:text-text-primary hover:border-border-strong'
                }`}
              >
                {opt.color && (
                  <span
                    className="w-3 h-3 rounded-sm flex-none border border-white/20"
                    style={{ backgroundColor: opt.color }}
                  />
                )}
                {opt.label}
              </button>
            ))}
          </div>
          {sceneBg !== 'default' && (
            <p className="mt-1.5 text-xs text-text-muted">
              Background overridden for chroma keying in your video editor.
            </p>
          )}
        </div>

        {unsupported && (
          <p className="mb-3 text-xs text-amber-400">{unsupported}</p>
        )}

        {status === 'idle' && (
          <>
            <button
              onClick={startRender}
              disabled={Boolean(unsupported)}
              className="w-full py-2.5 bg-accent text-canvas font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Render
            </button>
            <p className="mt-2 text-xs text-text-muted text-center">
              Renders locally in your browser — nothing is uploaded.
            </p>
          </>
        )}

        {status === 'rendering' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Loader2 size={14} className="animate-spin text-accent" />
              Rendering… {Math.round(progress * 100)}%
            </div>
            <div className="h-1.5 bg-canvas-raised rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">Keep this tab in the foreground for best speed.</p>
            <button
              onClick={cancelRender}
              className="w-full py-2 bg-canvas-raised border border-border text-text-secondary text-xs rounded-lg hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {status === 'done' && downloadUrl && (
          <a
            href={downloadUrl}
            download={`datmotions-${template.id}.mp4`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-canvas font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Download size={14} />
            Download MP4
          </a>
        )}

        {status === 'error' && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-red-400">{error || 'Render failed.'}</p>
            <button
              onClick={startRender}
              className="w-full py-2.5 bg-canvas-raised border border-border text-text-primary text-sm rounded-lg hover:bg-canvas-subtle transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
