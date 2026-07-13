import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CreditCard, Heart, BookOpen, MapPin, Users,
  Briefcase, Paintbrush, Star, FileText, Check,
  ShieldCheck, Zap, MessageSquare, Globe,
} from 'lucide-react'
import { Spark } from './icons.jsx'

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT    = '#d97757'
const GRADE_D   = '#cf6f2e'
const HIGH_COL  = '#cc4036'
const MED_COL   = '#c9892f'

// ─── IOSToggle ────────────────────────────────────────────────────────────────
function IOSToggle({ on, onToggle, dark }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'relative', flexShrink: 0,
        width: 51, height: 31, borderRadius: 16,
        background: on ? '#000000' : (dark ? 'rgba(255,255,255,0.18)' : 'rgba(120,120,128,0.32)'),
        transition: 'background 0.2s ease',
        border: 'none', cursor: 'pointer',
      }}
      aria-checked={on}
      role="switch"
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 27, height: 27, borderRadius: '50%',
        background: dark && !on ? 'rgba(255,255,255,0.9)' : '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
        transition: 'left 0.2s ease',
      }} />
    </button>
  )
}

// ─── BottomBar ────────────────────────────────────────────────────────────────
function BottomBar({ onBack, backLabel = 'Back', onNext, nextLabel = 'Continue', dark, dotInfo }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
      paddingBottom: 20, paddingTop: 12,
      background: dark ? 'rgba(0,0,0,0.88)' : 'rgba(242,242,247,0.88)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderTop: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
    }}>
      {dotInfo && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
          {dotInfo.screens.map((s) => (
            <button key={s} onClick={() => dotInfo.onNav(s)} style={{
              width: dotInfo.current === s ? 24 : 8, height: 8, borderRadius: 4,
              background: dotInfo.current === s
                ? (dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)')
                : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)'),
              transition: 'width 0.2s ease',
              flexShrink: 0, border: 'none', cursor: 'pointer',
            }} />
          ))}
        </div>
      )}
      <div className="onboarding-inner" style={{ display: 'flex', gap: 12 }}>
        {onBack && (
          <button onClick={onBack} style={{
            flex: 1, height: 44, borderRadius: 9999,
            background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            color: dark ? '#ffffff' : '#000000',
            fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>{backLabel}</button>
        )}
        <button onClick={onNext} style={{
          flex: onBack ? 2 : 1, height: 44, borderRadius: 9999,
          background: dark ? '#ffffff' : '#000000',
          color: dark ? '#000000' : '#ffffff',
          fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>{nextLabel}</button>
      </div>
    </div>
  )
}

// ─── Screen 1: Nudge detection demo ──────────────────────────────────────────
function Hl({ text, bg, line }) {
  return (
    <span style={{
      background: bg,
      boxShadow: `inset 0 -1.5px 0 ${line}`,
      borderRadius: 3, padding: '0 1px',
    }}>{text}</span>
  )
}

function Screen1({ onContinue, dark, dotInfo }) {
  const fg      = dark ? '#fff' : '#000'
  const sub     = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card    = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const border  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const divider = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.14)'

  const hlH = { bg: 'rgba(204,64,54,0.14)',  line: 'rgba(204,64,54,0.60)'  }
  const hlM = { bg: 'rgba(201,137,47,0.18)', line: 'rgba(201,137,47,0.65)' }

  const findings = [
    { term: '"San Francisco"', label: 'Location', color: MED_COL },
    { term: '"SOMA"',          label: 'Location', color: MED_COL },
    { term: '"Sam"',           label: 'Name',     color: HIGH_COL },
  ]

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="onboarding-inner" style={{ paddingTop: 28, paddingBottom: 20 }}>

          {/* Mini Claude topbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
            <Spark style={{ width: 18, height: 18, color: ACCENT }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: fg, letterSpacing: '-0.2px' }}>Claude</span>
          </div>

          {/* Greeting */}
          <p style={{ fontSize: 20, fontWeight: 600, color: fg, marginBottom: 20, lineHeight: 1.25, letterSpacing: '-0.3px' }}>
            How can I help you today?
          </p>

          {/* Composer mockup */}
          <div style={{
            borderRadius: 16, background: card,
            border: `1px solid ${border}`,
            padding: '14px 16px 10px',
            boxShadow: dark ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
            marginBottom: 12,
          }}>
            <p style={{ fontSize: 15, lineHeight: '22px', color: fg, marginBottom: 12 }}>
              I am currently in{' '}
              <Hl text="San Francisco" {...hlM} />
              . Could you recommend the best matcha spots in{' '}
              <Hl text="SOMA" {...hlM} />
              {' '}to visite with{' '}
              <Hl text="Sam" {...hlH} />
              ?
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: `1.5px solid ${dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 18, color: sub, lineHeight: 1 }}>+</span>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: GRADE_D,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>D</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: sub }}>Sonnet 4.6 ▾</span>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 15, color: '#fff', lineHeight: 1 }}>↑</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy card */}
          <div style={{
            borderRadius: 16, background: card,
            border: `1px solid ${border}`,
            overflow: 'hidden',
            boxShadow: dark ? 'none' : '0 1px 6px rgba(0,0,0,0.07)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 12px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: GRADE_D,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>D</span>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: fg, lineHeight: '20px' }}>Fairly revealing</p>
                <p style={{ fontSize: 13, color: sub, lineHeight: '17px' }}>Privacy grade D</p>
              </div>
            </div>
            <div style={{ height: 1, background: divider }} />
            <div style={{ padding: '12px 16px 4px' }}>
              {findings.map(({ term, label, color }) => (
                <div key={term} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: fg }}>
                    <span style={{ fontWeight: 500 }}>{term}</span>{' '}
                    <span style={{ color: sub }}>{label}</span>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: divider }} />
            <p style={{ fontSize: 12, color: sub, padding: '10px 16px 14px', lineHeight: '17px' }}>
              Mentioning who, where, and when together can make you more identifiable.
              Nothing is sent until you choose to.
            </p>
          </div>
        </div>
      </div>
      <BottomBar onBack={null} onNext={onContinue} nextLabel="Set my preferences" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 2: Category grid ──────────────────────────────────────────────────
const CATS_V2 = [
  { id: 'financial',     Icon: CreditCard,  label: 'Financial',         example: 'bank details, salary, spending' },
  { id: 'identity',      Icon: FileText,    label: 'Identity & ID',     example: 'name, school, workplace' },
  { id: 'health',        Icon: Heart,       label: 'Health',            example: 'medical or mental health info' },
  { id: 'thoughts',      Icon: BookOpen,    label: 'Personal thoughts', example: 'journal entries, fears, values' },
  { id: 'location',      Icon: MapPin,      label: 'Location',          example: 'home address, current location' },
  { id: 'relationships', Icon: Users,       label: 'Relationships',     example: 'partner, family, friends' },
  { id: 'work',          Icon: Briefcase,   label: 'Work & education',  example: 'employer, job title, school' },
  { id: 'creative',      Icon: Paintbrush,  label: 'Creative work',     example: 'drafts, code, design files' },
  { id: 'preferences',   Icon: Star,        label: 'Preferences',       example: 'food, travel, hobbies' },
]

function Screen2({ selected, onToggle, onContinue, onBack, dark, dotInfo }) {
  const fg     = dark ? '#fff' : '#000'
  const sub    = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card   = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const selBg  = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  const selBorder = dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="onboarding-inner" style={{ paddingTop: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: fg, lineHeight: 1.15, marginBottom: 8 }}>
            What should get a nudge?
          </h1>
          <p style={{ fontSize: 15, color: sub, marginBottom: 24, lineHeight: '22px' }}>
            Select the categories where you'd like a reminder before sharing.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {CATS_V2.map(({ id, Icon, label, example }) => {
              const isSel = selected.includes(id)
              return (
                <button
                  key={id}
                  onClick={() => onToggle(id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    padding: '11px 10px 12px',
                    borderRadius: 14,
                    background: isSel ? selBg : card,
                    border: `1.5px solid ${isSel ? selBorder : border}`,
                    cursor: 'pointer', textAlign: 'left', position: 'relative',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  {isSel && (
                    <div style={{
                      position: 'absolute', top: 7, right: 7,
                      width: 16, height: 16, borderRadius: '50%', background: fg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check style={{ width: 10, height: 10, color: dark ? '#000' : '#fff' }} strokeWidth={3} />
                    </div>
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, marginBottom: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  }}>
                    <Icon style={{ width: 15, height: 15, color: fg }} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: fg, lineHeight: '16px', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 10.5, color: sub, lineHeight: '14px' }}>{example}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <BottomBar onBack={onBack} onNext={onContinue} nextLabel="Next" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 3: Financial granular ────────────────────────────────────────────
const FIN_SUBS = [
  { id: 'bank',   label: 'Bank balance & accounts', sub: 'Account numbers, balances, transactions' },
  { id: 'salary', label: 'Salary & income',          sub: 'Earnings, pay slips, bonuses' },
  { id: 'cards',  label: 'Cards & spending',         sub: 'Credit cards, purchase history' },
]

function Screen3({ finRules, onSetFinRule, onContinue, onBack, dark, dotInfo }) {
  const fg   = dark ? '#fff' : '#000'
  const sub  = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const sep  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.18)'

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="onboarding-inner" style={{ paddingTop: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: fg, lineHeight: 1.15, marginBottom: 8 }}>
            Financial details
          </h1>
          <p style={{ fontSize: 15, color: sub, marginBottom: 28, lineHeight: '22px' }}>
            Some financial information is more sensitive than others. Fine-tune what gets a nudge.
          </p>

          <div style={{ borderRadius: 14, background: card, overflow: 'hidden', border: `1px solid ${sep}` }}>
            {FIN_SUBS.map(({ id, label, sub: itemSub }, i) => (
              <div key={id}>
                {i > 0 && <div style={{ height: 1, background: sep, marginLeft: 16 }} />}
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: fg, lineHeight: '21px' }}>{label}</div>
                    <div style={{ fontSize: 13, color: sub, lineHeight: '17px', marginTop: 2 }}>{itemSub}</div>
                  </div>
                  <IOSToggle
                    on={finRules[id] !== false}
                    onToggle={() => onSetFinRule(id, !finRules[id])}
                    dark={dark}
                  />
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: sub, marginTop: 16, lineHeight: '18px' }}>
            All financial nudges are on by default. Toggle off any you don't need.
          </p>
        </div>
      </div>
      <BottomBar onBack={onBack} onNext={onContinue} nextLabel="Next" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 4: Nudge / No nudge ──────────────────────────────────────────────
const NUDGE_OPTIONS = [
  { id: 'nudge',    label: 'Nudge me',  caption: "I'll get a reminder before anything sensitive is sent" },
  { id: 'no-nudge', label: 'No nudge', caption: "Share without interruptions — you're in control" },
]

function Screen4({ nudge, onSetNudge, onContinue, onBack, dark, dotInfo }) {
  const fg     = dark ? '#fff' : '#000'
  const sub    = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const card   = dark ? 'rgba(28,28,30,1)' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const selBg  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="onboarding-inner" style={{ paddingTop: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: fg, lineHeight: 1.15, marginBottom: 8 }}>
            How should we remind you?
          </h1>
          <p style={{ fontSize: 15, color: sub, marginBottom: 28, lineHeight: '22px' }}>
            You can change this at any time in Settings.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NUDGE_OPTIONS.map(({ id, label, caption }) => {
              const isSel = nudge === id
              return (
                <button
                  key={id}
                  onClick={() => onSetNudge(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px', borderRadius: 16, textAlign: 'left',
                    background: isSel ? selBg : card,
                    border: `1.5px solid ${isSel ? fg : border}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: fg, lineHeight: '22px' }}>{label}</div>
                    <div style={{ fontSize: 14, color: sub, lineHeight: '19px', marginTop: 3 }}>{caption}</div>
                  </div>
                  {isSel && (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', background: fg, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check style={{ width: 13, height: 13, color: dark ? '#000' : '#fff' }} strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <BottomBar onBack={onBack} onNext={onContinue} nextLabel="Save" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Screen 5: Confirmation ───────────────────────────────────────────────────
function Screen5({ onDone, dark, dotInfo }) {
  const fg  = dark ? '#fff' : '#000'
  const sub = dark ? 'rgba(235,235,245,0.6)' : '#6c6c70'
  const sep = dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.18)'

  const areas = [
    { Icon: MessageSquare, title: 'Every chat',     sub: 'Applied automatically when you type'       },
    { Icon: Globe,         title: 'Any platform',   sub: 'Works across Claude, ChatGPT, and more'    },
    { Icon: Zap,           title: 'Instant update', sub: 'Changes take effect the moment you save'   },
  ]

  return (
    <div className="absolute inset-0 bg-background" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        <div className="onboarding-inner" style={{ paddingTop: 64 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            }}>
              <ShieldCheck style={{ width: 36, height: 36, color: fg }} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px', color: fg, lineHeight: 1.1 }}>
                You&apos;re all set.
              </h1>
              <p style={{ fontSize: 16, lineHeight: '22px', color: sub, marginTop: 8 }}>
                These preferences apply every time you chat. Change them anytime in Settings → Privacy.
              </p>
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>
              {areas.map(({ Icon, title, sub: areaSub }, i) => (
                <div key={title}>
                  {i > 0 && <div style={{ height: 1, marginLeft: 56, background: sep }} />}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '15px 16px', gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}>
                      <Icon style={{ width: 16, height: 16, color: fg }} strokeWidth={1.6} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: fg, lineHeight: '20px' }}>{title}</div>
                      <div style={{ fontSize: 13, color: sub, lineHeight: '17px' }}>{areaSub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomBar onBack={null} onNext={onDone} nextLabel="Done" dark={dark} dotInfo={dotInfo} />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function OnboardingV2Mobile({ dark }) {
  const [screen,   setScreen]   = useState(1)
  const [selected, setSelected] = useState(['financial', 'identity', 'health', 'location'])
  const [finRules, setFinRules] = useState({ bank: true, salary: true, cards: true })
  const [nudge,    setNudge]    = useState('nudge')

  const hasFinancial = selected.includes('financial')

  const navTo  = (s) => setScreen(s)
  const slide  = { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } }
  const dotInfo = { screens: [1, 2, 4, 5], current: screen === 3 ? 2 : screen, onNav: navTo }

  const toggleCat      = (id)     => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])
  const setFinRule     = (id, v)  => setFinRules((r) => ({ ...r, [id]: v }))
  const handleAfterS2  = ()       => hasFinancial ? navTo(3) : navTo(4)
  const handleBackS4   = ()       => hasFinancial ? navTo(3) : navTo(2)

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <AnimatePresence mode="wait">
        {screen === 1 && <motion.div key="v2-s1" {...slide} className="absolute inset-0"><Screen1 onContinue={() => navTo(2)} dark={dark} dotInfo={dotInfo} /></motion.div>}
        {screen === 2 && <motion.div key="v2-s2" {...slide} className="absolute inset-0"><Screen2 selected={selected} onToggle={toggleCat} onContinue={handleAfterS2} onBack={() => navTo(1)} dark={dark} dotInfo={dotInfo} /></motion.div>}
        {screen === 3 && <motion.div key="v2-s3" {...slide} className="absolute inset-0"><Screen3 finRules={finRules} onSetFinRule={setFinRule} onContinue={() => navTo(4)} onBack={() => navTo(2)} dark={dark} dotInfo={dotInfo} /></motion.div>}
        {screen === 4 && <motion.div key="v2-s4" {...slide} className="absolute inset-0"><Screen4 nudge={nudge} onSetNudge={setNudge} onContinue={() => navTo(5)} onBack={handleBackS4} dark={dark} dotInfo={dotInfo} /></motion.div>}
        {screen === 5 && <motion.div key="v2-s5" {...slide} className="absolute inset-0"><Screen5 onDone={() => navTo(1)} dark={dark} dotInfo={dotInfo} /></motion.div>}
      </AnimatePresence>
    </div>
  )
}
