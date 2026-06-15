import { useEffect, useRef, useState } from 'react'
import { MODELS } from '../data.js'
import { Chevron, Check } from './icons.jsx'

// The model selector button + dropdown menu.
export default function ModelPicker({ model, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = MODELS.find((m) => m.id === model)

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [open])

  return (
    <div className="model-field" ref={ref}>
      <button
        type="button"
        className="model"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span><span className="label-full">Claude </span>{current?.name}</span>
        <Chevron className="chev" />
      </button>

      {open && (
        <div className="menu" role="menu">
          {MODELS.map((m) => (
            <button
              key={m.id}
              className={`item${m.id === model ? ' checked' : ''}`}
              role="menuitemradio"
              aria-checked={m.id === model}
              onClick={() => { onChange(m.id); setOpen(false) }}
            >
              <span>{m.name}<small>{m.note}</small></span>
              <Check className="check" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
