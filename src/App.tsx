import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as RPE, ReactNode } from 'react'

/* ============ CẤU HÌNH: CHỈNH Ở ĐÂY ============ */
const NAME = 'Bùi Thanh Minh'
const SENDER = 'những người thương Minh'
const CANDLES = 5

// 👇 THÊM ĐƯỜNG DẪN ẢNH VÀO "src" CỦA 4 KHUNG
// '/anh1.jpg' (ảnh trong thư mục public/) | link online | hoặc import anh1 from './assets/anh1.jpg' rồi src: anh1
const PHOTOS: { src: string; caption: string }[] = [
  { src: '', caption: 'Nụ cười rạng rỡ' },
  { src: '', caption: 'Một ngày thật đẹp' },
  { src: '', caption: 'Cùng nhau mãi nhé' },
  { src: '', caption: 'Tuổi mới bắt đầu thôi' },
]

const MESSAGE =
  'Chúc Minh tuổi mới thật nhiều niềm vui, sức khỏe dồi dào và những bất ngờ dễ thương. Mong mỗi ngày của Minh đều nhẹ nhàng như một bữa sáng ngon, và những dự định đang ấp ủ sẽ lần lượt thành hiện thực. Cảm ơn Minh vì đã là một người đặc biệt. Sinh nhật vui nhé!'

const BALLOONS = [
  { c: '#FF5C9E', w: 'Mong bạn luôn được là chính mình và được yêu đúng như vậy.' },
  { c: '#FFC857', w: 'Năm nay có thật nhiều chuyến đi và những buổi chiều rảnh rỗi.' },
  { c: '#6EE7C8', w: 'Chúc mọi việc khó đều có người ở bên cùng gỡ.' },
  { c: '#B9A4FF', w: 'Ước gì bạn ngủ ngon, ăn ngon và cười thật nhiều.' },
  { c: '#7CC7FF', w: 'Mọi kế hoạch bạn đang giấu trong lòng sẽ thành thật.' },
  { c: '#FF8A5C', w: 'Chúc bạn một năm mới nhiều tin vui hơn tin nhắn công việc.' },
]
/* ================================================= */

const COLORS = ['#FF5C9E', '#FFC857', '#6EE7C8', '#B9A4FF', '#7CC7FF', '#FFFFFF']
type Particle = { x: number; y: number; vx: number; vy: number; g: number; drag: number; life: number; max: number; size: number; color: string; kind: 'conf' | 'fw' | 'spark'; rot: number; vr: number }

