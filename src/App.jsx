import { useEffect, useRef, useState } from 'react'
import Greeting from './components/Greeting.jsx'
import Message from './components/Message.jsx'
import Composer from './components/Composer.jsx'
import { Spark, Sun } from './components/icons.jsx'
import { DEFAULT_MODEL, MODELS, respond } from './data.js'

export default function App() {
  const [messages, setMessages] = useState([]) // { id, role, text|null }
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [theme, setTheme] = useState('light')
  const mainRef = useRef(null)
  const idRef = useRef(0)

  const isConversation = messages.length > 0
  const nextId = () => ++idRef.current

  // Apply the theme to <html> so the CSS tokens switch.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Keep the latest message in view.
  useEffect(() => {
    const el = mainRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function handleSend(text) {
    const typingId = nextId()
    // Add the user turn + an empty assistant turn (renders the typing dots).
    setMessages((m) => [
      ...m,
      { id: nextId(), role: 'user', text },
      { id: typingId, role: 'assistant', text: null },
    ])

    const modelName = MODELS.find((m) => m.id === model)?.name
    const reply = await respond(text, { model: modelName })

    // Replace the placeholder assistant turn with the real reply.
    setMessages((m) => m.map((msg) => (msg.id === typingId ? { ...msg, text: reply } : msg)))
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Spark className="spark" style={{ width: 20, height: 20 }} />
          <span>Claude</span>
        </div>
        <button
          className="icon-btn"
          title="Toggle theme"
          aria-label="Toggle theme"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        >
          <Sun />
        </button>
      </header>

      <main className="main" ref={mainRef}>
        <div className={`column${isConversation ? '' : ' is-empty'}`}>
          {!isConversation && <Greeting />}

          {isConversation && (
            <section className="messages" aria-live="polite">
              {messages.map((m) => (
                <Message key={m.id} role={m.role} text={m.text} />
              ))}
            </section>
          )}

          <div className={`composer-wrap${isConversation ? ' docked' : ''}`}>
            <Composer
              model={model}
              onModelChange={setModel}
              onSend={handleSend}
              placeholder={isConversation ? 'Reply to Claude…' : 'How can I help you today?'}
              onAttach={() => console.log('[attach] open file picker')}
              onTools={() => console.log('[tools] open tools menu')}
            />
            {!isConversation && (
              <p className="hint">Claude can make mistakes. This is a prototype — replies are simulated.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
