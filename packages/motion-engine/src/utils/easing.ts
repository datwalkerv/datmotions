import { Easing, interpolate, spring } from 'remotion'

export const EASING = {
  easeOutExpo: Easing.bezier(0.16, 1, 0.3, 1),
  easeOutQuart: Easing.bezier(0.25, 1, 0.5, 1),
  easeInOutQuart: Easing.bezier(0.76, 0, 0.24, 1),
}

export const SPRING_CONFIGS = {
  snappy: { damping: 18, stiffness: 280, mass: 1 },
  gentle: { damping: 24, stiffness: 160, mass: 1 },
  bouncy: { damping: 12, stiffness: 200, mass: 1 },
  slow: { damping: 30, stiffness: 100, mass: 1.2 },
}

export function springValue({
  frame,
  fps,
  from = 0,
  to = 1,
  delay = 0,
  config = SPRING_CONFIGS.snappy,
}: {
  frame: number
  fps: number
  from?: number
  to?: number
  delay?: number
  config?: { damping: number; stiffness: number; mass: number }
}): number {
  const s = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config,
    durationInFrames: 40,
  })
  return from + (to - from) * s
}

export function fadeIn({
  frame,
  startFrame,
  durationFrames = 12,
}: {
  frame: number
  startFrame: number
  durationFrames?: number
}): number {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASING.easeOutQuart,
  })
}

export function slideUp({
  frame,
  startFrame,
  durationFrames = 20,
  distance = 40,
}: {
  frame: number
  startFrame: number
  durationFrames?: number
  distance?: number
}): number {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASING.easeOutExpo,
  })
}
