import { useEffect, useRef, useState } from 'react'
import ModelPicker from './ModelPicker.jsx'
import InlinePrivacyTooltip from './InlinePrivacyTooltip.jsx'
import { Plus, ArrowUp } from './icons.jsx'
import { analyze } from '../privacy.js'

/*
  Turn the draft text + its privacy findings into highlighted nodes for the
  backdrop layer. Returns the plain string when there's nothing to highlight.
*/
function findingKey(finding) {
  return `${finding.start}-${finding.end}-${finding.typeLabel}`
}

function renderHighlights(text, findings, inlineNudges, highlightRefs, securedFindings) {
  if (!findings?.length) return text
  const nodes = []
  let i = 0
  findings.forEach((f) => {
    if (f.start > i) nodes.push(text.slice(i, f.start))
    const key = findingKey(f)
    const secured = securedFindings.has(key)
    nodes.push(
      <mark
        key={key}
        ref={inlineNudges
          ? (node) => {
              if (node) highlightRefs.current.set(key, { node, finding: f, secured })
              else highlightRefs.current.delete(key)
            }
          : undefined}
        className={`hl ${inlineNudges ? (secured ? 'secured' : 'inline') : f.severity}`}
      >
        {text.slice(f.start, f.end)}
      </mark>,
    )
    i = f.end
  })
  nodes.push(text.slice(i))
  return nodes
}

