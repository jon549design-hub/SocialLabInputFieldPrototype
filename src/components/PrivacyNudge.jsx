import { SEVERITY_COLOR } from '../privacy.js'

/*
  A gentle, non-blocking privacy grade that appears top-right while you type.

  It runs in three states:
    • idle      → hidden
    • analyzing → a loading card (shown while the user is still typing)
    • ready     → the grade + the terms that explain it

  Nothing here stops the message from being sent.
*/
export default function PrivacyNudge({ status, analysis }) {
  if (status === 'idle' || !status) return null

  // While typing: a calm "checking…" card with skeleton rows.
  if (status === 'analyzing' || !analysis) {
    return (
      <aside className="privacy-nudge" role="status" aria-live="polite" aria-busy="true">
        <div className="pn-head">
          <span className="pn-grade pn-grade--loading" aria-hidden="true"><span className="pn-spinner" /></span>
          <div>
            <p className="pn-title">Checking your message<span className="pn-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></p>
            <p className="pn-sub">Privacy check</p>
          </div>
        </div>
        <div className="pn-skeleton" aria-hidden="true"><span /><span /><span /></div>
      </aside>
    )
  }

  // Settled: show the grade and the terms behind it.
  const { grade, gradeLabel, color, findings } = analysis

  // De-duplicate repeated terms (e.g. "Sam" mentioned twice) for the list.
  const seen = new Set()
  const items = findings.filter((f) => {
    const key = `${f.category}:${f.term.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return (
    <aside className="privacy-nudge" role="status" aria-live="polite">
      <div className="pn-head">
        <span className="pn-grade" style={{ background: color }} aria-hidden="true">{grade}</span>
        <div>
          <p className="pn-title">{gradeLabel}</p>
          <p className="pn-sub">Privacy grade {grade}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="pn-list">
          {items.map((f, i) => (
            <li key={i}>
              <span className="pn-dot" style={{ background: SEVERITY_COLOR[f.severity] }} />
              <span><span className="pn-term">“{f.term}”</span> <span className="pn-label">{f.label}</span></span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="pn-clean">No personal details detected.</p>
      )}

      <p className="pn-foot">
        Mentioning who, where, and when together can make you more identifiable.
        Nothing is sent until you choose to.
      </p>
    </aside>
  )
}
