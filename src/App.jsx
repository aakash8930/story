import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { MotionConfig } from 'framer-motion'
import Cursor from './components/Cursor.jsx'
import Grain from './components/Grain.jsx'
import Nav from './components/Nav.jsx'
import Preloader from './components/Preloader.jsx'
import ProgressRail from './components/ProgressRail.jsx'
import Hero from './sections/Hero.jsx'
import Heritage from './sections/Heritage.jsx'
import Craft from './sections/Craft.jsx'
import Movement from './sections/Movement.jsx'
import Timeline from './sections/Timeline.jsx'
import Collection from './sections/Collection.jsx'
import Epilogue from './sections/Epilogue.jsx'
import { Marquee } from './lib/kit.jsx'

export default function App() {
  const lenisRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (ready) lenisRef.current?.start()
    else lenisRef.current?.stop()
  }, [ready])

  const onNav = (id) => lenisRef.current?.scrollTo(`#${id}`, { offset: 0, duration: 1.5 })

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink font-sans text-cream antialiased">
        {!ready && <Preloader onDone={() => setReady(true)} />}
        <Cursor />
        <Grain />
        <Nav ready={ready} onNav={onNav} />
        <ProgressRail onNav={onNav} />

        <main>
          <Hero ready={ready} />
          <Marquee
            className="border-y border-cream/10 bg-ink text-cream"
            items={['Hand-finished in Genève', 'Since 1847', 'Calibre MV-19', 'One in nine earns the seal']}
          />
          <Heritage />
          <Craft />
          <Movement />
          <Timeline onNav={onNav} />
          <Marquee
            className="border-y border-cream/10 bg-ink text-cream"
            items={['Own the next chapter', 'Genève', 'London', 'By appointment only']}
          />
          <Collection />
          <Epilogue onNav={onNav} />
        </main>
      </div>
    </MotionConfig>
  )
}
