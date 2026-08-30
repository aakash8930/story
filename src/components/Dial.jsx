const TICKS = Array.from({ length: 60 }, (_, i) => i)

export default function Dial() {
  return (
    <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[520px]" role="img" aria-label="Meridian calibre dial, animated">
      <defs>
        <radialGradient id="dialbg" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#151310" />
          <stop offset="100%" stopColor="#070605" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="196" fill="url(#dialbg)" stroke="#c8a24a" strokeOpacity="0.5" strokeWidth="1" />
      <circle cx="200" cy="200" r="188" fill="none" stroke="#c8a24a" strokeOpacity="0.25" strokeWidth="0.75" />

      {TICKS.map((i) => {
        const a = (i * 6 * Math.PI) / 180
        const isHour = i % 5 === 0
        const r1 = isHour ? 158 : 168
        const r2 = 178
        const x1 = 200 + r1 * Math.sin(a)
        const y1 = 200 - r1 * Math.cos(a)
        const x2 = 200 + r2 * Math.sin(a)
        const y2 = 200 - r2 * Math.cos(a)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isHour ? '#c8a24a' : '#8a7a55'}
            strokeOpacity={isHour ? 0.9 : 0.4}
            strokeWidth={isHour ? 2.4 : 0.8}
          />
        )
      })}

      <g className="rot" style={{ animationDuration: '140s' }}>
        <circle
          cx="200"
          cy="200"
          r="146"
          fill="none"
          stroke="#c8a24a"
          strokeOpacity="0.35"
          strokeWidth="0.8"
          strokeDasharray="1.5 5.5"
        />
      </g>

      <text x="200" y="118" textAnchor="middle" fill="#e9e1cf" fontFamily="Cormorant Garamond, serif" fontSize="21" letterSpacing="6">
        MERIDIAN
      </text>
      <text x="200" y="134" textAnchor="middle" fill="#8a7a55" fontFamily="Space Grotesk, sans-serif" fontSize="7" letterSpacing="3">
        MAISON HORLOGÈRE · GENÈVE
      </text>
      <text x="200" y="286" textAnchor="middle" fill="#8a7a55" fontFamily="Space Grotesk, sans-serif" fontSize="7" letterSpacing="3">
        CALIBRE MV-19
      </text>
      <text x="200" y="299" textAnchor="middle" fill="#6b6047" fontFamily="Space Grotesk, sans-serif" fontSize="6" letterSpacing="2">
        MANUFACTURE · 1847
      </text>

      <g transform="rotate(305 200 200)">
        <g className="rot" style={{ animationDuration: '10800s' }}>
          <line x1="200" y1="200" x2="200" y2="128" stroke="#e9e1cf" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
      <g transform="rotate(145 200 200)">
        <g className="rot" style={{ animationDuration: '1200s' }}>
          <line x1="200" y1="200" x2="200" y2="92" stroke="#e9e1cf" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <g transform="rotate(95 200 200)">
        <g className="rot" style={{ animationDuration: '60s' }}>
          <line x1="200" y1="216" x2="200" y2="84" stroke="#c8a24a" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="200" cy="216" r="4" fill="#c8a24a" />
        </g>
      </g>

      <circle cx="200" cy="200" r="6" fill="#c8a24a" />
      <circle cx="200" cy="200" r="2.4" fill="#070605" />
    </svg>
  )
}
