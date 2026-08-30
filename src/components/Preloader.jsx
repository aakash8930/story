import { useEffect, useRef, useState } from 'react'
import { animate, motion } from 'framer-motion'

const EASE = [0.76, 0, 0.24, 1]

export default function Preloader({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const [count, setCount] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const controls = animate(0, 2026, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    })
    const t1 = setTimeout(() => setLeaving(true), 2350)
    const t2 = setTimeout(() => doneRef.current(), 3450)
    return () => {
      controls.stop()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const digits = String(Math.min(2026, count)).padStart(4, '0')

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#070605] px-6 py-8 md:px-12 md:py-10"
      initial={false}
      animate={{ y: leaving ? '-101%' : '0%' }}
      transition={{ duration: 1.05, ease: EASE }}
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <p className="font-grot text-[10px] uppercase tracking-[0.4em] text-cream/50">Maison Meridian</p>
        <p className="font-grot text-[10px] uppercase tracking-[0.4em] text-cream/50">Genève — 1847</p>
      </div>

      <div className="flex flex-col items-start">
        <p className="font-serif text-[15vw] font-light leading-none tracking-[0.08em] text-cream md:text-[9vw]">
          {'MERIDIAN'.split('').map((c, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '118%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.055 }}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </p>
        <motion.div
          className="mt-8 h-px w-full origin-left bg-gold/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.7, ease: EASE, delay: 0.5 }}
        />
      </div>

      <div className="flex items-end justify-between">
        <p className="font-grot text-[10px] uppercase leading-loose tracking-[0.35em] text-cream/40">
          The anatomy
          <br />
          of time
        </p>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
            <g className="rot" style={{ animationDuration: '2.4s', transformOrigin: '12px 12px' }}>
              <line x1="12" y1="12" x2="12" y2="4.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </g>
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          </svg>
          <p className="font-grot text-2xl tracking-[0.2em] text-gold tabular-nums md:text-4xl">{digits}</p>
        </div>
      </div>
    </motion.div>
  )
}
