import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp, KenBurns, MaskText } from '../lib/kit.jsx'

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  return (
    <section id="hero" ref={ref} className="relative flex h-svh min-h-[620px] flex-col overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ y: yImg }}>
        <KenBurns src="/images/hero.jpg" alt="A Meridian dial under low golden light" className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/15 to-ink" />

      <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 mt-auto px-6 pb-16 md:px-14 md:pb-20">
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
              For one hundred and seventy-nine years, the Maison Meridian has built mechanical timepieces by hand in the
              city of water — one dial, one bridge, one heartbeat at a time.
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
    </section>
  )
}
