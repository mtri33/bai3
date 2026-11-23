import React, { useState, useEffect, useRef } from 'react';

interface PhotoItem {
  id: number;
  url: string;
  caption: string;
  rotation: string;
}

interface WishCard {
  id: number;
  title: string;
  icon: string;
  message: string;
  gradient: string;
}

interface BalloonItem {
  id: number;
  color: string;
  glow: string;
  wish: string;
  popped: boolean;
}

// =========================================================================
// 🖼️ DÁN 4 ĐƯỜNG DẪN ẢNH CỦA BẠN VÀO THUỘC TÍNH "url" BÊN DƯỚI:
// =========================================================================
const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 1,
    url: '', // <-- DÁN LINK ẢNH 1 VÀO ĐÂY (VD: 'https://i.imgur.com/abc.jpg' hoặc '/anh1.jpg')
    caption: 'Khoảnh khắc rạng rỡ nhất ✨',
    rotation: '-3deg',
  },
  {
    id: 2,
    url: '', // <-- DÁN LINK ẢNH 2 VÀO ĐÂY
    caption: 'Kỷ niệm khó quên cùng nhau 🌟',
    rotation: '2.5deg',
  },
  {
    id: 3,
    url: '', // <-- DÁN LINK ẢNH 3 VÀO ĐÂY
    caption: 'Luôn vui vẻ và tỏa sáng nhé 🎂',
    rotation: '-2deg',
  },
  {
    id: 4,
    url: '', // <-- DÁN LINK ẢNH 4 VÀO ĐÂY
    caption: 'Tuổi mới thật nhiều thành công 🚀',
    rotation: '3.5deg',
  },
];

const WISH_CARDS: WishCard[] = [
  {
    id: 1,
    title: 'Sức Khỏe & Bình An',
    icon: '💎',
    message:
      'Chúc Bùi Thanh Minh bước sang tuổi mới luôn tràn đầy năng lượng, tinh thần lạc quan, mọi điều bình an và may mắn luôn mỉm cười mỗi ngày!',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  },
  {
    id: 2,
    title: 'Sự Nghiệp & Đam Mê',
    icon: '🚀',
    message:
      'Chúc Minh chinh phục được mọi mục tiêu lớn trong năm nay, bứt phá giới hạn bản thân và gặt hái thật nhiều thành tựu rực rỡ!',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  },
  {
    id: 3,
    title: 'Niềm Vui & Hạnh Phúc',
    icon: '💖',
    message:
      'Mong rằng mọi khoảnh khắc của tuổi mới đều ngập tràn tiếng cười, những chuyến đi đáng nhớ và luôn có những người thương yêu bên cạnh!',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
  },
];

const INITIAL_BALLOONS: BalloonItem[] = [
  {
    id: 1,
    color: '#ff4d94',
    glow: 'rgba(255, 77, 148, 0.6)',
    wish: '🎈 Bùm! Chúc Minh luôn đẹp trai & tỏa sáng!',
    popped: false,
  },
  {
    id: 2,
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.6)',
    wish: '✨ Bùm! Tiền vào như nước, công việc hanh thông!',
    popped: false,
  },
  {
    id: 3,
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.6)',
    wish: '🎉 Bùm! Vạn sự như ý, triệu điều bất ngờ!',
    popped: false,
  },
  {
    id: 4,
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.6)',
    wish: '💫 Bùm! Hạnh phúc đong đầy suốt 365 ngày!',
    popped: false,
  },
];

