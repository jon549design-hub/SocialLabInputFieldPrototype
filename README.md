# Social Lab — Input Field Prototype

A faithful recreation of the Claude chat **composer** (the input field), with a
minimal chat area around it. Built as a single self-contained `index.html` so
each interaction experiment can be forked independently — no build step, no
dependencies.

## Run it

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 4710
# then visit http://localhost:4710
```

## What's included

- **New-chat state** — centered spark + greeting + composer.
- **Conversation state** — user bubbles, assistant replies with the spark
  avatar, a typing indicator, and the composer docked to the bottom.
- **The composer** — auto-growing textarea, attach (`+`) and Tools buttons, a
  working model picker, and a send button that turns coral when there's text.
- **Responsive** — adapts for desktop and mobile (iOS-safe, no input zoom).
- **Light & dark themes** — toggle in the top-right; all colors are CSS tokens.

## Where to build your interactions

Everything lives in `index.html`:

| What | Where |
|------|-------|
| Composer markup | `<form id="composer">` |
| Send / message flow | `sendMessage()` in the `<script>` |
| Fake assistant reply | `respond()` — swap for a real API call |
| Colors & theme | `:root` and `[data-theme="dark"]` in the `<style>` |
| Model list | the `MODELS` array |

> Replies are simulated. `respond()` echoes a canned line after a short delay —
> replace its body with a `fetch()` to wire up a real backend.
