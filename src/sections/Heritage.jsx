import { FadeUp, MaskText, Parallax, ScrambleText } from '../lib/kit.jsx'

export default function Heritage() {
  return (
    <section id="heritage" className="relative bg-cream text-ink">
      <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-24 md:px-14 md:pb-40 md:pt-36">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-36">
              <ScrambleText text="CH. 01 — HERITAGE" className="font-grot text-[10px] tracking-[0.45em] text-ink/45" />
              <MaskText
                as="h2"
                className="mt-7 font-serif text-6xl font-light leading-[0.98] md:text-8xl"
                delay={0.15}
              >
                The Foundry
              </MaskText>

              <FadeUp delay={0.3} className="mt-10">
                <p className="text-[15px] leading-[2] text-ink/75">
                  <span className="float-left mr-3 mt-1.5 font-serif text-[4.2rem] leading-[0.75] text-gold">I</span>
                  n the winter of 1847, Émile Vasseur rented a single room above the Rhône, set one lathe against the
                  cold wall, and made a rule for the Maison that has never since been broken: nothing leaves the bench
                  that the maker would not wear on his own wrist.
                </p>
                <p className="mt-6 text-[15px] leading-[2] text-ink/75">
                  The first piece — a silver pocket chronometer, number 0001 — still keeps time. We wind it every
                  morning at seven, before the workshops open, in the same room where it was born.
                </p>
              </FadeUp>

              <FadeUp delay={0.4} className="mt-10 flex items-center gap-4">
                <span className="h-px w-10 bg-ink/30" />
                <span className="font-serif text-2xl italic">Émile Vasseur</span>
                <span className="font-grot text-[9px] tracking-[0.3em] text-ink/45">FOUNDER · 1847</span>
              </FadeUp>
            </div>
          </div>

          <div className="space-y-10 md:col-span-7 md:space-y-16">
            <div className="md:pr-12">
              <Parallax
                src="/images/archive.jpg"
                alt="Émile Vasseur at the lathe, circa 1849"
                className="aspect-[4/5] w-full md:w-[76%]"
                strength={7}
              />
              <FadeUp delay={0.2}>
                <p className="mt-4 font-grot text-[9px] tracking-[0.28em] text-ink/45">
                  PL. 01 — THE WORKSHOP ON RUE DU RHÔNE · ARCHIVE, CIRCA 1849
                </p>
              </FadeUp>
            </div>
            <div className="md:pl-16">
              <Parallax
                src="/images/workshop.jpg"
                alt="The Meridian atelier today"
                className="aspect-[3/2] w-full md:w-[88%]"
                strength={7}
              />
              <FadeUp delay={0.2}>
                <p className="mt-4 font-grot text-[9px] tracking-[0.28em] text-ink/45">
                  PL. 02 — THE SAME ROOM · NINE GENERATIONS LATER
                </p>
              </FadeUp>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-28 max-w-4xl md:mt-44">
          <MaskText
            as="p"
            className="font-serif text-4xl font-light italic leading-[1.18] md:text-6xl"
            stagger={0.045}
          >
            “A watch is a letter the future writes back to you.”
          </MaskText>
          <FadeUp delay={0.35} className="mt-8">
            <span className="font-grot text-[9px] tracking-[0.3em] text-ink/45">
              PRIVATE NOTEBOOK OF THE FOUNDER — P. 12
            </span>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
