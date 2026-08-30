import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Prologue' },
  { id: 'heritage', label: 'Foundry' },
  { id: 'craft', label: 'Craft' },
  { id: 'movement', label: 'Movement' },
  { id: 'timeline', label: 'Ledger' },
  { id: 'collection', label: 'Collection' },
  { id: 'epilogue', label: 'Epilogue' },
]

export default function ProgressRail({ onNav }) {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight * 0.5
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= mid) current = s.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed right-6 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex">
      {SECTIONS.map((s, i) => (
        <button key={s.id} onClick={() => onNav(s.id)} className="group flex items-center gap-3" aria-label={`Go to ${s.label}`}>
          <span
            className={`font-grot text-[9px] uppercase tracking-[0.3em] transition-all duration-300 ${
              active === s.id ? 'text-gold opacity-100' : 'text-cream/40 opacity-0 group-hover:opacity-100'
            }`}
          >
            {String(i).padStart(2, '0')} — {s.label}
          </span>
          <span
            className={`block h-1.5 w-1.5 rounded-full border transition-all duration-300 ${
              active === s.id
                ? 'scale-125 border-gold bg-gold'
                : 'border-cream/40 bg-transparent group-hover:border-cream/80'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
