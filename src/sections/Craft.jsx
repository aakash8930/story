import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp, MaskText, ScrambleText } from '../lib/kit.jsx'

const STEPS = [
  {
    n: '01',
    title: 'The Guilloché',
    img: '/images/craft-guilloche.jpg',
    meta: 'ROSE ENGINE · 19 MIN PER DIAL',
    body: 'Each dial is cut on a nineteenth-century rose engine, one radial line at a time. A single face holds 2,400 grooves — and a single wavered stroke is polished away, and the work begins again.',
  },
  {
    n: '02',
    title: 'Black Polishing',
    img: '/images/craft-polish.jpg',
    meta: 'AGATE & ROUGE · ANGLAGE AT 45°',
    body: 'Bridge edges are brought to a mirror that swallows the light. The bevel is drawn by hand at forty-five degrees — the oldest geometry in watchmaking, and the fastest way to judge a house.',
  },
  {
    n: '03',
    title: 'The Assembly',
    img: '/images/craft-assembly.jpg',
    meta: 'CALIBRE MV-19 · 312 PARTS',
    body: 'Three hundred and twelve components are assembled in the order the founder wrote down in 1849. No step is skipped. None is added. The movement is signed before it is allowed to keep time.',
  },
  {
    n: '04',
    title: 'The Observation',
    img: '/images/craft-observation.jpg',
    meta: '21 DAYS · 6 POSITIONS · 5 TEMPERATURES',
    body: 'Every movement spends three weeks in the observatory — six positions, five temperatures — before it earns the seal. Fewer than one in nine leaves with it.',
  },
]

const N = STEPS.length

export default function Craft() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Per-panel local progress (0..1 while pinned), derived from the section progress.
  const locals = []
  for (let i = 0; i < N; i++) {
    const local = useTransform(scrollYProgress, [0, 1], [-i, N - 1 - i])
    locals.push({
      y: useTransform(local, [0, 0.3], [60, 0]),
      o: useTransform(local, [0, 0.3], [0, 1]),
    })
  }

  return (
    <section id="craft" className="relative bg-coal">
      <div className="mx-auto max-w-[1500px] px-6 pt-28 md:px-14 md:pt-40">
        <ScrambleText text="CH. 02 — THE CRAFT" className="font-grot text-[10px] tracking-[0.45em] text-gold/80" />
        <MaskText
          as="h2"
          className="mt-7 max-w-[18ch] font-serif text-5xl font-light leading-[1.02] text-cream md:text-7xl"
          delay={0.1}
        >
          Four hundred hours. One pair of hands.
        </MaskText>
        <FadeUp delay={0.25} className="mt-8 max-w-lg">
          <p className="text-sm leading-relaxed text-cream/60">
            Nothing in a Meridian is made by machine for the sake of speed. What the machines cannot do, the hands do —
            slowly, and without forgiveness.
          </p>
        </FadeUp>
      </div>

      <div ref={ref}>
        {STEPS.map((s, i) => (
          <div key={s.n} className="h-svh">
            <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden bg-coal">
              <div className="mx-auto grid w-full max-w-[1500px] items-center gap-10 px-6 md:grid-cols-2 md:px-14">
                <motion.div
                  style={i === 0 ? undefined : { y: locals[i].y, opacity: locals[i].o }}
                  className="order-2 md:order-1"
                >
                  <span
                    className="font-serif text-[16vw] font-light leading-none text-transparent md:text-[7vw]"
                    style={{ WebkitTextStroke: '1px rgba(200,162,74,0.55)' }}
                  >
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-serif text-4xl font-light text-cream md:text-6xl">{s.title}</h3>
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/65">{s.body}</p>
                  <p className="mt-8 font-grot text-[10px] tracking-[0.3em] text-gold">{s.meta}</p>
                </motion.div>

                <motion.div style={i === 0 ? undefined : { y: locals[i].y }} className="order-1 md:order-2">
                  <div className="relative aspect-[4/5] max-h-[56vh] w-full overflow-hidden">
                    <img src={s.img} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 ring-1 ring-cream/10 ring-inset" />
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-6 left-6 font-grot text-[10px] tracking-[0.3em] text-cream/30 md:left-14">
                STEP {s.n} / 04
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
