'use client'
import Link from 'next/link'

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <span
        className="flex items-center justify-center w-7 h-7 rounded-md bg-accent text-canvas font-bold text-xs tracking-tighter select-none"
        style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em' }}
      >
        dm
      </span>
      <span className="font-semibold text-sm tracking-tight text-text-primary">datmotions</span>
    </Link>
  )
}
