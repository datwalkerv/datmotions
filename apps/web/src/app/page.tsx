import Link from 'next/link'
import { NavLogo } from '@/components/NavLogo'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-border bg-canvas/80 backdrop-blur-md">
        <NavLogo />
        <nav className="ml-auto flex items-center gap-6">
          <Link
            href="/gallery"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Templates
          </Link>
        </nav>
      </header>

      <section className="flex flex-col items-center justify-center min-h-screen pt-14 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-6">
            Motion Graphics Studio
          </p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-normal text-text-primary mb-8">
            Every template
            <br />
            <em>is real code.</em>
          </h1>
          <p className="text-text-secondary text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Apple-style motion graphics you can customize frame-by-frame and export as
            production-ready video. What you preview is exactly what you get.
          </p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-canvas font-semibold text-sm rounded-lg hover:bg-accent/90 transition-colors"
          >
            Browse Templates
          </Link>
        </div>
      </section>
    </main>
  )
}