function useFx() {
  const bg = useRef<HTMLCanvasElement>(null)
  const fg = useRef<HTMLCanvasElement>(null)
  const parts = useRef<Particle[]>([])
  const fx = useMemo(() => {
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)]
    const add = (p: Partial<Particle> & Pick<Particle, 'x' | 'y' | 'kind'>) => {
      if (parts.current.length < 1600) parts.current.push({ vx: 0, vy: 0, g: 0.2, drag: 0.985, life: 0, max: 100, size: 3, color: pick(), rot: 0, vr: 0, ...p })
    }
    return {
      confetti(x: number, y: number, n = 90, rain = false) {
        for (let i = 0; i < n; i++) {
          const a = rain ? Math.PI / 2 + rnd(-0.5, 0.5) : rnd(0, Math.PI * 2)
          const sp = rain ? rnd(1, 4) : rnd(3, 13)
          add({ kind: 'conf', x: rain ? rnd(0, window.innerWidth) : x, y: rain ? -10 : y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (rain ? 0 : 5), max: rnd(150, 260), size: rnd(6, 11), rot: rnd(0, 6.28), vr: rnd(-0.3, 0.3) })
        }
      },
      firework(x: number, y: number) {
        const base = pick()
        for (let i = 0; i < 90; i++) {
          const a = (i / 90) * Math.PI * 2
          const sp = rnd(2, 7) * (i % 3 === 0 ? 0.55 : 1)
          add({ kind: 'fw', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.055, drag: 0.972, max: rnd(60, 100), size: rnd(1.4, 2.6), color: i % 5 === 0 ? '#fff' : base })
        }
      },
      sparkle(x: number, y: number, n = 1) {
        for (let i = 0; i < n; i++) {
          const sp = n > 1 ? rnd(1, 5) : rnd(0, 0.8), a = rnd(0, 6.28)
          add({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.03, drag: 0.96, max: rnd(25, 50), size: rnd(2, 5) })
        }
      },
    }
  }, [])

  useEffect(() => {
    const bgc = bg.current!, fgc = fg.current!
    const b = bgc.getContext('2d')!, f = fgc.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      for (const c of [bgc, fgc]) { c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px' }
      b.setTransform(dpr, 0, 0, dpr, 0, 0); f.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.3, sp: Math.random() * 2 + 0.6, ph: Math.random() * 6.28 }))
    let raf = 0
    const frame = (ms: number) => {
      b.clearRect(0, 0, w, h); b.fillStyle = '#fff'
      for (const s of stars) { b.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin((ms / 1000) * s.sp + s.ph)); b.beginPath(); b.arc(s.x * w, s.y * h, s.r, 0, 6.2832); b.fill() }
      f.clearRect(0, 0, w, h); f.globalCompositeOperation = 'lighter'
      const list = parts.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        if (++p.life > p.max || p.y > h + 30) { list.splice(i, 1); continue }
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr
        f.globalAlpha = Math.min(1, (1 - p.life / p.max) * 1.6)
        f.fillStyle = p.color; f.strokeStyle = p.color
        if (p.kind === 'conf') { f.save(); f.translate(p.x, p.y); f.rotate(p.rot); f.scale(1, Math.cos(p.life * 0.15)); f.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); f.restore() }
        else if (p.kind === 'fw') { f.lineWidth = p.size; f.lineCap = 'round'; f.beginPath(); f.moveTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2); f.lineTo(p.x, p.y); f.stroke() }
        else { f.beginPath(); f.arc(p.x, p.y, p.size * (1 - p.life / p.max), 0, 6.2832); f.fill() }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return { bg, fg, fx }
}

/* Nhạc Happy Birthday bằng WebAudio (không cần file mp3) */
function playBirthday(): () => void {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AC()
  const master = ctx.createGain(); master.gain.value = 0.16; master.connect(ctx.destination)
  const [G4, A4, B4, C5, D5, E5, F5, G5] = [392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99]
  const song: [number, number][] = [
    [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [C5, 1], [B4, 2],
    [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [D5, 1], [C5, 2],
    [G4, 0.75], [G4, 0.25], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 2],
    [F5, 0.75], [F5, 0.25], [E5, 1], [C5, 1], [D5, 1], [C5, 2],
  ]
  const beat = 0.46
  const schedule = (start: number) => {
    let t = start
    for (const [fr, d] of song) {
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.type = 'triangle'; o.frequency.value = fr
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + d * beat * 0.95)
      o.connect(g); g.connect(master); o.start(t); o.stop(t + d * beat); t += d * beat
    }
    return t
  }
  let end = schedule(ctx.currentTime + 0.05)
  const id = window.setInterval(() => { if (ctx.currentTime > end - 0.5) end = schedule(end + 1) }, 400)
  return () => { window.clearInterval(id); void ctx.close() }
}

function useTypewriter(text: string, active: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) { setN(0); return }
    const id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 1)), 28)
    return () => window.clearInterval(id)
  }, [active, text])
  return text.slice(0, n)
}

const SPRINKLES = Array.from({ length: 22 }, (_, i) => (i < 12
  ? { x: 92 + ((i * 53) % 216), y: 238 + ((i * 29) % 48), r: (i * 37) % 180, c: COLORS[i % 5] }
  : { x: 128 + ((i * 41) % 144), y: 172 + ((i * 13) % 24), r: (i * 53) % 180, c: COLORS[(i + 2) % 5] }))

