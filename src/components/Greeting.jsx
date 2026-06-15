import { Spark } from './icons.jsx'

// The "new chat" welcome: spark logo + serif greeting.
export default function Greeting({ text = 'How can I help you today?' }) {
  return (
    <section className="greeting">
      <Spark className="spark-lg" />
      <h1>{text}</h1>
    </section>
  )
}
