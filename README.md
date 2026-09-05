<div align="center">

<img src="./apps/web/public/favicon.svg" width="10%" alt="datmotions" style="border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);" />

# datmotions

**Motion graphics, rendered by your browser.**

Premium Apple-style motion graphics templates. Preview, customize, and export production-ready video.

</div>

## ✨ Key Features

- **🎬 Ten Production Templates**: Title reveals, kinetic typography, lower thirds, animated quotes, stat counters, bar charts, countdowns, social callouts, gradient reveals and cinematic title cards — all built as real Remotion compositions.
- **⚡ Live Preview Editor**: Every property is a control. Edit text, colors, fonts and animation style and see the change in the player instantly — no re-render, no waiting.
- **🖥️ Browser-Side Export**: Renders to H.264 MP4 entirely in your browser via WebCodecs. No upload, no queue, no render backend — your composition never leaves your machine.
- **📐 Three Aspect Ratios**: 1920×1080, 1080×1920 and 1080×1080, at 24/30/60 fps, with a configurable frame count.
- **🎥 Chroma-Key Backgrounds**: Export against green or blue screen to drop a title straight into your own edit.
- **💾 localStorage Persistence**: Projects autosave as you type and restore on your next visit — no accounts, no sync, no servers.
- **🌟 Premium Minimal UI**: Dark neutral interface with a neon green accent, a grid canvas, and a transport bar that stays out of the way.


## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Runtime & View Library**: [React 18](https://react.dev/)
- **Motion Engine**: [Remotion](https://www.remotion.dev/) — [`@remotion/player`](https://www.remotion.dev/docs/player) for preview, [`@remotion/web-renderer`](https://www.remotion.dev/docs/client-side-rendering) for client-side export
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with CSS-level custom theme variables
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) + [Zod](https://zod.dev/)
- **Monorepo**: [pnpm workspaces](https://pnpm.io/workspaces)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter), [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif), SF Pro Display, Neue Haas Display, Fraunces

## 🤝 Contributing

Contributions are very welcome, **especially new templates**. A template is just a React component that reads the current frame, so if you can animate it in the browser, it belongs here.

To add one, create `packages/motion-engine/src/templates/<your-template>/` with two files:

- **`definition.ts`** — `id`, `name`, `category`, `fps`, `defaultDurationInFrames`, `defaultProps`, and a `schema` array describing each editable prop (`key`, `label`, `group`, `control`, `default`). The schema is what the editor's inspector renders, so anything you expose here becomes a control for free.
- **`Composition.tsx`** — the component itself. Take `{ frame, props, width, height }`, use Remotion's `useCurrentFrame`, `interpolate` and `spring`, and scale every size by `width / 1920` so the template works in all three aspect ratios.

Then register it in `packages/motion-engine/src/templates/registry.ts`. 

## ⚖️ Privacy & Security

### Fully Client-Side
- datmotions has **no backend, no database, no API, and no authentication**. The entire application runs in your browser.
- Video encoding happens locally through WebCodecs. Your compositions, your text and your rendered MP4 never leave your device — nothing is uploaded, queued or stored on a server.

### Local Data
- Projects are saved to your browser's `localStorage` under the `datmotions:project:` prefix. This includes your template props, format, frame rate, duration and timestamps.
- Clearing your browser storage deletes them permanently. There is no cloud copy.

### Privacy Policy
- datmotions collects **absolutely nothing** about you. No analytics, no telemetry, no cookies, no tracking of any kind.
- One exception worth stating plainly: Remotion's renderer sends its own telemetry event per render, and Google Fonts are fetched from Google's CDN for templates that use them.

<br>

**Made with love for love. 💚**  
*From editor to editors, have fun.*
