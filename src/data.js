// ─────────────────────────  Models (placeholder data)  ─────────────────────
export const MODELS = [
  { id: 'opus-4-8',   name: 'Opus 4.8',   note: 'Most capable for complex work' },
  { id: 'sonnet-4-6', name: 'Sonnet 4.6', note: 'Smart, fast — everyday default' },
  { id: 'haiku-4-5',  name: 'Haiku 4.5',  note: 'Fastest for lightweight tasks' },
]

export const DEFAULT_MODEL = 'sonnet-4-6'

/*
  Simulated assistant reply.
  ▸ Swap the body of this function for a real fetch() to your API.
  ▸ It resolves with the reply text after a short "thinking" delay so the
    caller can show a typing indicator in the meantime.
*/
export function respond(userText, { model } = {}) {
  const reply =
    `This is a simulated reply from ${model ?? 'Claude'}. You said: “${userText}”.\n\n` +
    `Hook your interaction logic into respond() in src/data.js to make this real.`

  return new Promise((resolve) => {
    setTimeout(() => resolve(reply), 900)
  })
}
