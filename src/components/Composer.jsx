import { useEffect, useRef, useState } from 'react'
import ModelPicker from './ModelPicker.jsx'
import { Plus, Tools, ArrowUp } from './icons.jsx'

/*
  The composer — the heart of this prototype.
  Owns the draft text, auto-grows the textarea, and calls onSend(text).
  Build your input-field interactions here.
*/
export default function Composer({
  model,
  onModelChange,
  onSend,
  placeholder = 'How can I help you today?',
  onAttach,
  onTools,
}) {
  const [text, setText] = useState('')
  const taRef = useRef(null)
  const hasText = text.trim().length > 0

  // Auto-grow the textarea to fit its content (up to the CSS max-height).
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 220) + 'px'
  }, [text])

  function submit(e) {
    e?.preventDefault()
    if (!hasText) return
    onSend(text.trim())
    setText('')
  }

  // Enter sends, Shift+Enter inserts a newline.
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form className="composer" onSubmit={submit} autoComplete="off">
      <textarea
        ref={taRef}
        rows={1}
        value={text}
        placeholder={placeholder}
        aria-label="Message Claude"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <div className="toolbar">
        {/* Left: attach + tools */}
        <div className="group">
          <button type="button" className="tool circle" title="Attach" aria-label="Attach" onClick={onAttach}>
            <Plus />
          </button>
          <button type="button" className="tool" title="Tools" onClick={onTools}>
            <Tools />
            <span className="label">Tools</span>
          </button>
        </div>

        {/* Right: model picker + send */}
        <div className="group">
          <ModelPicker model={model} onChange={onModelChange} />
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
