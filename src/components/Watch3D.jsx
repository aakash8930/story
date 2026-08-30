import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/**
 * Procedurally-built Meridian wristwatch, rendered live.
 * The watchhead is assembled from primitives (case, faceted bezel, guilloché
 * dial texture, applied indices, real-time hands, crown, lugs, straps) and
 * turntable-swings like a product film while keeping the visitor's local time.
 */

function makeDialTexture() {
  const size = 1024
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const cx = size / 2

  ctx.fillStyle = '#0d0b08'
  ctx.fillRect(0, 0, size, size)

  // sunburst / guilloché rays
  ctx.save()
  ctx.translate(cx, cx)
  for (let i = 0; i < 240; i++) {
    const a = (i / 240) * Math.PI * 2
    ctx.strokeStyle = i % 2 ? 'rgba(233,225,207,0.030)' : 'rgba(233,225,207,0.052)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(Math.cos(a) * 36, Math.sin(a) * 36)
    ctx.lineTo(Math.cos(a) * 484, Math.sin(a) * 484)
    ctx.stroke()
  }
  for (let r = 56; r <= 470; r += 13) {
    ctx.strokeStyle = 'rgba(233,225,207,0.026)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()

  // minute track
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2
    const isHour = i % 5 === 0
    const r1 = isHour ? 424 : 448
    const r2 = 472
    ctx.strokeStyle = isHour ? 'rgba(200,162,74,0.9)' : 'rgba(233,225,207,0.4)'
    ctx.lineWidth = isHour ? 5 : 2
    ctx.beginPath()
    ctx.moveTo(cx + Math.sin(a) * r1, cx - Math.cos(a) * r1)
    ctx.lineTo(cx + Math.sin(a) * r2, cx - Math.cos(a) * r2)
    ctx.stroke()
  }

  // print
  ctx.textAlign = 'center'
  ctx.fillStyle = '#e9e1cf'
  ctx.font = '300 52px "Cormorant Garamond", Georgia, serif'
  ctx.fillText('M E R I D I A N', cx, cx - 116)
  ctx.fillStyle = 'rgba(138,122,85,0.95)'
  ctx.font = '400 21px "Space Grotesk", sans-serif'
  ctx.fillText('MAISON HORLOGÈRE · GENÈVE', cx, cx - 82)
  ctx.fillText('CALIBRE MV-19', cx, cx + 172)
  ctx.fillStyle = 'rgba(107,96,71,0.95)'
  ctx.font = '400 15px "Space Grotesk", sans-serif'
  ctx.fillText('MANUFACTURE · 1847', cx, cx + 200)

  ctx.strokeStyle = 'rgba(200,162,74,0.5)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cx, 482, 0, Math.PI * 2)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export default function Watch3D({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      mount.style.display = 'none'
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60)
    camera.position.set(0, 0.1, 4.7)

    // key + warm rim so the gold reads against the dark
    const keyLight = new THREE.PointLight(0xfff2d9, 26, 0, 2)
    keyLight.position.set(2.2, 1.4, 3.2)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0xe3c576, 34, 0, 2)
    rimLight.position.set(-2.6, 2.2, 2.4)
    scene.add(rimLight)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = envRT.texture

    // ---------- materials ----------
    const gold = new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 1, roughness: 0.3 })
    const goldBright = new THREE.MeshStandardMaterial({ color: 0xdfb95e, metalness: 1, roughness: 0.2 })
    const steelDark = new THREE.MeshStandardMaterial({ color: 0x2b251d, metalness: 0.9, roughness: 0.45 })
    const leather = new THREE.MeshStandardMaterial({ color: 0x141009, metalness: 0, roughness: 0.92 })
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      depthWrite: false,
    })
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x0d0b08, metalness: 0.4, roughness: 0.5 })

    // ---------- watch build ----------
    const watch = new THREE.Group()

    const caseGeo = new THREE.CylinderGeometry(1.0, 1.02, 0.3, 96)
    caseGeo.rotateX(Math.PI / 2)
    watch.add(new THREE.Mesh(caseGeo, gold))

    const backGeo = new THREE.CylinderGeometry(0.94, 0.94, 0.06, 96)
    backGeo.rotateX(Math.PI / 2)
    const back = new THREE.Mesh(backGeo, steelDark)
    back.position.z = -0.16
    watch.add(back)

    // faceted "coin edge" bezel
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.075, 8, 96), goldBright)
    bezel.position.z = 0.14
    watch.add(bezel)

    const rehaut = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.028, 8, 96), steelDark)
    rehaut.position.z = 0.125
    watch.add(rehaut)

    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.88, 96), dialMat)
    dial.position.z = 0.13
    watch.add(dial)

    // applied indices (batons), doubled at 6, triangle at 12
    const idxGeo = new THREE.BoxGeometry(0.035, 0.17, 0.025)
    for (let i = 0; i < 12; i++) {
      if (i === 0) continue
      const a = (i / 12) * Math.PI * 2
      const r = 0.7
      const offsets = i === 6 ? [-0.05, 0.05] : [0]
      for (const off of offsets) {
        const idx = new THREE.Mesh(idxGeo, goldBright)
        idx.position.set(Math.sin(a) * r + off, Math.cos(a) * r, 0.15)
        idx.rotation.z = -a
        watch.add(idx)
      }
    }
    const triGeo = new THREE.ConeGeometry(0.055, 0.13, 3)
    triGeo.scale(1, 1, 0.4)
    const tri = new THREE.Mesh(triGeo, goldBright)
    tri.position.set(0, 0.74, 0.15)
    tri.rotation.z = Math.PI
    watch.add(tri)

    // hands (pivot at tail end so rotation.z == clock angle)
    const makeHand = (width, length, thickness, mat, z, tail = 0.09) => {
      const g = new THREE.Group()
      const geo = new THREE.BoxGeometry(width, length, thickness)
      geo.translate(0, (length - tail) / 2, 0)
      g.add(new THREE.Mesh(geo, mat))
      g.position.z = z
      return g
    }
    const hourHand = makeHand(0.055, 0.46, 0.022, goldBright, 0.16)
    const minHand = makeHand(0.045, 0.62, 0.02, goldBright, 0.175)
    const secHand = makeHand(0.014, 0.72, 0.012, gold, 0.19, 0.16)
    const cwGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.014, 24)
    cwGeo.rotateX(Math.PI / 2)
    const cw = new THREE.Mesh(cwGeo, gold)
    cw.position.y = -0.12
    secHand.add(cw)
    const capGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.03, 24)
    capGeo.rotateX(Math.PI / 2)
    watch.add(new THREE.Mesh(capGeo, goldBright))
    watch.add(hourHand, minHand, secHand)

    // sapphire (flat)
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.92, 96), glassMat)
    glass.position.z = 0.195
    watch.add(glass)

    // crown
    const crownGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.09, 24)
    crownGeo.rotateZ(Math.PI / 2)
    const crown = new THREE.Mesh(crownGeo, goldBright)
    crown.position.set(1.09, 0, 0)
    watch.add(crown)
    const domeGeo = new THREE.SphereGeometry(0.072, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)
    domeGeo.rotateZ(-Math.PI / 2)
    const dome = new THREE.Mesh(domeGeo, gold)
    dome.position.set(1.135, 0, 0)
    watch.add(dome)

    // lugs
    const lugGeo = new THREE.BoxGeometry(0.16, 0.34, 0.24)
    for (const [x, y] of [
      [0.5, 0.92],
      [-0.5, 0.92],
      [0.5, -0.92],
      [-0.5, -0.92],
    ]) {
      const lug = new THREE.Mesh(lugGeo, gold)
      lug.position.set(x, y, -0.02)
      lug.rotation.x = y > 0 ? -0.18 : 0.18
      watch.add(lug)
    }

    // straps (leather tubes sweeping back)
    const strap = (sign) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, sign * 1.02, -0.05),
        new THREE.Vector3(0, sign * 1.3, -0.3),
        new THREE.Vector3(0, sign * 1.5, -0.8),
        new THREE.Vector3(0, sign * 1.58, -1.4),
      ])
      const geo = new THREE.TubeGeometry(curve, 28, 0.3, 12, false)
      return new THREE.Mesh(geo, leather)
    }
    watch.add(strap(1), strap(-1))

    watch.rotation.x = -0.38
    watch.rotation.z = -0.07
    scene.add(watch)

    // ---------- responsive layout ----------
    let baseY = 0
    let baseCamZ = 4.7
    const lookTarget = new THREE.Vector3(0.5, 0, 0)
    const layout = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (w < 768) {
        // phone: watch floats in the upper half, headline lives below
        watch.position.x = 0
        baseY = 0.3
        watch.scale.setScalar(0.55)
        baseCamZ = 5.2
        camera.position.set(0, 0.15, baseCamZ)
        lookTarget.set(0, 0.15, 0)
      } else if (w < 1100) {
        watch.position.x = 0.75
        baseY = 0
        watch.scale.setScalar(0.9)
        baseCamZ = 4.8
        camera.position.set(0, 0.1, baseCamZ)
        lookTarget.set(0.35, 0, 0)
      } else {
        watch.position.x = 0.95
        baseY = 0
        watch.scale.setScalar(1.05)
        baseCamZ = 4.7
        camera.position.set(0, 0.1, baseCamZ)
        lookTarget.set(0.5, 0, 0)
      }
      camera.lookAt(lookTarget)
    }
    layout()
    window.addEventListener('resize', layout)

    // ---------- pointer + visibility ----------
    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let inView = true
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
    })
    io.observe(mount)

    // ---------- loop ----------
    const baseTiltX = -0.38
    const baseTiltZ = -0.07
    const t0 = performance.now()
    let raf = 0

    const frame = () => {
      const t = (performance.now() - t0) / 1000
      const sway = Math.sin(t * 0.21) * 0.6
      const tx = baseTiltX + mouse.y * 0.16 + Math.sin(t * 0.5) * 0.02
      const ty = sway + mouse.x * 0.4
      watch.rotation.x += (tx - watch.rotation.x) * 0.06
      watch.rotation.y += (ty - watch.rotation.y) * 0.06
      watch.rotation.z = baseTiltZ + Math.sin(t * 0.33) * 0.02
      watch.position.y = baseY + Math.sin(t * 0.7) * 0.05

      // slow cinematic push-pull, like a product film
      camera.position.z = baseCamZ + Math.sin(t * 0.13) * 0.2
      camera.lookAt(lookTarget)

      // live local time
      const now = new Date()
      const s = now.getSeconds() + now.getMilliseconds() / 1000
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60
      hourHand.rotation.z = -(h / 12) * Math.PI * 2
      minHand.rotation.z = -(m / 60) * Math.PI * 2
      secHand.rotation.z = -(s / 60) * Math.PI * 2

      renderer.render(scene, camera)
    }
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (document.hidden || !inView) return
      frame()
    }
    loop()

    // re-draw the dial print once webfonts are ready (texture was created with fallback serif)
    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      dialMat.map = makeDialTexture()
      dialMat.color.set(0xffffff)
      dialMat.needsUpdate = true
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('mousemove', onMove)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((mm) => {
            if (mm.map) mm.map.dispose()
            mm.dispose()
          })
        }
      })
      envRT.texture.dispose()
      pmrem.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className={'pointer-events-none absolute inset-0 z-[3] ' + className} aria-hidden />
}
