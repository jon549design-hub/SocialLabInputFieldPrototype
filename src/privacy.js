// ───────────────────────────  Privacy analysis  ──────────────────────────
// Mock, rule-based analysis of the draft text. It finds personal details,
// scores how revealing the message is, and turns that into a letter grade.
// Swap the rules / scoring for a real model later — the shape of analyze()'s
// return value is the contract the UI depends on.

// Each category: how severe it is, how many points it costs the grade, and a
// short human label shown in the nudge. `desc` is the longer "why" (kept for a
// future per-word tooltip).
const CATEGORIES = {
  person:   { severity: 'high', weight: 18, label: 'Name',     desc: 'Names can identify specific people you mention.' },
  contact:  { severity: 'high', weight: 35, label: 'Contact',  desc: 'Emails or numbers can directly identify or reach someone.' },
  location: { severity: 'med',  weight: 10, label: 'Location', desc: 'Sharing where you are reveals your whereabouts.' },
  time:     { severity: 'med',  weight: 6,  label: 'Timing',   desc: 'Paired with a place, timing can reveal your plans.' },
}

export const SEVERITY_COLOR = { high: '#cc4036', med: '#c9892f', low: '#6f8e4a' }

// Small mock dictionaries — enough to drive the prototype scenarios.
const NAMES = ['sam', 'alex', 'sarah', 'john', 'mike', 'michael', 'emma', 'olivia',
  'liam', 'noah', 'chris', 'david', 'anna', 'kate', 'tom', 'jenny', 'sophia', 'james']
const LOCATIONS = ['sf', 'san francisco', 'nyc', 'new york', 'la', 'los angeles',
  'seattle', 'chicago', 'boston', 'oakland', 'berkeley', 'palo alto', 'the mission', 'soma']
const TIMES = ['tomorrow', 'today', 'tonight', 'this weekend', 'next week', 'this afternoon',
  'this evening', 'this morning', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const EMAIL = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g
const PHONE = /\b\+?\d[\d\s().-]{7,}\d\b/g

// Build a case-insensitive, word-boundary regex from a word list. Longer
// phrases are tried first so "san francisco" wins over a bare "francisco".
function listRegex(list) {
  const escaped = list
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
  return new RegExp(`\\b(?:${escaped.join('|')})\\b`, 'gi')
}

const RULES = [
  { category: 'person',   re: listRegex(NAMES) },
  { category: 'location', re: listRegex(LOCATIONS) },
  { category: 'time',     re: listRegex(TIMES) },
  { category: 'contact',  re: EMAIL },
  { category: 'contact',  re: PHONE },
]

const GRADES = [
  { min: 90, grade: 'A', label: 'Looks private',           color: '#4a8a5a' },
  { min: 78, grade: 'B', label: 'Minor details',           color: '#6f8e4a' },
  { min: 66, grade: 'C', label: 'Some personal details',   color: '#c9892f' },
  { min: 50, grade: 'D', label: 'Fairly revealing',        color: '#cf6f2e' },
  { min: 0,  grade: 'F', label: 'Sensitive — review first', color: '#cc4036' },
]

const toGrade = (score) => GRADES.find((g) => score >= g.min)

// Returns null for empty input, otherwise:
//   { score, grade, gradeLabel, color, findings: [{ category, term, start, end,
//     severity, weight, label, desc }] }  — findings are sorted by position.
export function analyze(text) {
  if (!text || !text.trim()) return null

  // Collect every match across all rules.
  const raw = []
  for (const rule of RULES) {
    rule.re.lastIndex = 0
    let m
    while ((m = rule.re.exec(text)) !== null) {
      raw.push({ category: rule.category, term: m[0], start: m.index, end: m.index + m[0].length })
      if (m.index === rule.re.lastIndex) rule.re.lastIndex++ // guard against zero-length loops
    }
  }

  // Resolve overlaps: earliest start first, longer match wins, then drop any
  // match that starts inside an already-accepted one.
  raw.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start))
  const findings = []
  let lastEnd = -1
  for (const r of raw) {
    if (r.start < lastEnd) continue
    findings.push({ ...r, ...CATEGORIES[r.category] })
    lastEnd = r.end
  }

  // Score: start clean at 100 and deduct each finding's weight.
  let score = 100
  for (const f of findings) score -= f.weight
  score = Math.max(0, Math.min(100, score))

  const g = toGrade(score)
  return { score, grade: g.grade, gradeLabel: g.label, color: g.color, findings }
}
