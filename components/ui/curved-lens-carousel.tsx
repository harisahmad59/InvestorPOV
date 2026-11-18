'use client'

import * as React from 'react'

// A photo carousel seen through a curved lens, drawn on one WebGL canvas: the
// middle card reads flat, and the further a card travels from the centre, the
// taller and more bent it grows, with a fringe of colour split at the rim.
// Drag, flick or use the arrow keys; it settles on a spring and loops.
//
// This is the "3d-curved-carousel" component with its stage stripped back for
// this site: no dark background, no title, caption, counter or buttons. Only
// the sliding cards remain, on a transparent canvas.

export type LensSlide = {
  /** Photo URL. Portrait (about 4:5) reads best. */
  image: string
  /** Read out to screen readers; the canvas itself is decorative. */
  alt: string
}

export type CurvedLensCarouselProps = {
  slides: LensSlide[]
  /** Name of the carousel for screen readers. */
  label: string
  /** How hard the lens bends the outer cards. 0 is flat. */
  bend?: number
  className?: string
}

// #region motion
/** Wraps any index into 0..n-1. */
function wrap(i: number, n: number): number {
  return n > 0 ? ((i % n) + n) % n : 0
}

/** Signed distance of slide i from the scroll position, taking the short way round a loop of n. */
function offsetOf(i: number, pos: number, n: number): number {
  if (n <= 0) return 0
  return wrap(i - pos + n / 2, n) - n / 2
}

/** Where a flick comes to rest: the nearest whole slide past the release, at most `max` away. */
function restFor(pos: number, velocity: number, max = 3): number {
  return Math.round(pos + Math.max(-max, Math.min(max, velocity * 0.18)))
}

/** One step of a critically damped spring (slides, slides/s, seconds). */
function springStep(pos: number, vel: number, target: number, dt: number, omega = 11): [number, number] {
  const a = (target - pos) * omega * omega - vel * 2 * omega
  const v = vel + a * dt
  return [pos + v * dt, v]
}

/**
 * Card size in px for a stage of w × h. Portrait cards; the height share leaves
 * room for the outer cards, which the lens stretches to about 1.55× at the edge.
 */
function cardSize(w: number, h: number): [number, number] {
  const cw = Math.min(w < 640 ? w * 0.56 : w * 0.22, h * 0.5)
  return [Math.round(cw), Math.round(cw * 1.25)]
}
// #endregion

const VERT =
  'attribute vec2 aPos;' +
  'uniform vec2 uRes;uniform vec2 uSize;uniform float uX;uniform float uBend;uniform float uVel;uniform float uIntro;' +
  'varying vec2 vUv;varying float vX;' +
  'void main(){' +
  'vec2 p=vec2(uX+(aPos.x-.5)*uSize.x,(aPos.y-.5)*uSize.y);' +
  'p.y-=(1.-uIntro)*uSize.y*.9;' +
  'vec2 n=p/(uRes*.5);' +
  'float x=clamp(n.x,-1.4,1.4);' +
  'n.y*=1.+uBend*x*x;' +
  'n.y+=uVel*.05*sin(aPos.x*3.14159)*(aPos.y-.5);' +
  'n.x*=1.-.06*uBend*x*x;' +
  'vUv=aPos;vX=x;' +
  'gl_Position=vec4(n,0.,1.);}'

// Lighter than the original: on a pale page the outer cards are only slightly
// dimmed, an unloaded card is pale grey rather than near-black, and each card
// gets a thin grey edge so pale pictures do not melt into the page.
const FRAG =
  'precision highp float;' +
  'uniform sampler2D uTex;uniform vec2 uSize;uniform float uAspect;uniform float uVel;uniform float uIntro;uniform float uShift;uniform float uReady;' +
  'varying vec2 vUv;varying float vX;' +
  'float box(vec2 q,vec2 b,float r){vec2 d=abs(q)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}' +
  'void main(){' +
  'float a=uSize.x/uSize.y;vec2 uv=vUv-.5;' +
  'if(uAspect>a)uv.x*=a/uAspect;else uv.y*=uAspect/a;' +
  'uv=uv/1.12+.5;uv.x+=uShift;' +
  'float ca=(.0012+.0045*vX*vX)*(1.+abs(uVel)*1.2);' +
  'vec3 c=vec3(texture2D(uTex,uv+vec2(ca,0.)).r,texture2D(uTex,uv).g,texture2D(uTex,uv-vec2(ca,0.)).b);' +
  'c=mix(vec3(.93,.92,.93),c,uReady);' +
  'c*=1.-.16*min(1.,vX*vX);' +
  'float d=box((vUv-.5)*uSize,uSize*.5,18.);' +
  'float rim=smoothstep(-2.4,-.4,d);' +
  'c=mix(c,vec3(.80,.78,.80),rim);' +
  'float al=smoothstep(.75,-.75,d)*uIntro;' +
  'gl_FragColor=vec4(c*al,al);}'

function shader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type) as WebGLShader
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

/** A (segX × segY) grid of quads as triangles, positions 0..1. */
function grid(segX: number, segY: number): Float32Array {
  const out: number[] = []
  for (let y = 0; y < segY; y++)
    for (let x = 0; x < segX; x++) {
      const x0 = x / segX,
        x1 = (x + 1) / segX,
        y0 = y / segY,
        y1 = (y + 1) / segY
      out.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1)
    }
  return new Float32Array(out)
}

