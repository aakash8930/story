import { motion } from 'framer-motion'
import Dial from '../components/Dial.jsx'
import { Counter, FadeUp, MaskText, ScrambleText } from '../lib/kit.jsx'

const fmt = (v) => {
  const n = Math.round(v)
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
}

const SPECS = [
  { value: 312, label: 'Components', format: null },
  { value: 72, label: 'Power reserve', suffix: ' h' },
  { value: 28800, label: 'Beats per hour', format: fmt },
  { value: 21, label: 'Ruby jewels' },
  { value: 415, label: 'Diameter', format: (v) => (Math.round(v) / 10).toFixed(1).replace('.', ','), suffix: ' mm' },
  { value: 21, label: 'Days in observatory' },
]

export default function Movement() {
  return (
    <section id="movement" className="relative overflow-hidden bg-[#070605] py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,162,74,0.07),transparent_65%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-14">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <ScrambleText text="CH. 03 — THE MOVEMENT" className="font-grot text-[10px] tracking-[0.45em] text-gold/80" />
            <MaskText
              as="h2"
              className="mt-7 font-serif text-5xl font-light leading-[1.02] text-cream md:text-7xl"
              delay={0.1}
            >
              The architecture of a day.
            </MaskText>
            <FadeUp delay={0.25} className="mt-8 max-w-md">
              <p className="text-sm leading-relaxed text-cream/60">
                Calibre MV-19 is drawn, engraved and decorated entirely within the Maison. It beats 28,800 times an
                hour, carries two days of your life on a single wind, and will outlive the wrist that sets it.
              </p>
            </FadeUp>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {SPECS.map((s, i) => (
                <FadeUp key={s.label} delay={0.05 * i}>
                  <div className="border-t border-cream/15 pt-4">
                    <p className="font-serif text-3xl text-cream tabular-nums md:text-4xl">
                      <Counter value={s.value} format={s.format} />
                      {s.suffix}
                    </p>
                    <p className="mt-2 font-grot text-[10px] uppercase tracking-[0.25em] text-cream/45">{s.label}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Dial />
            </motion.div>
            <p className="mt-8 text-center font-grot text-[10px] tracking-[0.3em] text-cream/35">
              CAL. MV-19 — DRAWN 1849 · RE-ENGRAVED 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
