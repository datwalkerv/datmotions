import React from 'react'
import { registerRoot, Composition, useCurrentFrame } from 'remotion'
import { getAllTemplates } from '@datmotions/motion-engine'

function Root() {
  const templates = getAllTemplates()
  return (
    <>
      {templates.map((template) => {
        const Comp = template.component
        return (
          <Composition
            key={template.id}
            id={template.id}
            component={(compProps: Record<string, unknown>) => {
              const frame = useCurrentFrame()
              const chromaBg = typeof compProps.__chromaBg === 'string' ? compProps.__chromaBg : null
              return (
                <div style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden' }}>
                  {chromaBg && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: chromaBg,
                      zIndex: 0,
                    }} />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Comp frame={frame} props={compProps as never} width={1920} height={1080} />
                  </div>
                </div>
              )
            }}
            durationInFrames={template.defaultDurationInFrames}
            fps={template.fps}
            width={1920}
            height={1080}
            defaultProps={template.defaultProps as Record<string, unknown>}
          />
        )
      })}
    </>
  )
}

registerRoot(Root)
