const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E"

export default function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed -inset-[5%] z-[80] opacity-[0.08] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")` }}
    />
  )
}
