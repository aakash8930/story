import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/**
 * Word-by-word line-mask reveal.
 * Pass `when` (boolean) to drive the reveal from state instead of viewport.
 */
export function MaskText({
  as: Tag = 'span',
  children,
  className = '',
  delay = 0,
  stagger = 0.05,
  when,
}) {
  const text = String(children)
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          {when !== undefined ? (
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: '118%' }}
              animate={when ? { y: '0%' } : undefined}
              transition={{ duration: 0.95, ease: EASE, delay: delay + i * stagger }}
            >
              {w}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          ) : (
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: '118%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.95, ease: EASE, delay: delay + i * stagger }}
            >
              {w}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  )
}

/** Fade + rise, either on viewport entry or driven by `when`. */
export function FadeUp({ children, className = '', delay = 0, y = 28, when }) {
  const transition = { duration: 0.9, ease: EASE, delay }
  if (when !== undefined) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        animate={when ? { opacity: 1, y: 0 } : undefined}
        transition={transition}
      >
        {children}
      </motion.div>
    )
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—'

/** Decode-scramble effect for small mono labels. */
export function ScrambleText({ as: Tag = 'span', text, className = '', speed = 34, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [out, setOut] = useState(() => text.replace(/[^\s]/g, '·'))

  useEffect(() => {
    if (!inView) return
    let raf
    const total = text.length
    const start = performance.now() + delay
    const tick = (now) => {
      if (now < start) {
        raf = requestAnimationFrame(tick)
        return
      }
      const revealed = Math.floor((now - start) / speed)
      if (revealed >= total) {
        setOut(text)
        return
      }
      let s = text.slice(0, revealed)
      for (let i = revealed; i < total; i++) {
        const c = text[i]
        s += c === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setOut(s)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, speed, delay])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {out}
    </Tag>
  )
}

/** Number that counts up when it enters the viewport. */
export function Counter({ value, duration = 1.7, format = null, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (val) => setV(val),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {format ? format(v) : Math.round(v)}
    </span>
  )
}

/** Element that magnetically pulls toward the cursor. */
export function Magnetic({ children, className = '', strength = 0.35 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 160, damping: 16, mass: 0.4 })

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} className={className} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  )
}

/** Image that parallaxes through the viewport. */
export function Parallax({ src, alt, className = '', imgClassName = '', strength = 8 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${strength}%`, `${-strength}%`])
  return (
    <div ref={ref} className={'overflow-hidden ' + className}>
      <motion.img src={src} alt={alt} className={'h-full w-full object-cover ' + imgClassName} style={{ y }} />
    </div>
  )
}

/** Still image with a slow Ken Burns breathing scale. */
export function KenBurns({ src, alt, className = '', imgClassName = '' }) {
  return (
    <div className={'overflow-hidden ' + className}>
      <img src={src} alt={alt} className={'kenburns h-full w-full object-cover ' + imgClassName} />
    </div>
  )
}

/** Infinite edge-to-edge text strip. */
export function Marquee({ items, className = '' }) {
  const row = items.map((t, i) => (
    <span key={i} className="flex items-center gap-10 pr-10">
      <span className="whitespace-nowrap font-serif text-2xl font-light italic md:text-3xl">{t}</span>
      <span className="text-sm text-gold">✦</span>
    </span>
  ))
  return (
    <div className={'relative overflow-hidden py-5 ' + className} aria-hidden>
      <div className="marquee flex w-max items-center">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  )
}
