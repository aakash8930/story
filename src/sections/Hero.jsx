import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { EASE, FadeUp, KenBurns, MaskText } from '../lib/kit.jsx'
import Watch3D from '../components/Watch3D.jsx'

/** Slow-drifting warm dust, canvas-rendered. */
function Dust() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let parts = []
    let raf = 0
    let onResize

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const seed = () => {
      const n = Math.min(56, Math.max(18, Math.round((w * h) / 28000)))
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        s: Math.random() * 0.2 + 0.05,
        p: Math.random() * Math.PI * 2,
        a: Math.random() * 0.45 + 0.12,
      }))
    }
    const tick = (t) => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#e9d9ab'
      for (const pt of parts) {
        pt.y -= pt.s
        pt.p += 0.004
        pt.x += Math.sin(pt.p) * 0.16
        if (pt.y < -6) {
          pt.y = h + 6
          pt.x = Math.random() * w
        }
        ctx.globalAlpha = pt.a * (0.55 + 0.45 * Math.sin(t / 900 + pt.p))
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    onResize = () => {
      resize()
      seed()
    }
    resize()
    seed()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[5] h-full w-full opacity-70" />
}

/** Rotating circular maison stamp. */
function Stamp({ ready }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 1.2, ease: EASE, delay: 1.9 }}
      className="absolute right-6 top-24 z-10 hidden md:right-14 md:block lg:right-16"
    >
      <svg viewBox="0 0 100 100" className="spin-slow h-28 w-28 md:h-32 md:w-32">
        <defs>
          <path id="meridian-stamp-circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(236,229,216,0.25)" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(200,162,74,0.4)" strokeWidth="0.6" />
        <text fill="rgba(236,229,216,0.65)" fontSize="7.6" letterSpacing="2.2" fontFamily="Space Grotesk, sans-serif">
          <textPath href="#meridian-stamp-circ">MAISON MERIDIAN · GENÈVE · 1847 ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm text-gold">✦</span>
    </motion.div>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 110])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  // pointer parallax — the 3D stage drifts against the cursor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const imgX = useSpring(useTransform(mx, (v) => v * -16), { stiffness: 55, damping: 18 })
  const imgY = useSpring(useTransform(my, (v) => v * -10), { stiffness: 55, damping: 18 })
  const txtX = useSpring(useTransform(mx, (v) => v * 16), { stiffness: 80, damping: 20 })
  const txtY = useSpring(useTransform(my, (v) => v * 10), { stiffness: 80, damping: 20 })
  const yImgAll = useTransform([yImg, imgY], ([a, b]) => a + b)
  const yTxtAll = useTransform([yText, txtY], ([a, b]) => a + b)

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex h-svh min-h-[640px] flex-col overflow-hidden bg-[#070605]"
    >
      <motion.div className="absolute -inset-[3%]" style={{ x: imgX, y: yImgAll }}>
        {/* faint photographic base for cinematic depth */}
        <div className="absolute inset-0 opacity-40">
          <KenBurns src="/images/hero.jpg" alt="A Meridian dial under low golden light" className="h-full w-full" />
        </div>
        {/* warm pool of light behind the watch */}
        <div className="pointer-events-none absolute -right-[10%] top-1/2 h-[80vh] w-[62vw] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,162,74,0.14),transparent_62%)]" />
        {/* the live 3D timepiece */}
        <Watch3D />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070605]/75 via-transparent to-ink" />
      <Dust />
      <Stamp ready={ready} />

      <motion.div style={{ x: txtX, y: yTxtAll, opacity: fade }} className="relative z-10 mt-auto px-6 pb-16 md:px-14 md:pb-20">
        <FadeUp when={ready} delay={0.2} className="mb-8">
          <p className="font-grot text-[10px] uppercase tracking-[0.45em] text-cream/60">
            Maison Horlogère — Genève — Est. 1847
          </p>
        </FadeUp>

        <h1 className="max-w-[16ch] font-serif text-[13vw] font-light leading-[0.98] text-cream md:text-[7.2vw]">
          <MaskText when={ready} delay={0.35} stagger={0.07}>
            Time is not measured.
          </MaskText>
          <span className="block">
            <MaskText when={ready} delay={0.85} stagger={0.09} className="italic text-gold-bright">
              It is made.
            </MaskText>
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <FadeUp when={ready} delay={1.45} className="max-w-md">
            <p className="text-sm leading-relaxed text-cream/70">
              For one hundred and seventy-nine years, the Maison Meridian has built mechanical timepieces by hand in
              the city of water — one dial, one bridge, one heartbeat at a time.
            </p>
            <p className="mt-4 font-serif text-sm italic text-cream/45">
              The timepiece above is alive — it is keeping your local time, right now.
            </p>
          </FadeUp>
          <FadeUp when={ready} delay={1.6} className="flex items-center gap-4">
            <span className="relative h-14 w-px overflow-hidden bg-cream/15">
              <span className="scroll-line absolute inset-x-0 h-full bg-gold" />
            </span>
            <span className="font-grot text-[10px] uppercase tracking-[0.35em] text-cream/50">
              Scroll — Chapter I
            </span>
          </FadeUp>
        </div>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-44 right-6 z-10 hidden md:right-14 lg:block">
        <p className="text-right font-grot text-[10px] leading-loose tracking-[0.3em] text-cream/40">
          46.2044° N — 6.1432° E
          <br />
          RUE DU RHÔNE 47
          <br />
          1204 GENÈVE
        </p>
      </motion.div>

      <motion.p
        style={{ opacity: fade }}
        className="absolute bottom-24 right-6 z-10 hidden text-right font-grot text-[9px] leading-loose tracking-[0.3em] text-gold/60 md:right-14 lg:block"
      >
        LIVE 3D — RENDERED IN YOUR BROWSER
        <br />
        KEEPING YOUR LOCAL TIME
      </motion.p>
    </section>
  )
}
