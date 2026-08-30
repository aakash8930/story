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

/** Image that parallaxes through the viewport; `reveal` adds an iris clip-path entrance. */
export function Parallax({ src, alt, className = '', imgClassName = '', strength = 8, reveal = false }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${strength}%`, `${-strength}%`])
  const revealProps = reveal
    ? {
        initial: { clipPath: 'inset(14% 10% 14% 10%)' },
        whileInView: { clipPath: 'inset(0% 0% 0% 0%)' },
        viewport: { once: true, margin: '-10% 0px' },
        transition: { duration: 1.5, ease: EASE },
      }
    : {}
  return (
    <div ref={ref} className={'overflow-hidden ' + className}>
      <motion.div className="h-full w-full" {...revealProps}>
        <motion.img src={src} alt={alt} className={'h-full w-full object-cover ' + imgClassName} style={{ y }} />
      </motion.div>
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

/** Hairline that draws itself in. */
export function LineDraw({ className = '', delay = 0 }) {
  return (
    <motion.span
      className={`block h-px origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    />
  )
}

/** 3D tilt that follows the cursor. */
export function Tilt({ children, className = '', max = 8 }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 18, mass: 0.4 })
  const sry = useSpring(ry, { stiffness: 160, damping: 18, mass: 0.4 })

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max)
    rx.set(-py * max)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
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
    <div className={'marquee-wrap relative overflow-hidden py-5 ' + className} aria-hidden>
      <div className="marquee flex w-max items-center">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  )
}
