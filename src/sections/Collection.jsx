import { FadeUp, MaskText, ScrambleText, Tilt } from '../lib/kit.jsx'

const WATCHES = [
  {
    name: 'Sovereign',
    ref: 'REF. MV-SV24 · CAL. MV-19',
    line: 'Small seconds · silver guilloché dial',
    price: 'CHF 48 500',
    img: '/images/watch-sovereign.jpg',
  },
  {
    name: 'Nocturne',
    ref: 'REF. MV-NC31 · CAL. MV-20',
    line: 'Moonphase · midnight blue grand feu',
    price: 'CHF 72 000',
    img: '/images/watch-nocturne.jpg',
  },
  {
    name: 'Méridien',
    ref: 'REF. MV-TB08 · CAL. MV-8',
    line: 'Flying tourbillon · anthracite skeleton',
    price: 'CHF 340 000',
    img: '/images/watch-meridien.jpg',
  },
]

export default function Collection() {
  return (
    <section id="collection" className="relative bg-cream text-ink">
      <div className="mx-auto max-w-[1500px] px-6 py-28 md:px-14 md:py-40">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <ScrambleText text="CH. 05 — THE COLLECTION" className="font-grot text-[10px] tracking-[0.45em] text-ink/45" />
            <MaskText
              as="h2"
              className="mt-6 font-serif text-5xl font-light leading-[1.02] md:text-7xl"
              delay={0.1}
            >
              Three instruments. One obsession.
            </MaskText>
          </div>
          <FadeUp delay={0.3} className="max-w-xs">
            <p className="text-sm leading-relaxed text-ink/60">
              Each is made in a small series, numbered by the hand that finished it. The series is announced once a
              year, in spring, to those who ask.
            </p>
          </FadeUp>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-3 md:gap-10">
          {WATCHES.map((w, i) => (
            <FadeUp key={w.name} delay={0.1 * i}>
              <Tilt max={7}>
                <article className="group cursor-pointer" data-cursor="View">
                <div className="relative overflow-hidden bg-[#141210]">
                  <img
                    src={w.img}
                    alt={`${w.name} — ${w.line}`}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 font-grot text-[9px] tracking-[0.3em] text-cream/80">
                    N° {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-3xl font-light">{w.name}</h3>
                    <p className="mt-2 font-grot text-[9px] tracking-[0.25em] text-ink/45">{w.ref}</p>
                    <p className="mt-3 text-[13px] text-ink/65">{w.line}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl">{w.price}</p>
                    <p className="mt-2 inline-block border-b border-ink/30 pb-0.5 font-grot text-[9px] tracking-[0.3em] text-ink/60 transition-colors duration-300 group-hover:border-gold group-hover:text-ink">
                      RESERVE →
                    </p>
                  </div>
                </div>
                </article>
              </Tilt>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
