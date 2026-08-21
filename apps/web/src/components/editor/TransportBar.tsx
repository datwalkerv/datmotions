'use client'
import React from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface TransportBarProps {
  isPlaying: boolean
  onPlayPause: () => void
  currentFrame: number
  durationInFrames: number
  fps: number
  onSeek: (frame: number) => void
  format: '1920x1080' | '1080x1920' | '1080x1080'
  onFormatChange: (f: '1920x1080' | '1080x1920' | '1080x1080') => void
  onFpsChange: (fps: number) => void
  onDurationChange: (frames: number) => void
  onExport?: () => void
}

function formatTime(frame: number, fps: number): string {
  const totalMs = (frame / fps) * 1000
  const s = Math.floor(totalMs / 1000)
  const ms = Math.floor(totalMs % 1000)
  return `${s}.${String(ms).padStart(3, '0')}s`
}

export function TransportBar({
  isPlaying,
  onPlayPause,
  currentFrame,
  durationInFrames,
  fps,
  onSeek,
  format,
  onFormatChange,
  onFpsChange,
  onDurationChange,
  onExport,
}: TransportBarProps) {
  const progress = durationInFrames > 0 ? currentFrame / durationInFrames : 0

  return (
    <div className="flex-none h-14 border-t border-border bg-canvas flex items-center gap-4 px-4">
      <div className="flex items-center gap-1">
        <button
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          onClick={() => onSeek(0)}
        >
          <SkipBack size={14} />
        </button>
        <button
          className="w-8 h-8 rounded-lg bg-accent text-canvas flex items-center justify-center hover:bg-accent/90 transition-colors"
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          onClick={() => onSeek(durationInFrames - 1)}
        >
          <SkipForward size={14} />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-text-muted tabular-nums w-16">
          {formatTime(currentFrame, fps)}
        </span>
        <div className="flex-1 h-1 bg-canvas-raised rounded-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-accent rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={durationInFrames - 1}
            value={currentFrame}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-xs text-text-muted tabular-nums w-16 text-right">
          {formatTime(durationInFrames, fps)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={format}
          onChange={(e) => onFormatChange(e.target.value as typeof format)}
          className="bg-canvas-subtle border border-border rounded px-2 py-1 text-xs text-text-secondary focus:outline-none"
        >
          <option value="1920x1080">1920×1080 (16:9)</option>
          <option value="1080x1920">1080×1920 (9:16)</option>
          <option value="1080x1080">1080×1080 (1:1)</option>
        </select>

        <select
          value={fps}
          onChange={(e) => onFpsChange(Number(e.target.value))}
          className="bg-canvas-subtle border border-border rounded px-2 py-1 text-xs text-text-secondary focus:outline-none"
        >
          <option value={24}>24fps</option>
          <option value={30}>30fps</option>
          <option value={60}>60fps</option>
        </select>

        <div className="flex items-center gap-1">
          <span className="text-xs text-text-muted">dur:</span>
          <input
            type="number"
            value={durationInFrames}
            min={1}
            max={600}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-16 bg-canvas-subtle border border-border rounded px-2 py-1 text-xs text-text-secondary focus:outline-none text-center"
          />
          <span className="text-xs text-text-muted">f</span>
        </div>
      </div>

      <button
        onClick={onExport}
        className="px-4 py-1.5 bg-accent text-canvas text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        Export
      </button>
    </div>
  )
}