/*
  The composer — the heart of this prototype.
  Owns the draft text, auto-grows the textarea, runs the live privacy analysis,
  and paints the matching terms behind the text. Build input-field interactions here.
*/
export default function Composer({
  model,
  models,
  onModelChange,
  onSend,
  onPrivacyChange,
  onOpenDetails,
  privacyMode = 'off',
  placeholder = 'How can I help you today?',
  productName = 'Claude',
  productTheme = 'claude',
  onAttach,
}) {
  const [text, setText] = useState('')
  const taRef = useRef(null)
  const backdropRef = useRef(null)
  const inputWrapRef = useRef(null)
  const highlightRefs = useRef(new Map())
  const [activeNudge, setActiveNudge] = useState(null)
  const [securedFindings, setSecuredFindings] = useState(() => new Set())
  const hasText = text.trim().length > 0
  const privacyEnabled = privacyMode !== 'off'
  const showPrivacySummary = privacyMode === 'grade' || privacyMode === 'color'
  const inlineNudges = privacyMode === 'inline'
  const showLetter = privacyMode === 'grade'

  // Privacy analysis is debounced: while the user is typing we surface an
  // "analyzing" state, and only settle on a grade ~0.8s after they pause.
  const [status, setStatus] = useState('idle')   // 'idle' | 'analyzing' | 'ready'
  const [result, setResult] = useState(null)

  // Auto-grow the textarea to fit its content (up to the CSS max-height).
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 220) + 'px'
  }, [text])

  // Run (debounced) analysis whenever the draft changes — only when the
  // active version uses it. The template version skips analysis entirely.
  useEffect(() => {
    if (!privacyEnabled || !text.trim()) { setStatus('idle'); setResult(null); return }
    setStatus('analyzing')
    const id = setTimeout(() => {
      setResult(analyze(text))
      setStatus('ready')
    }, 800)
    return () => clearTimeout(id)
  }, [text, privacyEnabled])

  // Report status + result upward so the privacy nudge can render it.
  useEffect(() => { onPrivacyChange?.({ status, analysis: result }) }, [status, result, onPrivacyChange])

  // Inline nudges are transient and should never carry across versions.
  useEffect(() => {
    highlightRefs.current.clear()
    setActiveNudge(null)
  }, [privacyMode])

  // A touch tooltip stays open until the user taps outside the input.
  useEffect(() => {
    if (!activeNudge) return
    const dismissOutside = (event) => {
      if (!inputWrapRef.current?.contains(event.target)) setActiveNudge(null)
    }
    const dismissOnResize = () => setActiveNudge(null)
    document.addEventListener('pointerdown', dismissOutside)
    window.addEventListener('resize', dismissOnResize)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      window.removeEventListener('resize', dismissOnResize)
    }
  }, [activeNudge])

  // Listen at the document level so leaving the composer always dismisses a
  // desktop tooltip, even when the pointer crosses an overlaid UI element.
  useEffect(() => {
    if (!inlineNudges) return
    const trackPointer = (event) => {
      if (event.pointerType === 'touch') return
      if (isPointWithinNudge(event.clientX, event.clientY)) return
      if (event.target instanceof Element && event.target.closest('.inline-privacy-tooltip')) return
      showNudgeAtPoint(event.clientX, event.clientY)
    }
    document.addEventListener('pointermove', trackPointer)
    return () => document.removeEventListener('pointermove', trackPointer)
  }, [inlineNudges, status, result])

  function nudgeAtPoint(clientX, clientY) {
    const wrap = inputWrapRef.current
    if (!wrap) return null

    for (const [key, { node, finding, secured }] of highlightRefs.current) {
      for (const rect of node.getClientRects()) {
        const isHit = clientX >= rect.left && clientX <= rect.right
          && clientY >= rect.top && clientY <= rect.bottom
        if (!isHit) continue

        const wrapRect = wrap.getBoundingClientRect()
        const tooltipEdgeInset = 52
        const x = Math.min(
          Math.max(rect.left + rect.width / 2 - wrapRect.left, tooltipEdgeInset),
          Math.max(wrapRect.width - tooltipEdgeInset, tooltipEdgeInset),
        )
        const placement = rect.top < 42 ? 'below' : 'above'
        const y = (placement === 'above' ? rect.top : rect.bottom) - wrapRect.top
        return {
          key,
          label: secured ? 'Secured' : finding.typeLabel,
          finding,
          secured,
          anchor: { x, y, placement },
        }
      }
    }

    return null
  }

  function isPointWithinNudge(clientX, clientY) {
    const tooltip = inputWrapRef.current?.querySelector('.inline-privacy-tooltip')
    if (!tooltip) return false
    const rect = tooltip.getBoundingClientRect()
    const bridge = 7
    return clientX >= rect.left
      && clientX <= rect.right
      && clientY >= rect.top - bridge
      && clientY <= rect.bottom + bridge
  }

  function showNudgeAtPoint(clientX, clientY) {
    const next = nudgeAtPoint(clientX, clientY)
    setActiveNudge((current) => {
      if (!next) return null
      if (
        current?.key === next.key
        && current.anchor.x === next.anchor.x
        && current.anchor.y === next.anchor.y
      ) return current
      return next
    })
  }

  function onInputPointerUp(event) {
    if (!inlineNudges || event.pointerType === 'mouse') return
    if (event.target instanceof Element && event.target.closest('.inline-privacy-tooltip')) return
    showNudgeAtPoint(event.clientX, event.clientY)
  }

  function handleNudgeAction() {
    const finding = activeNudge?.finding
    if (!finding) return
    if (finding.typeLabel === 'Timing' && !activeNudge.secured) return

    setSecuredFindings((current) => {
      const next = new Set(current)
      if (activeNudge.secured) next.delete(activeNudge.key)
      else next.add(activeNudge.key)
      return next
    })
    setActiveNudge(null)
  }

  // Keep the highlight backdrop scrolled in lockstep with the textarea.
  function syncScroll() {
    const ta = taRef.current
    const bd = backdropRef.current
    if (ta && bd) { bd.scrollTop = ta.scrollTop; bd.scrollLeft = ta.scrollLeft }
    setActiveNudge(null)
  }

  function submit(e) {
    e?.preventDefault()
    if (!hasText) return
    onSend(text.trim())
    setText('')
    setActiveNudge(null)
    setSecuredFindings(new Set())
  }

  // Enter sends, Shift+Enter inserts a newline.
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const visibleFindings = status === 'ready' ? result?.findings : null

  return (
    <form className="composer" onSubmit={submit} autoComplete="off">
      <div
        className="input-wrap"
        ref={inputWrapRef}
        onPointerUp={onInputPointerUp}
      >
        <div className="highlight-backdrop input-layer" ref={backdropRef} aria-hidden="true">
          {renderHighlights(
            text,
            visibleFindings,
            inlineNudges,
            highlightRefs,
            securedFindings,
          )}
        </div>
        <textarea
          ref={taRef}
          className="input-layer"
          rows={1}
          value={text}
          placeholder={placeholder}
          aria-label={`Message ${productName}`}
          aria-describedby={activeNudge ? 'inline-privacy-tooltip' : undefined}
          onChange={(e) => {
            setText(e.target.value)
            setActiveNudge(null)
            setSecuredFindings(new Set())
          }}
          onKeyDown={onKeyDown}
          onScroll={syncScroll}
        />
        <InlinePrivacyTooltip
          label={activeNudge?.label}
          anchor={activeNudge?.anchor}
          secured={activeNudge?.secured}
          onAction={handleNudgeAction}
        />
      </div>

      <div className="toolbar">
        {/* Left: attach + (mobile only) the privacy grade chip */}
        <div className="group">
          <button type="button" className="tool circle" title="Attach" aria-label="Attach" onClick={onAttach}>
            <Plus />
          </button>

          {showPrivacySummary && status !== 'idle' && (
            <button
              type="button"
              className={`grade-chip${status === 'ready' && !showLetter ? ' grade-chip--dot' : ''}`}
              onClick={onOpenDetails}
              aria-label="Show privacy details"
              style={status === 'ready' && result ? { background: result.color } : undefined}
            >
              {status === 'ready' && result
                ? (showLetter ? result.grade : null)
                : <span className="grade-chip-spinner" aria-hidden="true" />}
            </button>
          )}
        </div>

        {/* Right: model picker + send */}
        <div className="group">
          <ModelPicker
            model={model}
            models={models}
            onChange={onModelChange}
            productName={productName}
            productTheme={productTheme}
          />
          <button
            type="submit"
            className={`send${hasText ? ' active' : ''}`}
            title="Send"
            aria-label="Send message"
            disabled={!hasText}
          >
            <ArrowUp />
          </button>
        </div>
      </div>
    </form>
  )
}
