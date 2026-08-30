import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 220, damping: 24, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 220, damping: 24, mass: 0.5 })
  const fx = useSpring(x, { stiffness: 1200, damping: 60 })
  const fy = useSpring(y, { stiffness: 1200, damping: 60 })
  const active = label !== ''

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setEnabled(true)
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest ? e.target.closest('[data-cursor]') : null
      setLabel(t ? String(t.dataset.cursor || 'VIEW') : '')
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div style={{ x: fx, y: fy }} className="pointer-events-none fixed left-0 top-0 z-[90]">
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold mix-blend-difference" />
      </motion.div>
      <motion.div style={{ x: rx, y: ry }} className="pointer-events-none fixed left-0 top-0 z-[90]">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
            active ? 'h-20 w-20 border-gold/60 bg-ink/40 backdrop-blur-[2px]' : 'h-9 w-9 border-cream/40'
          }`}
        >
          <span
            className={`font-grot text-[9px] uppercase tracking-[0.25em] transition-opacity duration-200 ${
              active ? 'text-gold opacity-100' : 'opacity-0'
            }`}
          >
            {label}
          </span>
        </div>
      </motion.div>
    </>
  )
}
