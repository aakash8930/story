import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MaskText, ScrambleText } from '../lib/kit.jsx'

const EVENTS = [
  {
    year: '1847',
    title: 'A bench in the city of water',
    body: 'Émile Vasseur rents a single room above the Rhône and sets one rule that has never since been broken: nothing leaves the bench that the maker would not wear himself.',
  },
  {
    year: '1889',
    title: 'Paris, the great fair',
    body: 'A Meridian chronometer is wound into the exposition and wins the Grand Prix for marine timekeeping over every rival in the palace.',
  },
  {
    year: '1931',
    title: 'The first flyback',
    body: 'Calibre 19-401: hand-wound, thirty-one jewels, and a chronograph that returns to zero without a single release of tension.',
  },
  {
    year: '1969',
    title: 'The two-hundred orbit test',
    body: 'A sealed prototype completes two hundred and forty orbits in the laboratory of the observatory — and returns within two seconds of the atomic clock.',
  },
  {
    year: '2004',
    title: 'The tourbillon returns',
    body: 'After forty years of silence, the Maison unveils the flying tourbillon MV-8: one rotation a minute, six grams of titanium and air.',
  },
  {
    year: '2026',
    title: 'The maison today',
    body: 'Nine generations, two hundred and fourteen artisans, one rule. The bench above the Rhône still faces the river.',
  },
]

export default function Timeline({ onNav }) {
  const secRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)

  useEffect(() => {
    const measure = () => {
      setDist(trackRef.current ? Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 96) : 0)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: secRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  return (
    <section
      id="timeline"
      ref={secRef}
      className="relative bg-[#0d0b09]"
      style={{ height: `${Math.min(340, 200 + Math.round((dist || 1200) / 10))}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mb-10 px-6 md:px-14">
          <ScrambleText text="CH. 04 — THE LEDGER" className="font-grot text-[10px] tracking-[0.45em] text-gold/80" />
          <MaskText
            as="h2"
            className="mt-5 font-serif text-4xl font-light text-cream md:text-6xl"
            delay={0.1}
          >
            One hundred and seventy-nine years.
          </MaskText>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-stretch gap-6 pl-6 pr-[10vw] md:gap-10 md:pl-14"
        >
          {EVENTS.map((e, i) => (
            <article
              key={e.year}
              className="w-[300px] shrink-0 border border-cream/10 bg-[#12100c] p-7 md:w-[380px] md:p-9"
              data-cursor="Read"
            >
              <p className="font-serif text-4xl italic text-gold md:text-5xl">{e.year}</p>
              <h3 className="mt-5 font-serif text-2xl font-light leading-snug text-cream md:text-[1.65rem]">
                {e.title}
              </h3>
              <p className="mt-4 text-[13px] leading-relaxed text-cream/55">{e.body}</p>
              <p className="mt-8 font-grot text-[9px] tracking-[0.3em] text-cream/30">
                ENTRY {String(i + 1).padStart(2, '0')} / 06 — LEDGER V.
              </p>
            </article>
          ))}

          <article className="flex w-[300px] shrink-0 flex-col justify-between border border-gold/30 bg-[#12100c] p-7 md:w-[420px] md:p-9">
            <p className="font-serif text-3xl font-light italic leading-snug text-cream md:text-4xl">
              The next entry is unwritten.
            </p>
            <button
              onClick={() => onNav('epilogue')}
              className="mt-10 self-start font-grot text-[10px] tracking-[0.3em] text-gold underline-offset-4 transition-opacity hover:underline hover:opacity-80"
              data-cursor="Read"
            >
              READ THE EPILOGUE — ↓
            </button>
          </article>
        </motion.div>

        <div className="relative mt-12 h-px w-full bg-cream/10 px-6 md:px-14">
          <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-x-6 top-0 h-px origin-left bg-gold md:inset-x-14" />
        </div>
      </div>
    </section>
  )
}
