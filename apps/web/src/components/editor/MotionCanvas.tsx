'use client'
import React, { useRef, useEffect } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { useCurrentFrame } from 'remotion'
import type { TemplateDefinition } from '@datmotions/motion-engine'

interface MotionCanvasProps {
  template: TemplateDefinition<Record<string, unknown>>
  props: Record<string, unknown>
  format: '1920x1080' | '1080x1920' | '1080x1080'
  isPlaying: boolean
  currentFrame: number
  onFrameChange: (frame: number) => void
  fps: number
  durationInFrames: number
}

const FORMATS = {
  '1920x1080': { width: 1920, height: 1080 },
  '1080x1920': { width: 1080, height: 1920 },
  '1080x1080': { width: 1080, height: 1080 },
}

export function MotionCanvas({
  template,
  props,
  format,
  isPlaying,
  currentFrame,
  onFrameChange,
  fps,
  durationInFrames,
}: MotionCanvasProps) {
  const playerRef = useRef<PlayerRef>(null)
  const { width, height } = FORMATS[format]
  const aspectRatio = width / height
  const seekingRef = useRef(false)

  const maxW = 860
  const maxH = 520
  const fitByWidth = maxW / aspectRatio <= maxH
  const displayWidth = fitByWidth ? maxW : Math.round(maxH * aspectRatio)
  const displayHeight = fitByWidth ? Math.round(maxW / aspectRatio) : maxH

  useEffect(() => {
    if (isPlaying) {
      playerRef.current?.play()
    } else {
      playerRef.current?.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      seekingRef.current = true
      playerRef.current?.seekTo(currentFrame)
      seekingRef.current = false
    }
  }, [currentFrame, isPlaying])

  // Listen for frame updates from the Player
  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const handler = ({ detail }: { detail: { frame: number } }) => {
      if (!seekingRef.current) onFrameChange(detail.frame)
    }
    player.addEventListener('frameupdate', handler)
    return () => player.removeEventListener('frameupdate', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Comp = React.useMemo(() => {
    const TemplateComp = template.component
    return function Composition() {
      const frame = useCurrentFrame()
      return <TemplateComp frame={frame} props={props as never} width={width} height={height} />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id, props, width, height])

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-2xl"
      style={{ width: displayWidth, height: displayHeight }}
    >
      <Player
        ref={playerRef}
        component={Comp}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        loop
        acknowledgeRemotionLicense
        style={{ width: displayWidth, height: displayHeight }}
      />
    </div>
  )
}