export function App() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [openingAnim, setOpeningAnim] = useState(false);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);
  const [wishUnlocked, setWishUnlocked] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [balloons, setBalloons] = useState<BalloonItem[]>(INITIAL_BALLOONS);
  const [popMessage, setPopMessage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicTimerRef = useRef<number | null>(null);

  // Hiệu ứng pháo hoa & kim tuyến Canvas
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      vRot: number;
      shape: 'circle' | 'rect';
    }>
  >([]);

  const spawnConfetti = (originX?: number, originY?: number, amount = 90) => {
    const colors = ['#fbbf24', '#ec4899', '#a855f7', '#38bdf8', '#34d399', '#ffffff'];
    const cx = originX ?? window.innerWidth / 2;
    const cy = originY ?? window.innerHeight / 2;

    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // trọng lực
        p.vx *= 0.99;
        p.alpha -= 0.011;
        p.rotation += p.vRot;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Giai điệu Happy Birthday bằng Web Audio API
  const toggleBirthdayMusic = () => {
    if (isPlayingMusic) {
      if (musicTimerRef.current) window.clearTimeout(musicTimerRef.current);
      setIsPlayingMusic(false);
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    setIsPlayingMusic(true);

    // Nốt nhạc Happy Birthday (tần số Hz, độ dài giây)
    const melody: [number, number][] = [
      [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [349.23, 0.6], [329.63, 1.0],
      [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [392.00, 0.6], [349.23, 1.0],
      [261.63, 0.3], [261.63, 0.3], [523.25, 0.6], [440.00, 0.6], [349.23, 0.6], [329.63, 0.6], [293.66, 1.0],
      [466.16, 0.3], [466.16, 0.3], [440.00, 0.6], [349.23, 0.6], [392.00, 0.6], [349.23, 1.2],
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!audioCtxRef.current) return;
      const [freq, dur] = melody[noteIdx];
      const now = audioCtxRef.current.currentTime;

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.95);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(now);
      osc.stop(now + dur);

      noteIdx = (noteIdx + 1) % melody.length;
      musicTimerRef.current = window.setTimeout(playNext, dur * 1000 + 40);
    };

    playNext();
  };

  useEffect(() => {
    return () => {
      if (musicTimerRef.current) window.clearTimeout(musicTimerRef.current);
    };
  }, []);

  // Mở hộp quà
  const handleOpenGift = () => {
    if (openingAnim) return;
    setOpeningAnim(true);
    spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 140);
    if (!isPlayingMusic) {
      toggleBirthdayMusic();
    }
    setTimeout(() => {
      setGiftOpened(true);
      setTimeout(() => {
        spawnConfetti(window.innerWidth * 0.25, window.innerHeight * 0.35, 70);
        spawnConfetti(window.innerWidth * 0.75, window.innerHeight * 0.35, 70);
      }, 300);
    }, 650);
  };

  // Thổi 1 cây nến hoặc thổi tất cả
  const toggleSingleCandle = (index: number) => {
    setCandlesLit((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      if (updated.every((lit) => !lit)) {
        setWishUnlocked(true);
        spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 130);
      }
      return updated;
    });
  };

  const blowAllCandles = () => {
    setCandlesLit([false, false, false, false, false]);
    setWishUnlocked(true);
    spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 150);
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
    setWishUnlocked(false);
  };

  // Nổ bóng bay
  const handlePopBalloon = (id: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    setBalloons((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          setPopMessage(b.wish);
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  // Lưu URL ảnh nhanh
  const handleSavePhotoUrl = (id: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, url: tempUrl.trim() } : p))
    );
    setEditingPhotoId(null);
    setTempUrl('');
    spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
  };

  return (
    <div className="bday-root">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .bday-root {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at 20% 20%, #2e1065 0%, #1e1b4b 45%, #090d16 100%);
          color: #f8fafc;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          position: relative;
          padding-bottom: 80px;
        }

        /* Đốm sáng nền lấp lánh */
        .ambient-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.45;
          animation: floatOrb 10s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 380px;
          height: 380px;
          background: #db2777;
          top: -80px;
          left: -80px;
        }
        .orb-2 {
          width: 420px;
          height: 420px;
          background: #7c3aed;
          bottom: 5%;
          right: -100px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 300px;
          height: 300px;
          background: #f59e0b;
          top: 45%;
          left: 35%;
          opacity: 0.22;
          animation-delay: -7s;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(35px, -30px) scale(1.12); }
        }

        .confetti-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999;
        }

        /* Màn mở hộp quà đầu tiên */
        .gift-intro {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          padding: 24px;
          text-align: center;
        }

        .intro-badge {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.45);
          color: #fde68a;
          padding: 8px 20px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .intro-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.4rem);
          background: linear-gradient(to right, #fff, #fde68a, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }

        .intro-sub {
          color: #cbd5e1;
          font-size: 1.05rem;
          margin-bottom: 44px;
        }

        .gift-box-wrapper {
          cursor: pointer;
          position: relative;
          width: 170px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: giftBounce 2s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .gift-box-wrapper:hover {
          transform: scale(1.08);
        }
        .gift-box-wrapper.opening {
          animation: giftShake 0.6s ease-in-out forwards;
        }

        .gift-glow {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,114,182,0.55) 0%, rgba(251,191,36,0) 70%);
          animation: pulseGlow 2s infinite;
        }

        .gift-base {
          width: 130px;
          height: 105px;
          background: linear-gradient(135deg, #ec4899, #be185d);
          border-radius: 12px;
          position: relative;
          box-shadow: 0 20px 45px rgba(236, 72, 153, 0.45);
          display: flex;
          justify-content: center;
        }
        .gift-base::before {
          content: '';
          width: 26px;
          height: 100%;
          background: linear-gradient(to bottom, #fde047, #f59e0b);
        }

        .gift-lid {
          position: absolute;
          top: 12px;
          width: 146px;
          height: 32px;
          background: linear-gradient(135deg, #f472b6, #db2777);
          border-radius: 8px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .gift-lid::before {
          content: '';
          width: 26px;
          height: 100%;
          background: #fde047;
        }
        .gift-bow {
          position: absolute;
          top: -16px;
          font-size: 32px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }

        .gift-box-wrapper.opening .gift-lid {
          transform: translateY(-65px) rotate(-18deg);
        }

        @keyframes giftBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes giftShake {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-8deg); }
          50% { transform: scale(1.15) rotate(8deg); }
          75% { transform: scale(1.2) rotate(-5deg); }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        /* Nội dung chính */
        .main-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 36px 20px;
          position: relative;
          z-index: 5;
          animation: fadeInUp 0.9s ease forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Bóng bay tương tác */
        .balloons-row {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .balloon-item {
          width: 56px;
          height: 68px;
          border-radius: 50% 50% 50% 50% / 45% 45% 55% 55%;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: transform 0.25s ease;
          animation: floatBalloon 3.2s ease-in-out infinite alternate;
        }
        .balloon-item:nth-child(2) { animation-delay: -0.8s; }
        .balloon-item:nth-child(3) { animation-delay: -1.6s; }
        .balloon-item:nth-child(4) { animation-delay: -2.4s; }

        .balloon-item:hover {
          transform: scale(1.15) translateY(-6px);
        }
        .balloon-item::after {
          content: '';
          position: absolute;
          bottom: -22px;
          width: 1.5px;
          height: 22px;
          background: rgba(255, 255, 255, 0.45);
        }
        .balloon-popped {
          width: 56px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          opacity: 0.7;
        }

        @keyframes floatBalloon {
          0% { transform: translateY(0) rotate(-3deg); }
          100% { transform: translateY(-12px) rotate(3deg); }
        }

        .pop-banner {
          text-align: center;
          margin: 0 auto 24px;
          padding: 10px 22px;
          max-width: 520px;
          border-radius: 999px;
          background: rgba(251, 191, 36, 0.16);
          border: 1px solid rgba(251, 191, 36, 0.45);
          color: #fde68a;
          font-weight: 600;
          font-size: 0.95rem;
          animation: fadeInUp 0.35s ease;
        }

        /* Hero Banner */
        .hero-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-subtitle {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          color: #f472b6;
          margin-bottom: 8px;
        }

        .hero-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 6.5vw, 4.6rem);
          font-weight: 700;
          line-height: 1.15;
          background: linear-gradient(120deg, #ffffff 10%, #fde68a 45%, #f472b6 75%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 6px 24px rgba(236, 72, 153, 0.3));
          margin-bottom: 16px;
        }

        .hero-desc {
          max-width: 640px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 1.08rem;
          line-height: 1.7;
        }

        /* Khu vực Bánh Sinh Nhật & Thổi Nến */
        .cake-section {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          padding: 36px 24px;
          margin-bottom: 56px;
          text-align: center;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
        }

        .section-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          color: #fde68a;
          margin-bottom: 8px;
        }

        .section-hint {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 32px;
        }

        .cake-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 12px auto 28px;
        }

        .candles-row {
          display: flex;
          gap: 22px;
          margin-bottom: -4px;
          z-index: 3;
        }

        .candle-unit {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s ease;
        }
        .candle-unit:hover {
          transform: scale(1.12);
        }

        .flame {
          width: 14px;
          height: 22px;
          background: radial-gradient(ellipse at bottom, #ffffff 10%, #fde047 50%, #f97316 90%);
          border-radius: 50% 50% 35% 35%;
          box-shadow: 0 0 14px #fbbf24, 0 0 28px #f97316;
          margin-bottom: 4px;
          animation: flicker 0.65s infinite alternate;
        }

        .smoke {
          width: 10px;
          height: 22px;
          margin-bottom: 4px;
          position: relative;
        }
        .smoke::after {
          content: '☁';
          font-size: 14px;
          color: rgba(203, 213, 225, 0.6);
          position: absolute;
          left: -2px;
          animation: smokeRise 1.6s ease-out forwards;
        }

        @keyframes flicker {
          0% { transform: scale(1) rotate(-3deg); }
          100% { transform: scale(1.08, 0.94) rotate(3deg); }
        }
        @keyframes smokeRise {
          0% { opacity: 0.8; transform: translateY(0) scale(0.7); }
          100% { opacity: 0; transform: translateY(-24px) scale(1.4); }
        }

        .candle-stick {
          width: 10px;
          height: 42px;
          border-radius: 4px 4px 0 0;
          background: repeating-linear-gradient(
            45deg,
            #f472b6,
            #f472b6 5px,
            #ffffff 5px,
            #ffffff 10px
          );
        }

        .cake-top-tier {
          width: 190px;
          height: 54px;
          background: linear-gradient(180deg, #fbcfe8 0%, #f472b6 100%);
          border-radius: 16px 16px 6px 6px;
          position: relative;
          box-shadow: inset 0 -6px 0 rgba(190, 24, 93, 0.25);
        }

        .cake-bottom-tier {
          width: 260px;
          height: 68px;
          background: linear-gradient(180deg, #c084fc 0%, #7e22ce 100%);
          border-radius: 14px 14px 18px 18px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Dancing Script', cursive;
          font-size: 1.45rem;
          color: #fef08a;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
        }

        .cake-plate {
          width: 300px;
          height: 12px;
          background: linear-gradient(90deg, #94a3b8, #f8fafc, #94a3b8);
          border-radius: 999px;
          margin-top: 2px;
        }

        .btn-action {
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
          color: #fff;
          border: none;
          padding: 13px 28px;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-action:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 14px 30px rgba(236, 72, 153, 0.55);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 11px 24px;
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .secret-wish-box {
          margin: 24px auto 0;
          max-width: 580px;
          padding: 22px 26px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(236, 72, 153, 0.18));
          border: 1px solid rgba(253, 224, 71, 0.5);
          animation: fadeInUp 0.5s ease;
        }

        /* 4 Khung Ảnh Kỷ Niệm (Polaroid Gallery) */
        .gallery-section {
          margin-bottom: 60px;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(235px, 1fr));
          gap: 28px;
          padding: 8px;
        }

        .polaroid-card {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          padding: 14px 14px 20px;
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(253, 224, 71, 0.45);
          color: #1e293b;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
          position: relative;
        }

        .polaroid-card:hover {
          transform: rotate(0deg) scale(1.05) translateY(-8px) !important;
          box-shadow: 0 26px 55px rgba(236, 72, 153, 0.35), 0 0 0 2px #fbbf24;
          z-index: 10;
        }

        .polaroid-pin {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #fde047, #d97706);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35);
          z-index: 2;
        }

        .photo-frame {
          width: 100%;
          aspect-ratio: 4 / 4.3;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .photo-placeholder {
          text-align: center;
          padding: 20px;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .photo-caption {
          font-family: 'Dancing Script', cursive;
          font-size: 1.4rem;
          font-weight: 700;
          color: #334155;
          text-align: center;
          margin-top: 14px;
        }

        .photo-edit-btn {
          margin-top: 10px;
          width: 100%;
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px dashed #94a3b8;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .photo-edit-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .url-input-box {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .url-input-box input {
          width: 100%;
          padding: 7px 10px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 0.85rem;
          outline: none;
        }
        .url-input-actions {
          display: flex;
          gap: 6px;
        }
        .url-input-actions button {
          flex: 1;
          padding: 6px;
          border-radius: 6px;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* 3 Thiệp Lật 3D */
        .wishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .flip-card {
          height: 230px;
          perspective: 1000px;
          cursor: pointer;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }

        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-front,
        .flip-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 22px;
          padding: 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
        }

        .flip-front {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(12px);
        }

        .flip-back {
          transform: rotateY(180deg);
          color: #ffffff;
          line-height: 1.65;
          font-size: 0.98rem;
          font-weight: 500;
        }

        /* Thanh công cụ nổi góc dưới */
        .floating-controls {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 100;
        }

        .float-btn {
          background: rgba(15, 23, 42, 0.82);
          color: #fde68a;
          border: 1px solid rgba(251, 191, 36, 0.45);
          backdrop-filter: blur(12px);
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease;
        }
        .float-btn:hover {
          transform: scale(1.06);
        }
      `}</style>

      {/* Hiệu ứng đốm sáng nền & Canvas pháo giấy */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
      <canvas ref={canvasRef} className="confetti-canvas" />

      {!giftOpened ? (
        /* MÀN 1: HỘP QUÀ BẤT NGỜ */
        <div className="gift-intro">
          <div className="intro-badge">✨ Special Birthday Edition ✨</div>
          <h1 className="intro-title">Có Một Món Quà Đặc Biệt Dành Cho</h1>
          <h2
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
              color: '#f472b6',
              marginBottom: '12px',
            }}
          >
            Bùi Thanh Minh
          </h2>
          <p className="intro-sub">Chạm vào hộp quà bên dưới để mở điều bất ngờ nhé!</p>

          <div
            className={`gift-box-wrapper ${openingAnim ? 'opening' : ''}`}
            onClick={handleOpenGift}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenGift()}
          >
            <div className="gift-glow" />
            <div className="gift-lid">
              <span className="gift-bow">🎀</span>
            </div>
            <div className="gift-base" />
          </div>
        </div>
      ) : (
        /* MÀN 2: KHÔNG GIAN TIỆC SINH NHẬT */
        <div className="main-container">
          {/* 4 Quả bóng bay tương tác */}
          <div className="balloons-row">
            {balloons.map((b) =>
              b.popped ? (
                <div key={b.id} className="balloon-popped" title="Đã nổ!">
                  ✨
                </div>
              ) : (
                <div
                  key={b.id}
                  className="balloon-item"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #ffffff, ${b.color})`,
                    boxShadow: `0 10px 25px ${b.glow}`,
                  }}
                  onClick={(e) => handlePopBalloon(b.id, e)}
                  title="Chạm để làm nổ bóng bay!"
                >
                  🎈
                </div>
              )
            )}
          </div>

          {popMessage && <div className="pop-banner">{popMessage}</div>}

          {/* Tiêu đề chính */}
          <header className="hero-header">
            <div className="hero-subtitle">Happy Birthday To You</div>
            <h1 className="hero-name">Bùi Thanh Minh</h1>
            <p className="hero-desc">
              Chúc mừng sinh nhật! Chúc Minh một tuổi mới thật rực rỡ, luôn giữ vững ngọn lửa đam mê,
              gặt hái thật nhiều thành công và tận hưởng trọn vẹn từng khoảnh khắc tuyệt vời nhất!
            </p>
          </header>

          {/* Bánh kem & Thổi nến tương tác */}
          <section className="cake-section">
            <h2 className="section-heading">🎂 Nghi Thức Thổi Nến Ước Nguyện</h2>
            <p className="section-hint">
              Nhắm mắt lại, ước một điều thật đẹp rồi chạm vào từng ngọn nến (hoặc bấm nút bên dưới) để thổi nến!
            </p>

            <div className="cake-stage">
              <div className="candles-row">
                {candlesLit.map((isLit, idx) => (
                  <div
                    key={idx}
                    className="candle-unit"
                    onClick={() => toggleSingleCandle(idx)}
                    title={isLit ? 'Chạm để thổi tắt nến' : 'Chạm để thắp lại'}
                  >
                    {isLit ? <div className="flame" /> : <div className="smoke" />}
                    <div className="candle-stick" />
                  </div>
                ))}
              </div>
              <div className="cake-top-tier" />
              <div className="cake-bottom-tier">Thanh Minh</div>
              <div className="cake-plate" />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {candlesLit.some((lit) => lit) ? (
                <button className="btn-action" onClick={blowAllCandles}>
                  🌬️ Thổi Tất Cả Nến
                </button>
              ) : (
                <button className="btn-secondary" onClick={relightCandles}>
                  🔥 Thắp Lại Nến
                </button>
              )}
            </div>

            {wishUnlocked && (
              <div className="secret-wish-box">
                <h3 style={{ color: '#fde047', marginBottom: '8px', fontSize: '1.2rem' }}>
                  🌟 Điều Ước Đã Được Gửi Lên Vũ Trụ!
                </h3>
                <p style={{ color: '#f1f5f9', lineHeight: 1.65 }}>
                  Chúc mọi dự định trong tuổi mới của <strong>Bùi Thanh Minh</strong> đều trở thành hiện thực.
                  Cứ tự tin tiến về phía trước nhé, những điều tốt đẹp nhất đang chờ đón bạn!
                </p>
              </div>
            )}
          </section>

          {/* 4 Khung Ảnh Kỷ Niệm */}
          <section className="gallery-section">
            <div className="gallery-header">
              <h2 className="section-heading">📸 Góc Lưu Giữ Kỷ Niệm</h2>
              <p className="section-hint">
                4 khung ảnh dành riêng cho Minh — Bạn có thể gắn link trực tiếp trong code <code>App.tsx</code> hoặc bấm nút bên dưới từng khung để dán thử ngay!
              </p>
            </div>

            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="polaroid-card"
                  style={{ transform: `rotate(${photo.rotation})` }}
                >
                  <div className="polaroid-pin" />
                  <div className="photo-frame">
                    {photo.url ? (
                      <img src={photo.url} alt={`Kỷ niệm ${index + 1}`} />
                    ) : (
                      <div className="photo-placeholder">
                        <span style={{ fontSize: '2.2rem' }}>🖼️</span>
                        <strong style={{ color: '#fde68a', fontSize: '0.95rem' }}>
                          Khung Ảnh Số {index + 1}
                        </strong>
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          Thêm link ảnh vào <code>INITIAL_PHOTOS[{index}]</code>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="photo-caption">{photo.caption}</div>

                  {editingPhotoId === photo.id ? (
                    <div className="url-input-box">
                      <input
                        type="text"
                        placeholder="Dán đường dẫn ảnh (https://...)"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                      />
                      <div className="url-input-actions">
                        <button
                          style={{ background: '#ec4899', color: '#fff' }}
                          onClick={() => handleSavePhotoUrl(photo.id)}
                        >
                          Lưu ảnh
                        </button>
                        <button
                          style={{ background: '#cbd5e1', color: '#1e293b' }}
                          onClick={() => setEditingPhotoId(null)}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="photo-edit-btn"
                      onClick={() => {
                        setEditingPhotoId(photo.id);
                        setTempUrl(photo.url);
                      }}
                    >
                      🔗 Gắn / Đổi link ảnh #{index + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3 Phong thư lời chúc lật 3D */}
          <section>
            <div className="gallery-header">
              <h2 className="section-heading">💌 Lời Chúc Bí Mật</h2>
              <p className="section-hint">Chạm vào từng tấm thiệp bên dưới để lật mở lời chúc!</p>
            </div>

            <div className="wishes-grid">
              {WISH_CARDS.map((card) => {
                const isFlipped = !!flippedCards[card.id];
                return (
                  <div
                    key={card.id}
                    className={`flip-card ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => {
                      setFlippedCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
                      if (!isFlipped) spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.75, 40);
                    }}
                  >
                    <div className="flip-card-inner">
                      <div className="flip-front">
                        <span style={{ fontSize: '2.6rem', marginBottom: '12px' }}>{card.icon}</span>
                        <h3 style={{ fontSize: '1.25rem', color: '#fde68a', marginBottom: '6px' }}>
                          {card.title}
                        </h3>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                          (Chạm để mở thiệp ✨)
                        </span>
                      </div>
                      <div className="flip-back" style={{ background: card.gradient }}>
                        <p>{card.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Nút điều khiển nổi góc phải dưới */}
      <div className="floating-controls">
        <button
          className="float-btn"
          onClick={() => spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 110)}
        >
          🎉 Bắn Pháo Hoa
        </button>
        <button className="float-btn" onClick={toggleBirthdayMusic}>
          {isPlayingMusic ? '🔊 Tắt Nhạc' : '🎵 Bật Nhạc HPBD'}
        </button>
      </div>
    </div>
  );
}

export default App;