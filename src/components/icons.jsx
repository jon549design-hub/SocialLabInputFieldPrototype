// Small inline SVG icon set — dependency-free, inherits currentColor.

export function Spark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="var(--accent)"
        d="M12 1.5c.5 0 .9.4.9.9l.35 6.1 1.2-1.2a.9.9 0 0 1 1.3 1.3l-1.2 1.2 6.1.35a.9.9 0 0 1 0 1.8l-6.1.35 1.2 1.2a.9.9 0 0 1-1.3 1.3l-1.2-1.2-.35 6.1a.9.9 0 0 1-1.8 0l-.35-6.1-1.2 1.2a.9.9 0 0 1-1.3-1.3l1.2-1.2-6.1-.35a.9.9 0 0 1 0-1.8l6.1-.35-1.2-1.2a.9.9 0 0 1 1.3-1.3l1.2 1.2.35-6.1c0-.5.4-.9.9-.9z"
      />
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Sun = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const Plus = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}><path d="M12 5v14M5 12h14" /></svg>
)

export const Tools = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}>
    <path d="M4 6h11M4 12h7M4 18h13" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="20" cy="18" r="2" />
  </svg>
)

export const Chevron = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} {...p}><path d="M6 9l6 6 6-6" /></svg>
)

export const ArrowUp = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.2" {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
)

export const Check = (p) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.5" {...p}><path d="M20 6L9 17l-5-5" /></svg>
)
