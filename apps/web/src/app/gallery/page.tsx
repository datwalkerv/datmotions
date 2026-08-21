'use client'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { Player } from '@remotion/player'
import { getAllTemplates, type TemplateDefinition } from '@datmotions/motion-engine'
import { useCurrentFrame } from 'remotion'
import { NavLogo } from '@/components/NavLogo'

function TemplatePreviewPlayer({ template }: { template: TemplateDefinition<Record<string, unknown>> }) {
  const displayWidth = 320
  const displayHeight = 180
  const width = 1920
  const height = 1080

  const Comp = useMemo(() => {
    const TemplateComp = template.component
    return function Composition() {
      const frame = useCurrentFrame()
      return <TemplateComp frame={frame} props={template.defaultProps} width={width} height={height} />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id])

  return (
    <Player
      component={Comp}
      durationInFrames={template.defaultDurationInFrames}
      fps={template.fps}
      compositionWidth={width}
      compositionHeight={height}
      loop
      autoPlay
      acknowledgeRemotionLicense
      style={{ width: displayWidth, height: displayHeight, pointerEvents: 'none' }}
    />
  )
}

export default function GalleryPage() {
  const templates = getAllTemplates()

  return (
    <main className="min-h-screen bg-canvas">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-border bg-canvas/80 backdrop-blur-md">
        <NavLogo />
        <nav className="ml-auto flex items-center gap-4 text-sm text-text-muted">
          <span>{templates.length} templates</span>
        </nav>
      </header>

      <div className="pt-14 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Templates</h1>
          <p className="text-text-secondary mb-10">Browse and customize Apple-style motion graphics</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/editor/${template.id}`}
                className="group relative bg-canvas-subtle rounded-xl border border-border overflow-hidden hover:border-border-strong transition-all duration-200 hover:shadow-lg hover:shadow-black/30"
              >
                {/* Live preview */}
                <div className="aspect-video bg-canvas-raised flex items-center justify-center relative overflow-hidden">
                  <TemplatePreviewPlayer template={template} />
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300 pointer-events-none" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <span className="bg-accent text-canvas text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
                      Open in Editor →
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-text-primary">{template.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        {template.fps}fps · {(template.defaultDurationInFrames / template.fps).toFixed(1)}s · {template.supportedFormats.join(', ')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs bg-accent/10 text-accent capitalize border border-accent/20">
                      {template.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
