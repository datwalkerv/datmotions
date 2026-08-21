'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { X, Download, Loader2 } from 'lucide-react'

interface ExportModalProps {
  templateId: string
  props: Record<string, unknown>
  format: '1920x1080' | '1080x1920' | '1080x1080'
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
  templateId,
  props,
  format,
  fps,
  durationInFrames,
  onClose,
}: ExportModalProps) {
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sceneBg, setSceneBg] = useState<SceneBackground>('default')

  const startRender = useCallback(async () => {
    setStatus('rendering')
    setProgress(0)
    setError(null)
    const bgOverride = SCENE_BG_OPTIONS.find((o) => o.value === sceneBg)?.color
    const exportProps = bgOverride ? { ...props, __chromaBg: bgOverride } : props
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, props: exportProps, format, fps, durationInFrames }),
      })
      if (!res.ok) throw new Error(await res.text())
      const { jobId: id } = (await res.json()) as { jobId: string }
      setJobId(id)
    } catch (err) {
      setStatus('error')
      setError(String(err))
    }
  }, [templateId, props, format, fps, durationInFrames, sceneBg])

  useEffect(() => {
    if (!jobId || status !== 'rendering') return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/render/${jobId}`)
        const data = (await res.json()) as { status: string; progress?: number; error?: string }
        setProgress(data.progress ?? 0)
        if (data.status === 'done') {
          setStatus('done')
          clearInterval(interval)
        } else if (data.status === 'error') {
          setStatus('error')
          setError(data.error ?? 'Render failed')
          clearInterval(interval)
        }
      } catch {}
    }, 1000)
    return () => clearInterval(interval)
  }, [jobId, status])

  const [w, h] = format.split('x').map(Number)
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

        {status === 'idle' && (
          <button
            onClick={startRender}
            className="w-full py-2.5 bg-accent text-canvas font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors"
          >
            Start Render
          </button>
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
          </div>
        )}

        {status === 'done' && jobId && (
          <a
            href={`/api/render/${jobId}/file`}
            download
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