export default function CurvedLensCarousel({ slides, label, bend = 0.55, className }: CurvedLensCarouselProps) {
  const n = slides.length
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [index, setIndex] = React.useState(0)
  const [noGL, setNoGL] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root || n === 0) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true })
    if (!gl) {
      setNoGL(true)
      return
    }
    const prog = gl.createProgram() as WebGLProgram
    gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('curved-lens-carousel: ' + gl.getProgramInfoLog(prog))
      setNoGL(true)
      return
    }
    gl.useProgram(prog)
    const mesh = grid(36, 12)
    const buf = gl.createBuffer() as WebGLBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u: Record<string, WebGLUniformLocation | null> = {}
    for (const k of ['uRes', 'uSize', 'uX', 'uBend', 'uVel', 'uIntro', 'uTex', 'uAspect', 'uShift', 'uReady']) u[k] = gl.getUniformLocation(prog, k)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    let disposed = false
    const tex = slides.map((s) => {
      const t = gl.createTexture() as WebGLTexture
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([237, 235, 237, 255]))
      for (const [p, v] of [
        [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
        [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
        [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
      ])
        gl.texParameteri(gl.TEXTURE_2D, p, v)
      const entry = { t, aspect: 0.8, ready: false }
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        gl.bindTexture(gl.TEXTURE_2D, t)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        entry.aspect = img.naturalWidth / img.naturalHeight
        entry.ready = true
        kick()
      }
      img.src = s.image
      return entry
    })

    // Stage size, measured on resize only; the frame loop reads these numbers.
    let W = 1,
      H = 1,
      cw = 1,
      ch = 1,
      gap = 1
    let pos = 0,
      vel = 0,
      target = 0
    let intro = 0
    let introStart = -1
    let dragging = false,
      dragX = 0,
      dragPos = 0,
      lastX = 0,
      lastT = 0,
      flick = 0
    let raf = 0,
      last = 0,
      visible = false,
      current = 0

    const resize = (w: number, h: number) => {
      W = Math.max(1, w)
      H = Math.max(1, h)
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ;[cw, ch] = cardSize(W, H)
      gap = cw * 0.14
      gl.viewport(0, 0, canvas.width, canvas.height)
      kick()
    }

    const draw = () => {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(u.uRes, W, H)
      gl.uniform2f(u.uSize, cw, ch)
      gl.uniform1f(u.uBend, bend)
      gl.uniform1f(u.uVel, Math.max(-1, Math.min(1, vel * 0.12)))
      const step = cw + gap
      for (let i = 0; i < n; i++) {
        const d = offsetOf(i, pos, n)
        const x = d * step
        if (Math.abs(x) > W * 0.5 + step * 1.5) continue
        const order = Math.abs(d)
        const t = Math.max(0, Math.min(1, (intro - order * 0.12) / 0.6))
        const e = 1 - Math.pow(1 - t, 3)
        gl.bindTexture(gl.TEXTURE_2D, tex[i].t)
        gl.uniform1f(u.uX, x)
        gl.uniform1f(u.uIntro, e)
        gl.uniform1f(u.uAspect, tex[i].aspect)
        gl.uniform1f(u.uReady, tex[i].ready ? 1 : 0)
        gl.uniform1f(u.uShift, Math.max(-0.05, Math.min(0.05, -d * 0.035)))
        gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 2)
      }
    }

    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      if (intro < 1) {
        if (introStart < 0) introStart = now
        intro = Math.min(1.5, (now - introStart) / 1100)
        if (intro >= 1.5) intro = 1
      }
      if (!dragging) [pos, vel] = springStep(pos, vel, target, dt)
      const idx = wrap(Math.round(pos), n)
      if (idx !== current) {
        current = idx
        setIndex(idx)
      }
      draw()
      const settled = !dragging && Math.abs(target - pos) < 0.0005 && Math.abs(vel) < 0.001 && intro >= 1
      if (settled) {
        pos = target
        draw()
        last = 0
      } else if (visible) raf = requestAnimationFrame(frame)
    }

    function kick() {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(frame)
    }
    const go = (dir: number) => {
      target = Math.round(target) + dir
      kick()
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      dragX = lastX = e.clientX
      lastT = e.timeStamp
      dragPos = pos
      flick = 0
      canvas.setPointerCapture(e.pointerId)
      kick()
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const step = cw + gap
      const dts = Math.max(1, e.timeStamp - lastT) / 1000
      flick = flick * 0.6 + (-(e.clientX - lastX) / step / dts) * 0.4
      vel = flick
      lastX = e.clientX
      lastT = e.timeStamp
      pos = dragPos - (e.clientX - dragX) / step
      kick()
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      target = restFor(pos, flick)
      vel = flick
      kick()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else return
      e.preventDefault()
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    root.addEventListener('keydown', onKey)

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      resize(r.width, r.height)
    })
    ro.observe(root)
    // Run only while on screen; the cards rise in the first time it is seen.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible) kick()
      },
      { threshold: 0.25 }
    )
    io.observe(root)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      root.removeEventListener('keydown', onKey)
      for (const t of tex) gl.deleteTexture(t.t)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [n, slides, bend])

  const slide = slides[index] ?? slides[0]
  if (!slide) return null

  return (
    <div
      ref={rootRef}
      className={'lens' + (className ? ' ' + className : '')}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <canvas ref={canvasRef} className="lens-canvas" aria-hidden="true" />
      {noGL ? <img className="lens-fallback" src={slide.image} alt={slide.alt} /> : null}
      <p className="sr-only" aria-live="polite">
        {slide.alt}. Picture {index + 1} of {n}. Use the left and right arrow keys to move.
      </p>
    </div>
  )
}
