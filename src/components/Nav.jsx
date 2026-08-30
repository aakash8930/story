import { motion } from 'framer-motion'
import { EASE } from '../lib/kit.jsx'

const LINKS = [
  ['Prologue', 'hero'],
  ['Foundry', 'heritage'],
  ['Craft', 'craft'],
  ['Movement', 'movement'],
  ['Ledger', 'timeline'],
  ['Collection', 'collection'],
]

export default function Nav({ ready, onNav }) {
  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
      className="fixed inset-x-0 top-0 z-[70] mix-blend-difference"
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <button
          onClick={() => onNav('hero')}
          className="font-serif text-lg tracking-[0.35em] text-white"
          aria-label="Meridian — back to top"
        >
          MERIDIAN
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Chapters">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="group relative font-grot text-[10px] uppercase tracking-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
            >
              {label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        <button
          onClick={() => onNav('epilogue')}
          className="border-b border-white/40 pb-1 font-grot text-[10px] uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:border-white"
        >
          Réservé — 2026
        </button>
      </div>
    </motion.header>
  )
}