function Cake({ lit, onBlow }: { lit: boolean[]; onBlow: (i: number) => void }) {
  const xs = lit.map((_, i) => 200 + (i - (lit.length - 1) / 2) * 30)
  return (
    <svg className="cake" viewBox="0 0 400 340" role="img" aria-label="Chiếc bánh sinh nhật">
      <defs>
        <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF7BB0" /><stop offset="1" stopColor="#E23F83" /></linearGradient>
        <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CDBDFF" /><stop offset="1" stopColor="#8E74F2" /></linearGradient>
        <radialGradient id="gF" cx=".5" cy=".7" r=".6"><stop offset="0" stopColor="#FFF6CC" /><stop offset=".5" stopColor="#FFC857" /><stop offset="1" stopColor="#FF7A3D" /></radialGradient>
        <radialGradient id="gG"><stop offset="0" stopColor="#FFC857" stopOpacity=".5" /><stop offset="1" stopColor="#FFC857" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="200" cy="304" rx="172" ry="22" fill="#2B2360" />
      <ellipse cx="200" cy="298" rx="172" ry="22" fill="#3A3080" />
      <rect x="70" y="200" width="260" height="96" rx="22" fill="url(#gP)" />
      <rect x="70" y="200" width="260" height="26" rx="14" fill="#FFF1F6" />
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={83 + i * 26} cy={226} r={i % 2 ? 11 : 13} fill="#FFF1F6" />)}
      <rect x="110" y="135" width="180" height="68" rx="18" fill="url(#gL)" />
      <rect x="110" y="135" width="180" height="20" rx="12" fill="#FFF1F6" />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={122 + i * 26} cy={155} r={i % 2 ? 10 : 12} fill="#FFF1F6" />)}
      {SPRINKLES.map((s, i) => <rect key={i} x={s.x} y={s.y} width="9" height="3" rx="1.5" fill={s.c} transform={`rotate(${s.r} ${s.x} ${s.y})`} />)}
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y={98} width="10" height="40" rx="3" fill="#FFF1F6" />
          <rect x={x - 5} y={108} width="10" height="5" fill="#FF7BB0" /><rect x={x - 5} y={122} width="10" height="5" fill="#FF7BB0" />
          <g transform={`translate(${x} 94)`} role="button" tabIndex={0} aria-label={`Thổi nến ${i + 1}`} className="wick"
            onClick={() => onBlow(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onBlow(i) }}>
            {lit[i] ? (
              <>
                <circle r="26" cy="-14" fill="url(#gG)" />
                <g className="flame"><path d="M0 -30 C9 -17 10 -4 0 5 C-10 -4 -9 -17 0 -30Z" fill="url(#gF)" /><path d="M0 -14 C4 -8 4 -2 0 1 C-4 -2 -4 -8 0 -14Z" fill="#FFF6CC" /></g>
              </>
            ) : (
              <path className="smoke" d="M0 0 C-8 -12 8 -20 0 -34 C-6 -44 4 -50 0 -60" fill="none" stroke="#cfc6ff" strokeWidth="2.5" strokeLinecap="round" />
            )}
            <circle r="22" cy="-14" fill="transparent" />
          </g>
        </g>
      ))}
    </svg>
  )
}

