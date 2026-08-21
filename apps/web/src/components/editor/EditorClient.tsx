'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { getTemplate, type TemplateDefinition } from '@datmotions/motion-engine'
import { PropertyInspector } from './PropertyInspector'
import { MotionCanvas } from './MotionCanvas'
import { TransportBar } from './TransportBar'
import { ExportModal } from './ExportModal'
import { saveProject, loadProjectByTemplateId, generateId } from '@/lib/persistence'
import type { Project } from '@/lib/persistence'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NavLogo } from '@/components/NavLogo'

interface EditorClientProps {
  templateId: string
}

export function EditorClient({ templateId }: EditorClientProps) {
  const template = getTemplate(templateId)
  if (!template) return null
  return <EditorInner template={template} />
}

function EditorInner({ template }: { template: TemplateDefinition<Record<string, unknown>> }) {
  const [props, setProps] = useState(template.defaultProps)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [format, setFormat] = useState<'1920x1080' | '1080x1920' | '1080x1080'>('1920x1080')
  const [fps, setFps] = useState(template.fps)
  const [durationInFrames, setDurationInFrames] = useState(template.defaultDurationInFrames)
  const [showExport, setShowExport] = useState(false)
  const projectIdRef = useRef<string | null>(null)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore saved project on mount
  useEffect(() => {
    const saved = loadProjectByTemplateId(template.id)
    if (saved) {
      projectIdRef.current = saved.id
      setProps(saved.props as typeof template.defaultProps)
      setFormat(saved.format)
      setFps(saved.fps)
      setDurationInFrames(saved.durationInFrames)
    } else {
      projectIdRef.current = generateId()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id])

  const saveNow = useCallback(() => {
    if (!projectIdRef.current) return
    const project: Project = {
      id: projectIdRef.current,
      templateId: template.id,
      name: template.name,
      props,
      format,
      fps: fps as 24 | 30 | 60,
      durationInFrames,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveProject(project)
  }, [template.id, template.name, props, format, fps, durationInFrames])

  // Debounced autosave
  const scheduleAutosave = useCallback(() => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(saveNow, 800)
  }, [saveNow])

  useEffect(() => {
    scheduleAutosave()
  }, [props, format, fps, durationInFrames, scheduleAutosave])

  const updateProp = useCallback((key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="flex flex-col h-screen bg-canvas overflow-hidden">
      <header className="flex-none h-12 flex items-center gap-4 px-4 border-b border-border bg-canvas">
        <NavLogo />
        <div className="w-px h-4 bg-border" />
        <Link
          href="/gallery"
          className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={14} />
          Gallery
        </Link>
        <div className="w-px h-4 bg-border" />
        <span className="text-sm font-medium text-text-primary">{template.name}</span>
        <div className="ml-auto">
          <span className="text-xs text-text-muted">Auto-saving</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-canvas-raised relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-subtle bg-grid opacity-30" />
          <MotionCanvas
            template={template}
            props={props}
            format={format}
            isPlaying={isPlaying}
            currentFrame={currentFrame}
            onFrameChange={setCurrentFrame}
            fps={fps}
            durationInFrames={durationInFrames}
          />
        </div>

        <aside className="flex-none w-72 border-l border-border bg-canvas overflow-y-auto">
          <PropertyInspector template={template} props={props} onPropChange={updateProp} />
        </aside>
      </div>

      <TransportBar
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying((p) => !p)}
        currentFrame={currentFrame}
        durationInFrames={durationInFrames}
        fps={fps}
        onSeek={setCurrentFrame}
        format={format}
        onFormatChange={setFormat}
        onFpsChange={setFps}
        onDurationChange={setDurationInFrames}
        onExport={() => setShowExport(true)}
      />

      {showExport && (
        <ExportModal
          templateId={template.id}
          props={props}
          format={format}
          fps={fps}
          durationInFrames={durationInFrames}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
