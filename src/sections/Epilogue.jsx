import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FadeUp, LineDraw, Magnetic, MaskText } from '../lib/kit.jsx'

const LINKS = [
  ['Prologue', 'hero'],
  ['The Foundry', 'heritage'],
  ['The Craft', 'craft'],
  ['The Movement', 'movement'],
  ['The Ledger', 'timeline'],
  ['The Collection', 'collection'],
]

export default function Epilogue({ onNav }) {
  const [sent, setSent] = useState(false)
  const ref = useRef(null)
  const gx = useMotionValue(-500)
  const gy = useMotionValue(-500)
  const sgx = useSpring(gx, { stiffness: 110, damping: 20 })
  const sgy = useSpring(gy, { stiffness: 110, damping: 20 })

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    gx.set(e.clientX - r.left)
    gy.set(e.clientY - r.top)
  }

  return (
    <section id="epilogue" ref={ref} onMouseMove={onMove} className="relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[80vh] w-[130vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(200,162,74,0.08),transparent_60%)]" />
      <motion.div
        style={{ x: sgx, y: sgy }}
        className="pointer-events-none absolute -left-[260px] -top-[260px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(200,162,74,0.09),transparent_60%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-28 md:px-14 md:pt-44">
        <p className="font-grot text-[10px] uppercase tracking-[0.45em] text-gold/80">CH. 06 — EPILOGUE</p>
        <MaskText
          as="h2"
          className="mt-8 max-w-[12ch] font-serif text-6xl font-light leading-[1.02] md:text-8xl"
          stagger={0.07}
        >
          Own the next chapter.
        </MaskText>

        <div className="mt-12 max-w-xl">
          <FadeUp delay={0.2}>
            <p className="text-sm leading-relaxed text-cream/60">
              Appointments are private and held in a limited number, in Genève and in London. Tell us where to write,
              and we will answer by letter.
            </p>
          </FadeUp>

          <LineDraw className="mb-8 mt-10 w-16 bg-gold/50" />

          <form
            className="mt-0"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            {sent ? (
              <FadeUp when={true} delay={0.1}>
                <p className="border-b border-gold/40 pb-4 font-serif text-2xl italic text-gold-bright">
                  Received. Expect a letter within two days.
                </p>
              </FadeUp>
            ) : (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                <label className="flex-1">
                  <span className="font-grot text-[9px] uppercase tracking-[0.3em] text-cream/40">Your address</span>
                  <input
                    type="email"
                    required
                    placeholder="name@atelier.com"
                    className="mt-2 w-full border-b border-cream/25 bg-transparent py-3 text-base text-cream outline-none transition-colors duration-300 placeholder:text-cream/25 focus:border-gold"
                  />
                </label>
                <Magnetic>
                  <button
                    type="submit"
                    className="group relative overflow-hidden border border-gold/60 px-8 py-4 font-grot text-[10px] uppercase tracking-[0.35em] text-gold"
                    data-cursor="Send"
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                      Request an appointment
                    </span>
                  </button>
                </Magnetic>
              </div>
            )}
          </form>
        </div>

        <footer className="mt-28 border-t border-cream/10">
          <div className="grid gap-10 py-14 md:grid-cols-3">
            <div>
              <p className="font-serif text-lg tracking-[0.35em] text-cream">MERIDIAN</p>
              <p className="mt-5 font-grot text-[10px] leading-loose tracking-[0.2em] text-cream/40">
                RUE DU RHÔNE 47
                <br />
                1204 GENÈVE, SUISSE
                <br />
                BY APPOINTMENT ONLY
              </p>
            </div>
            <nav className="flex flex-col items-start gap-2.5" aria-label="Footer">
              {LINKS.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => onNav(id)}
                  className="font-grot text-[10px] uppercase tracking-[0.25em] text-cream/50 transition-colors hover:text-gold"
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="font-grot text-[10px] leading-loose tracking-[0.2em] text-cream/30 md:text-right">
              © 2026 MAISON MERIDIAN SA
              <br />
              A FICTIONAL MAISON — CRAFTED AS A DESIGN STUDY
              <br />
              TIME IS MADE BY HAND
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