function Tilt({ rot, children, onActivate }: { rot: number; children: ReactNode; onActivate: (el: HTMLElement) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: RPE<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 20}deg`); el.style.setProperty('--rx', `${-(py - 0.5) * 20}deg`)
    el.style.setProperty('--gx', `${px * 100}%`); el.style.setProperty('--gy', `${py * 100}%`); el.style.setProperty('--glare', '1')
  }
  const leave = () => { const el = ref.current; if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--glare', '0') }
  const go = () => ref.current && onActivate(ref.current)
  return (
    <div ref={ref} className="tilt" style={{ '--rot': `${rot}deg` } as CSSProperties} role="button" tabIndex={0}
      onPointerMove={move} onPointerLeave={leave} onClick={go} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } }}>
      {children}
    </div>
  )
}

const VARIANTS = ['polaroid', 'gold', 'neon', 'arch']
const ROTS = [-3, 2.5, -2, 3]

export default function App() {
  const { bg, fg, fx } = useFx()
  const [lit, setLit] = useState<boolean[]>(() => Array(CANDLES).fill(true))
  const [celebrate, setCelebrate] = useState(false)
  const [mic, setMic] = useState<'idle' | 'on' | 'denied'>('idle')
  const [music, setMusic] = useState(false)
  const [popped, setPopped] = useState<boolean[]>(() => Array(BALLOONS.length).fill(false))
  const [wish, setWish] = useState<string | null>(null)
  const meter = useRef<HTMLSpanElement>(null)
  const micRef = useRef<{ stop: () => void } | null>(null)
  const stopMusic = useRef<(() => void) | null>(null)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const litCount = lit.filter(Boolean).length
  const typed = useTypewriter(MESSAGE, celebrate)

  const stopMic = useCallback(() => { micRef.current?.stop(); micRef.current = null; setMic((m) => (m === 'on' ? 'idle' : m)) }, [])
  const blow = useCallback((i?: number) => setLit((prev) => {
    const idx = i !== undefined ? (prev[i] ? i : -1) : prev.indexOf(true)
    if (idx < 0) return prev
    const n = [...prev]; n[idx] = false; return n
  }), [])

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext(), an = ctx.createAnalyser()
      an.fftSize = 1024; ctx.createMediaStreamSource(stream).connect(an)
      const buf = new Uint8Array(an.fftSize)
      let raf = 0, last = 0
      const loop = (t: number) => {
        an.getByteTimeDomainData(buf)
        let s = 0; for (const v of buf) { const d = (v - 128) / 128; s += d * d }
        const rms = Math.sqrt(s / buf.length)
        if (meter.current) meter.current.style.transform = `scaleX(${Math.min(1, rms * 3)})`
        if (rms > 0.16 && t - last > 220) { last = t; blow() }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      micRef.current = { stop: () => { cancelAnimationFrame(raf); stream.getTracks().forEach((tr) => tr.stop()); void ctx.close() } }
      setMic('on')
    } catch { setMic('denied') }
  }

  useEffect(() => {
    if (litCount !== 0) return
    setCelebrate(true); stopMic()
    const w = window.innerWidth, h = window.innerHeight
    fx.confetti(w / 2, h * 0.35, 160)
    const ts = [0, 350, 700, 1100, 1500].map((d) => window.setTimeout(() => fx.firework(w * (0.15 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.35)), d))
    const rain = window.setInterval(() => fx.confetti(0, 0, 5, true), 120)
    const end = window.setTimeout(() => window.clearInterval(rain), 4000)
    return () => { ts.forEach(clearTimeout); clearInterval(rain); clearTimeout(end) }
  }, [litCount, fx, stopMic])

  useEffect(() => () => { micRef.current?.stop(); stopMusic.current?.() }, [])

  const relight = () => { setLit(Array(CANDLES).fill(true)); setCelebrate(false); setWish(null) }
  const toggleMusic = () => {
    if (music) { stopMusic.current?.(); stopMusic.current = null; setMusic(false) }
    else { stopMusic.current = playBirthday(); setMusic(true) }
  }
  const pop = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    fx.confetti(r.left + r.width / 2, r.top + r.height / 3, 45)
    setPopped((p) => p.map((v, j) => (j === i ? true : v))); setWish(BALLOONS[i].w)
    window.setTimeout(() => setPopped((p) => p.map((v, j) => (j === i ? false : v))), 3800)
  }
  const onDown = (e: RPE<HTMLDivElement>) => { if (!(e.target as HTMLElement).closest('button,[role="button"]')) fx.sparkle(e.clientX, e.clientY, 16) }
  const onMove = (e: RPE<HTMLDivElement>) => { if (!reduced && e.pointerType === 'mouse' && Math.random() < 0.6) fx.sparkle(e.clientX, e.clientY) }

  const words = NAME.split(' ')
  const offs = words.reduce<number[]>((a, _, i) => (a.push(i === 0 ? 0 : a[i - 1] + [...words[i - 1]].length), a), [])
  const status = celebrate ? 'Điều ước đã bay lên rồi. Chúc Minh một tuổi mới thật rực rỡ!'
    : mic === 'on' ? 'Đang nghe… hãy thổi thật mạnh vào micro'
    : mic === 'denied' ? 'Không bật được micro. Chạm vào từng ngọn lửa để thổi tắt nhé'
    : 'Ước một điều ước, rồi thổi nến bằng micro hoặc chạm vào từng ngọn lửa'

  return (
    <div className="app" onPointerDown={onDown} onPointerMove={onMove}>
      <style>{CSS}</style>
      <canvas ref={bg} className="cv bgc" aria-hidden />
      <canvas ref={fg} className="cv fgc" aria-hidden />
      <button className="music" onClick={toggleMusic} aria-pressed={music}>
        <span className={`eq${music ? ' on' : ''}`}><i /><i /><i /></span>{music ? 'Tắt nhạc' : 'Bật nhạc'}
      </button>

      <header className="hero">
        <p className="greet">Chúc mừng sinh nhật</p>
        <h1 className="name" aria-label={NAME}>
          {words.map((w, wi) => (
            <span className="word" key={wi} aria-hidden>
              {[...w].map((ch, ci) => <span key={ci} className="ch" style={{ '--i': offs[wi] + ci, '--c': COLORS[(offs[wi] + ci) % 5] } as CSSProperties}>{ch}</span>)}
            </span>
          ))}
        </h1>
        <p className="sub">Một ngày để được vui, được yêu thương và được làm mọi điều mình thích.</p>
        <p className="cue">Kéo xuống để thắp sáng chiếc bánh<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></p>
      </header>

      <section className="sec">
        <h2>Thổi nến thôi nào</h2>
        <div className="cakeWrap" style={{ '--lit': litCount / CANDLES } as CSSProperties}><Cake lit={lit} onBlow={blow} /></div>
        <p className="status" aria-live="polite">{status}</p>
        {mic === 'on' && <span className="meter"><span ref={meter} /></span>}
        <div className="actions">
          {!celebrate && mic !== 'on' && <button className="btn" onClick={startMic}>Thổi bằng micro</button>}
          {mic === 'on' && <button className="btn ghost" onClick={stopMic}>Tắt micro</button>}
          {celebrate && <button className="btn ghost" onClick={relight}>Thắp lại nến</button>}
        </div>
      </section>

      <section className="sec">
        <h2>Lời chúc dành cho Minh</h2>
        {!celebrate ? <p className="locked">Thổi tắt hết nến để mở lời chúc và những quả bóng bay.</p> : (
          <div className="panel">
            <p className="typed"><span className="ghost">{MESSAGE}</span><span className="live">{typed}</span></p>
            <div className="balloons">
              {BALLOONS.map((b, i) => (
                <button key={i} className={`balloon${popped[i] ? ' popped' : ''}`} style={{ '--c': b.c, '--i': i } as CSSProperties}
                  onClick={(e) => pop(i, e.currentTarget)} aria-label={`Bóng bay ${i + 1}`}>
                  <span className="body" /><span className="string" />
                </button>
              ))}
            </div>
            <p className="wishbox" key={wish ?? 'none'}>{wish ?? 'Chạm vào một quả bóng bay để nhận lời chúc'}</p>
            <button className="btn" onClick={() => { for (let i = 0; i < 4; i++) window.setTimeout(() => fx.firework(window.innerWidth * (0.15 + Math.random() * 0.7), window.innerHeight * (0.15 + Math.random() * 0.4)), i * 300) }}>Bắn thêm pháo hoa</button>
          </div>
        )}
      </section>

      <section className="sec">
        <h2>Khung ảnh kỷ niệm</h2>
        <div className="gallery">
          {PHOTOS.slice(0, 4).map((p, i) => (
            <Tilt key={i} rot={ROTS[i]} onActivate={(el) => { const r = el.getBoundingClientRect(); fx.confetti(r.left + r.width / 2, r.top + r.height / 2, 36) }}>
              <figure className={`frame f-${VARIANTS[i]}`}>
                <div className="pic">
                  {p.src ? <img src={p.src} alt={p.caption} draggable={false} loading="lazy" /> : <div className="ph"><b>Ảnh {i + 1}</b><span>Thêm đường dẫn ảnh vào</span><code>PHOTOS[{i}].src</code></div>}
                </div>
                <figcaption className="cap">{p.caption}</figcaption>
                <span className="glare" />
              </figure>
            </Tilt>
          ))}
        </div>
      </section>

      <footer className="foot">Gửi Minh, từ {SENDER}.</footer>
    </div>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500..900;1,9..144,500..700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap');
html,body{margin:0;background:#120E2B}
body{display:block!important}
#root{max-width:none!important;width:100%;margin:0!important;padding:0!important;text-align:initial!important}
.app{--ink:#120E2B;--pink:#FF5C9E;--gold:#FFC857;--mint:#6EE7C8;--lav:#B9A4FF;position:relative;min-height:100vh;overflow-x:hidden;color:#F6F0FF;font-family:'Be Vietnam Pro',system-ui,sans-serif;line-height:1.6;
 background:radial-gradient(900px 600px at 15% 0%,#2A1B6B 0,transparent 70%),radial-gradient(800px 600px at 90% 40%,#4B1B5E 0,transparent 70%),var(--ink)}
.app *{box-sizing:border-box}
.app :focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.cv{position:fixed;inset:0;pointer-events:none}.bgc{z-index:0}.fgc{z-index:60}
.hero,.sec,.foot{position:relative;z-index:1}
.hero{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 20px 40px}
.greet{margin:0 0 .3em;font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:500;font-size:clamp(1.3rem,3.6vw,2.2rem);color:var(--lav)}
.name{margin:0;font-family:Fraunces,Georgia,serif;font-weight:800;font-size:clamp(3.2rem,13vw,10rem);line-height:.98;letter-spacing:-.02em;text-shadow:0 0 60px rgba(255,92,158,.4)}
.word{display:inline-block;margin:0 .12em}
.ch{display:inline-block;cursor:default;animation:rise .9s cubic-bezier(.2,.9,.25,1.2) backwards;animation-delay:calc(var(--i)*55ms + 150ms);transition:color .2s,transform .25s}
.ch:hover{color:var(--c);transform:translateY(-.14em) rotate(-6deg) scale(1.1)}
@keyframes rise{from{opacity:0;transform:translateY(.7em) rotate(8deg)}}
.sub{max-width:34ch;margin:1.4em 0 0;font-size:1.1rem;color:#d8cdf5}
.cue{margin:3.2em 0 0;display:flex;gap:6px;align-items:center;font-size:.9rem;color:var(--mint)}
.sec{max-width:1080px;margin:0 auto;padding:clamp(56px,10vw,110px) 20px;text-align:center}
.sec h2{margin:0 0 .5em;font-family:Fraunces,Georgia,serif;font-weight:700;font-size:clamp(1.8rem,4.5vw,3rem);line-height:1.15}
.cakeWrap{position:relative;width:min(420px,88vw);margin:20px auto 0}
.cakeWrap::before{content:'';position:absolute;inset:-30% -30% 0;background:radial-gradient(closest-side at 50% 38%,rgba(255,200,87,.38),transparent 70%);opacity:var(--lit);transition:opacity 1s;pointer-events:none}
.cake{position:relative;width:100%;height:auto;display:block;overflow:visible}
.wick{cursor:pointer}
.flame{transform-box:fill-box;transform-origin:50% 100%;animation:flick .9s ease-in-out infinite alternate}
@keyframes flick{from{transform:scale(1) rotate(-2deg)}to{transform:scale(.92,1.1) rotate(2deg)}}
.smoke{transform-box:fill-box;transform-origin:50% 100%;animation:smoke 2.2s ease-out forwards}
@keyframes smoke{from{opacity:.9;transform:translateY(0) scaleY(.6)}to{opacity:0;transform:translateY(-26px) scaleY(1.2)}}
.status{min-height:3.2em;max-width:44ch;margin:18px auto 0;color:#d8cdf5}
.meter{display:block;width:180px;height:6px;margin:10px auto 0;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden}
.meter span{display:block;height:100%;transform-origin:left;transform:scaleX(0);background:linear-gradient(90deg,var(--mint),var(--gold),var(--pink))}
.actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:16px}
.btn{font:600 1rem 'Be Vietnam Pro',sans-serif;cursor:pointer;padding:.75em 1.5em;border-radius:999px;border:2px solid var(--pink);background:var(--pink);color:#1a0f2e;transition:transform .15s,box-shadow .2s}
.btn:hover{transform:translateY(-2px);border-color:var(--pink);box-shadow:0 10px 26px -8px var(--pink)}
.btn.ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.35)}
.btn.ghost:hover{border-color:#fff;box-shadow:none}
.music{position:fixed;top:14px;right:14px;z-index:70;display:flex;align-items:center;gap:8px;cursor:pointer;font:500 .85rem 'Be Vietnam Pro',sans-serif;padding:.5em 1em;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(18,14,43,.7);color:#fff;backdrop-filter:blur(8px)}
.music:hover{border-color:var(--gold)}
.eq{display:flex;align-items:flex-end;gap:2px;height:12px}
.eq i{width:3px;height:4px;background:var(--gold);border-radius:2px}
.eq.on i{animation:eq .7s ease-in-out infinite alternate}.eq.on i:nth-child(2){animation-delay:.2s}.eq.on i:nth-child(3){animation-delay:.4s}
@keyframes eq{to{height:12px}}
.locked{color:#b9aedb;margin:0}
.panel{max-width:760px;margin:0 auto;padding:clamp(22px,4vw,44px);border-radius:28px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);backdrop-filter:blur(10px)}
.typed{display:grid;margin:0;font-family:Fraunces,Georgia,serif;font-size:clamp(1.1rem,2.4vw,1.4rem);line-height:1.7;text-align:left}
.typed>span{grid-area:1/1}.ghost{visibility:hidden}
.balloons{display:flex;justify-content:center;flex-wrap:wrap;gap:clamp(10px,3vw,34px);margin:34px 0 8px;min-height:150px}
.balloon{position:relative;width:64px;height:84px;padding:0;border:0;background:none;cursor:pointer;animation:bob 3.4s ease-in-out infinite;animation-delay:calc(var(--i)*-.55s);transition:transform .25s,opacity .2s}
.balloon:hover{border-color:transparent}
.balloon .body{position:absolute;inset:0 0 12px;border-radius:50% 50% 48% 48%/58% 58% 42% 42%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.75) 0 6%,transparent 22%),var(--c);box-shadow:inset -8px -10px 18px rgba(0,0,0,.18),0 10px 24px -8px var(--c)}
.balloon .body::after{content:'';position:absolute;left:50%;bottom:-5px;width:9px;height:9px;background:var(--c);border-radius:2px;transform:translateX(-50%) rotate(45deg)}
.balloon .string{position:absolute;left:50%;top:78px;width:1.5px;height:50px;background:linear-gradient(rgba(255,255,255,.6),transparent)}
.balloon.popped{animation:none;transform:scale(0);opacity:0;pointer-events:none}
@keyframes bob{50%{transform:translateY(-10px) rotate(2deg)}}
.wishbox{min-height:3.4em;margin:6px 0 18px;color:var(--gold);font-weight:500;animation:fade .5s}
@keyframes fade{from{opacity:0;transform:translateY(6px)}}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:clamp(34px,4vw,56px) clamp(20px,3vw,40px);justify-items:center;align-items:center;margin-top:36px}
.tilt{--rx:0deg;--ry:0deg;--glare:0;width:100%;max-width:280px;cursor:pointer;transform:rotate(var(--rot)) perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.tilt:hover{transition:transform .08s linear}
.frame{position:relative;margin:0}
.pic{position:relative;overflow:hidden;background:#241c52}
.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.ph{position:absolute;inset:0;display:grid;place-content:center;gap:4px;padding:12px;font-size:.82rem;color:rgba(255,255,255,.7);background:repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 12px,transparent 12px 24px)}
.ph b{font-family:Fraunces,serif;font-size:1.5rem;color:#fff}.ph code{color:var(--gold);font-size:.74rem}
.glare{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:var(--glare);transition:opacity .3s;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.4),transparent 55%)}
.cap{position:absolute;left:var(--in);right:var(--in);bottom:var(--in);padding:26px 10px 10px;font-family:Fraunces,serif;font-style:italic;font-weight:600;font-size:1.02rem;text-shadow:0 1px 6px rgba(0,0,0,.6);background:linear-gradient(transparent,rgba(10,6,30,.75))}
.f-polaroid{padding:14px 14px 58px;background:#FFF8EE;border-radius:4px;box-shadow:0 24px 50px -18px rgba(0,0,0,.7)}
.f-polaroid .pic{aspect-ratio:1}
.f-polaroid .cap{left:0;right:0;bottom:16px;padding:0;color:#4a3b5c;text-shadow:none;background:none}
.f-polaroid::before{content:'';position:absolute;top:-12px;left:50%;width:92px;height:26px;background:rgba(110,231,200,.8);transform:translateX(-50%) rotate(-4deg);box-shadow:0 2px 6px rgba(0,0,0,.2)}
.f-gold{--in:24px;padding:16px;border-radius:6px;background:linear-gradient(135deg,#FFF0B5,#C99524 28%,#FFE9A0 52%,#9A6A10 78%,#FFD966);box-shadow:0 24px 50px -18px rgba(0,0,0,.75)}
.f-gold .pic{aspect-ratio:3/4;box-shadow:0 0 0 7px #17112f,0 0 0 8px rgba(255,225,140,.9)}
.f-neon{--in:12px;padding:10px;border-radius:30px;background:#150f33;border:2px solid var(--pink);animation:neon 2.6s ease-in-out infinite alternate}
.f-neon .pic{aspect-ratio:1;border-radius:22px}
.f-neon .cap{border-radius:0 0 22px 22px}
@keyframes neon{from{box-shadow:0 0 0 4px rgba(255,92,158,.12),0 0 18px rgba(255,92,158,.55),inset 0 0 14px rgba(255,92,158,.35)}to{box-shadow:0 0 0 6px rgba(255,92,158,.2),0 0 38px rgba(255,92,158,.85),inset 0 0 22px rgba(255,92,158,.5)}}
.f-arch{--in:12px;padding:12px;border-radius:50% 50% 18px 18px/34% 34% 18px 18px;background:linear-gradient(160deg,var(--lav),#7A5CF0 50%,var(--mint));box-shadow:0 24px 50px -18px rgba(0,0,0,.75)}
.f-arch .pic{aspect-ratio:3/4;border-radius:50% 50% 8px 8px/34% 34% 8px 8px}
.f-arch .cap{border-radius:0 0 8px 8px}
.foot{padding:30px 20px 60px;text-align:center;color:#b9aedb;font-family:Fraunces,serif;font-style:italic}
@media (prefers-reduced-motion:reduce){.app *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`
