/* eslint-disable react-hooks/purity */

import { useEffect, useRef, useState } from "react";

const REMIX_AUDIO_SRC = "/audio/bui-thanh-minh-remix.mp3";

const photos = [
  {
    src: "/images/2aOboREbp2lpwfQurdP4Pbz4aKVKX2wcONapB9No.jpg",
    caption: "Beautiful Moments",
    sub: "Những khoảnh khắc đáng nhớ",
  },
  {
    src: "/images/2aOboREbp2ykGzDdSwxv8VJRT3bKGANz4fYmUdUG.jpg",
    caption: "Little Memories",
    sub: "Những kỷ niệm tuyệt vời",
  },
  {
    src: "/images/2aOboREbp2ZdP8b1K3Zesme3PAIeI7U3KY2f0JzU.jpg",
    caption: "Happy Together",
    sub: "Những ngày thật vui",
  },
  {
    src: "/images/1260f49b-719d-430d-9fbb-bf48f3a48dbe.jpg",
    caption: "Forever Young",
    sub: "Tuổi trẻ và những ước mơ",
  },
];

const wishes = [
  "Chúc Minh luôn giữ được nụ cười rạng rỡ và nguồn năng lượng tích cực của mình.",
  "Mong rằng mọi điều tốt đẹp nhất sẽ đến, những ước mơ đều dần trở thành hiện thực.",
  "Một tuổi mới thật nhiều niềm vui, trải nghiệm mới và những kỷ niệm không thể nào quên!",
];

export default function App() {
  const [opened, setOpened] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const [candles, setCandles] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [wishIndex, setWishIndex] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [age, setAge] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time < 0) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    let start = 0;
    const target = 21;
    const step = () => {
      start += 1;
      if (start <= target) {
        setAge(start);
        requestAnimationFrame(step);
      }
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.75;

    const tryAutoPlayOnFirstInteraction = () => {
      if (hasAutoStartedRef.current || !audioRef.current) return;
      hasAutoStartedRef.current = true;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          hasAutoStartedRef.current = false;
        });
    };

    window.addEventListener("pointerdown", tryAutoPlayOnFirstInteraction, {
      once: true,
    });
    window.addEventListener("keydown", tryAutoPlayOnFirstInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", tryAutoPlayOnFirstInteraction);
      window.removeEventListener("keydown", tryAutoPlayOnFirstInteraction);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const celebrate = () => {
    setConfetti(false);
    requestAnimationFrame(() => setConfetti(true));
    setTimeout(() => setConfetti(false), 4500);
  };

  const nextWish = () => {
    setWishIndex((prev) => (prev + 1) % wishes.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setSurprise(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className="birthday">
      <audio
        ref={audioRef}
        src={REMIX_AUDIO_SRC}
        loop
        preload="auto"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=Great+Vibes&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0f0b0c; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        button { font-family: inherit; cursor: pointer; }
        ::selection { background: #d48a9e55; color: #4d2d38; }
        .birthday { min-height: 100vh; overflow-x: hidden; color: #4d2d38; position: relative;
          background: radial-gradient(ellipse at 5% 5%, #ffe3ed 0%, transparent 40%),
            radial-gradient(ellipse at 95% 10%, #fce6f0 0%, transparent 35%),
            radial-gradient(ellipse at 50% 90%, #ffedf0 0%, transparent 45%),
            linear-gradient(165deg, #fffaf7, #ffeff3 40%, #fff8f2 75%, #fff5f0);
        }
        .music-player { position: fixed; right: 20px; bottom: 20px; z-index: 90;
          display: flex; flex-direction: column; gap: 8px;
          width: 260px; max-width: calc(100vw - 28px);
          padding: 12px 16px; border-radius: 18px;
          border: 1px solid rgba(212, 138, 158, 0.55);
          background: rgba(255, 250, 248, 0.9); backdrop-filter: blur(12px);
          color: #8e4a64;
          box-shadow: 0 12px 30px rgba(160, 100, 110, 0.22); }
        .music-top { display: flex; align-items: center; gap: 10px;
          border: none; background: transparent; padding: 0;
          color: inherit; font-size: 11px; font-weight: 700;
          letter-spacing: 0.4px; text-align: left; }
        .music-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .music-disc { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #c47b91, #e5a8a8); color: #fff; font-size: 12px; }
        .music-disc.spinning { animation: gentleSpin 3s linear infinite; }
        .music-seek-row { display: flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 600; color: #a86c7e; font-variant-numeric: tabular-nums; }
        .music-slider { -webkit-appearance: none; appearance: none; flex: 1; height: 4px;
          border-radius: 999px; outline: none; cursor: pointer; }
        .music-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
          width: 12px; height: 12px; border-radius: 50%;
          background: #b8657c; border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(160, 100, 110, 0.35); cursor: pointer; }
        .music-slider::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%;
          background: #b8657c; border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(160, 100, 110, 0.35); cursor: pointer; }
        .sparkle-bg { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .sparkle { position: absolute; width: 4px; height: 4px; background: #f0c0cb;
          border-radius: 50%; animation: sparkleFloat 7s ease-in-out infinite; opacity: 0; }
        .sparkle:nth-child(1) { left: 5%; top: 10%; animation-delay: 0s; width: 3px; height: 3px; }
        .sparkle:nth-child(2) { left: 15%; top: 35%; animation-delay: 1.2s; width: 5px; height: 5px; background: #f7d5d0; }
        .sparkle:nth-child(3) { left: 25%; top: 60%; animation-delay: 0.5s; }
        .sparkle:nth-child(4) { left: 40%; top: 20%; animation-delay: 2s; width: 6px; height: 6px; background: #e9c0cd; }
        .sparkle:nth-child(5) { left: 55%; top: 75%; animation-delay: 0.8s; }
        .sparkle:nth-child(6) { left: 70%; top: 15%; animation-delay: 1.8s; }
        .sparkle:nth-child(7) { left: 82%; top: 45%; animation-delay: 0.3s; width: 5px; height: 5px; }
        .sparkle:nth-child(8) { left: 92%; top: 70%; animation-delay: 2.5s; }
        .sparkle:nth-child(9) { left: 48%; top: 88%; animation-delay: 1.5s; width: 3px; height: 3px; background: #e9c0cd; }
        .sparkle:nth-child(10) { left: 10%; top: 85%; animation-delay: 3s; width: 6px; height: 6px; }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          25% { opacity: 1; transform: translateY(-20px) scale(1.2); }
          50% { opacity: 0.6; transform: translateY(-40px) scale(0.8); }
          75% { opacity: 0.3; transform: translateY(-60px) scale(0.5); }
        }
        .noise { position: fixed; inset: 0; pointer-events: none; z-index: 2; opacity: 0.07;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
        }
        .topbar { position: relative; z-index: 5; height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1200px; margin: auto; padding: 0 28px;
          border-bottom: 1px solid #ecccd2;
          background: rgba(255, 248, 245, 0.6); backdrop-filter: blur(16px);
        }
        .brand { font-family: 'Playfair Display', serif; font-size: 19px;
          color: #9a5b73; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;
        }
        .brand-icon { display: inline-block; animation: gentleSpin 6s linear infinite; }
        @keyframes gentleSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .top-label { font-size: 9px; letter-spacing: 3.5px; color: #b0868e; font-weight: 700; }

        /* Hero */
        .hero { position: relative; z-index: 5; min-height: 680px; max-width: 1200px;
          padding: 100px 28px 80px; margin: auto;
          display: flex; flex-direction: column; align-items: center; text-align: center; }
        .hero-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, #fcd9e2 0%, #ffe3e9 30%, transparent 65%);
          top: -100px; filter: blur(60px); opacity: 0.6;
          animation: glowPulse 4s ease-in-out infinite; pointer-events: none; }
        @keyframes glowPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }
        .eyebrow { display: flex; align-items: center; gap: 14px; color: #b0788c;
          font-size: 10px; letter-spacing: 5px; font-weight: 700;
          animation: appear 0.9s ease both; position: relative; }
        .eyebrow:before, .eyebrow:after { content: ''; width: 40px; height: 1.5px;
          background: linear-gradient(90deg, transparent, #d6a5ae, transparent); }
        .hero h1 { font-family: 'Playfair Display', serif;
          font-size: clamp(56px, 10vw, 118px); font-weight: 500; line-height: 1.05;
          letter-spacing: -5px; margin-top: 24px;
          background: linear-gradient(135deg, #8e4a64, #d48a9e, #b8657c, #e2a1a5);
          background-size: 300% 300%;
          -webkit-background-clip: text; color: transparent;
          animation: appear 1s 0.15s both, gradientShift 6s ease-in-out infinite; }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .script { font-family: 'Great Vibes', cursive; color: #c48692;
          font-size: clamp(46px, 7vw, 74px); margin-top: -8px;
          animation: appear 1s 0.3s both; position: relative; display: inline-block; }
        .script::after { content: ''; position: absolute; bottom: 2px; left: 10%;
          width: 80%; height: 2px;
          background: linear-gradient(90deg, transparent, #d6a5ae, transparent); border-radius: 2px; }
        .age-badge { display: inline-flex; align-items: center; gap: 10px;
          margin-top: 14px; padding: 8px 24px 8px 20px; border-radius: 50px;
          background: rgba(255,255,255,0.6); border: 1px solid #ecccd2;
          backdrop-filter: blur(8px); animation: appear 1s 0.4s both;
          font-size: 13px; color: #a0687a; }
        .age-badge strong { font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 600; color: #b4687e;
          min-width: 32px; display: inline-block; text-align: center; }
        .hero-desc { max-width: 520px; font-size: 14px; line-height: 2.1;
          color: #a1848b; margin-top: 18px; animation: appear 1s 0.5s both; }
        .hero-actions { display: flex; gap: 14px; margin-top: 32px;
          flex-wrap: wrap; justify-content: center; animation: appear 1s 0.65s both; }
        .floating { position: absolute; color: #d6a0ac;
          animation: float 5s ease-in-out infinite; pointer-events: none;
          z-index: 1; opacity: 0.7; }
        .f1 { left: 8%; top: 18%; font-size: 24px; }
        .f2 { right: 10%; top: 22%; font-size: 30px; animation-delay: 1.2s; }
        .f3 { left: 15%; bottom: 18%; font-size: 18px; animation-delay: 2.2s; }
        .f4 { right: 14%; bottom: 22%; font-size: 22px; animation-delay: 1.8s; }
        .f5 { left: 48%; top: 8%; font-size: 14px; animation-delay: 0.6s; }
        .f6 { right: 28%; bottom: 8%; font-size: 16px; animation-delay: 2.8s; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-22px) rotate(8deg); } }
        .divider { position: relative; z-index: 5; display: flex; align-items: center;
          justify-content: center; gap: 20px; color: #c08596;
          font-size: 11px; letter-spacing: 5px; margin: 0 auto 60px; padding: 0 24px; }
        .divider:before, .divider:after { content: ''; width: 80px; height: 1px;
          background: linear-gradient(90deg, transparent, #e0bcc6 30%, #d6a5ae 50%, #e0bcc6 70%, transparent); }
        .divider-icon { display: inline-block; animation: gentleSpin 8s linear infinite; font-size: 18px; }
        .section { position: relative; z-index: 5; max-width: 1100px;
          margin: auto; padding: 50px 28px 90px; }
        .section-head { text-align: center; margin-bottom: 52px; }
        .section-label { color: #b87a8c; font-size: 9px; letter-spacing: 5px; font-weight: 700; margin-bottom: 4px; }
        .section-title { font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5.5vw, 52px); font-weight: 500;
          color: #875568; margin: 10px 0; line-height: 1.2; }
        .section-sub { font-size: 13px; color: #b08e95; max-width: 480px; margin: 0 auto; }

        /* Gallery */
        .gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
        .photo-card { background: rgba(255,253,251,0.75); backdrop-filter: blur(8px);
          padding: 12px 12px 22px; border: 1px solid rgba(240,210,215,0.5); border-radius: 12px;
          transition: all 0.45s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer;
          transform: rotate(var(--rotate)) scale(1); position: relative;
          box-shadow: 0 8px 32px rgba(160,100,110,0.08), 0 2px 8px rgba(160,100,110,0.04); }
        .photo-card::before { content: ''; position: absolute; inset: -1px; border-radius: 13px;
          padding: 1px; opacity: 0; transition: opacity 0.45s; pointer-events: none;
          background: linear-gradient(135deg, transparent 20%, #f0d0d8 40%, transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; }
        .photo-card:hover::before { opacity: 1; }
        .photo-card:hover { transform: translateY(-14px) rotate(0deg) scale(1.02);
          box-shadow: 0 24px 50px rgba(160,100,110,0.15), 0 4px 12px rgba(160,100,110,0.06); }
        .photo-frame { height: 230px; overflow: hidden; border-radius: 8px; position: relative;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at 30% 20%, #ffede8, transparent 55%),
            linear-gradient(150deg, #f4d9df, #f8e9db); }
        .photo-frame img { width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1); }
        .photo-card:hover img { transform: scale(1.1); }
        .photo-placeholder { text-align: center; color: #ba8290; padding: 16px; }
        .photo-placeholder .placeholder-icon { font-size: 38px; display: block;
          margin-bottom: 10px; animation: gentleSpin 5s linear infinite; }
        .photo-placeholder small { font-size: 9px; letter-spacing: 2.5px; display: block; }
        .photo-caption { text-align: center; margin-top: 16px;
          font-family: 'Playfair Display', serif; font-size: 17px; color: #9a6476; }
        .photo-sub { font-size: 9px; text-align: center; color: #bf9ca2;
          margin-top: 4px; letter-spacing: 0.5px; }

        /* Video */
        .video-section { position: relative; z-index: 5; max-width: 850px;
          margin: 0 auto 70px; padding: 60px 28px; text-align: center; }
        .video-container { max-width: 720px; margin: 32px auto 0; border-radius: 16px;
          overflow: hidden; position: relative; border: 1px solid rgba(240,210,215,0.4);
          background: rgba(255,253,251,0.5); backdrop-filter: blur(6px);
          box-shadow: 0 16px 48px rgba(160,100,110,0.12); }
        .video-placeholder { width: 100%; aspect-ratio: 16/9; cursor: pointer; transition: all 0.35s;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: radial-gradient(circle at 30% 30%, #ffede8, transparent 60%),
            linear-gradient(150deg, #f4d9df, #f8e9db); gap: 14px; padding: 40px 20px; color: #b07a8a; }
        .video-placeholder:hover { background: radial-gradient(circle at 30% 30%, #ffe8e3, transparent 60%),
            linear-gradient(150deg, #f0d0d8, #f5e0d0); }
        .video-placeholder .play-icon { font-size: 56px; transition: transform 0.35s;
          filter: drop-shadow(0 4px 12px rgba(180,120,130,0.25)); }
        .video-placeholder:hover .play-icon { transform: scale(1.15); }
        .video-placeholder p { font-family: 'Playfair Display', serif; font-size: 15px; color: #a06a7c; }
        .video-placeholder small { font-size: 10px; color: #c0949c; letter-spacing: 1.5px; }
        .video-tag {
          display: none;
          width: 100%;
          max-width: 100%;
          height: auto;
          max-height: 405px;
          aspect-ratio: 16 / 9;
          object-fit: contain;
          border-radius: 16px;
          background: #000;
        }
        .video-tag.active {
            display: block;
        }

        /* Cake */
        .cake-section { position: relative; z-index: 5; max-width: 850px;
          margin: 0 auto 90px; padding: 65px 28px; text-align: center; border-radius: 20px;
          border: 1px solid rgba(240,210,215,0.4);
          background: rgba(255,255,255,0.5); backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(160,100,110,0.06), inset 0 1px 0 rgba(255,255,255,0.8); }
        .cake { font-size: 120px; margin: 24px 0 16px; display: inline-block; cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); user-select: none; position: relative;
          filter: drop-shadow(0 14px 18px rgba(160,100,110,0.2)); }
        .cake:hover { transform: scale(1.12) rotate(-5deg);
          filter: drop-shadow(0 18px 28px rgba(160,100,110,0.3)); }
        .cake:active { transform: scale(0.95) rotate(-2deg); }
        .cake-hint { font-size: 10px; color: #b88892; letter-spacing: 2px; font-weight: 600; }
        .wish-box { max-width: 580px; min-height: 95px; margin: 28px auto 22px; padding: 26px 24px;
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(255,246,245,0.9), rgba(255,240,242,0.9));
          border: 1px solid rgba(240,215,220,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
          font-family: 'Playfair Display', serif; font-size: 17px; line-height: 1.9; color: #966777; }

        /* Envelope / Letter */
        .envelope-section { position: relative; z-index: 5; text-align: center; padding: 40px 28px 100px; }
        .envelope { width: 140px; height: 96px; margin: 30px auto; position: relative; cursor: pointer;
          background: linear-gradient(145deg, #e9b8c0, #ddabb5); border-radius: 8px 8px 6px 6px;
          display: grid; place-items: center; font-size: 40px; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 14px 36px rgba(190,130,140,0.25), inset 0 1px 0 rgba(255,255,255,0.3); }
        .envelope:hover { transform: translateY(-10px) scale(1.06);
          box-shadow: 0 20px 50px rgba(190,130,140,0.35); }
        .envelope:after { content: ''; position: absolute; inset: 0; border-radius: 8px; pointer-events: none;
          background: linear-gradient(145deg, transparent 48%, #d99eab 50%, transparent 52%); opacity: 0.25; }
        .letter { max-width: 570px; margin: 30px auto 0; padding: 38px 36px; border-radius: 12px; position: relative;
          background: linear-gradient(160deg, #fffdf9, #fff9f5); border: 1px solid #ead5d1;
          box-shadow: 0 18px 50px rgba(160,100,110,0.1), 0 4px 12px rgba(160,100,110,0.04);
          animation: appear 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
        .letter::before { content: '💌'; position: absolute; top: -18px; left: 24px;
          font-size: 24px; animation: gentleSpin 6s linear infinite; }
        .letter h3 { font-family: 'Great Vibes', cursive; font-size: 40px;
          color: #b87084; margin-bottom: 14px; font-weight: 400; }
        .letter p { color: #9c7a80; font-size: 13.5px; line-height: 2.3; }
        .letter-sign { text-align: right; margin-top: 24px; font-style: italic;
          font-family: 'Playfair Display', serif; color: #ba7a8c; font-size: 14px; }

        /* Buttons */
        .btn { border: none; padding: 16px 28px; border-radius: 50px;
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
        .btn-primary { color: white; box-shadow: 0 10px 28px rgba(200,125,140,0.35);
          background: linear-gradient(135deg, #c47b91, #e5a8a8, #d48a9e); background-size: 200% 200%; }
        .btn-primary:hover { transform: translateY(-5px) scale(1.02);
          box-shadow: 0 18px 40px rgba(200,125,140,0.45); background-position: right center; }
        .btn-outline { color: #a0667a; border: 1.5px solid #e0bcc6;
          background: rgba(255,255,255,0.5); backdrop-filter: blur(4px); }
        .btn-outline:hover { background: rgba(255,255,255,0.9); transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 28px rgba(180,120,130,0.15); border-color: #d6a5ae; }

        /* Footer */
        footer { position: relative; z-index: 5; text-align: center; padding: 38px 24px;
          border-top: 1px solid #ecd5da; color: #ba8a94; font-size: 10px; letter-spacing: 2px;
          background: rgba(255,248,245,0.4); backdrop-filter: blur(8px); }
        footer span { color: #d78f9f; display: inline-block; animation: heartbeat 1.5s ease-in-out infinite; }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.2); }
          50% { transform: scale(1); } 75% { transform: scale(1.15); } }

        /* Modals */
        .modal { position: fixed; inset: 0; z-index: 100; padding: 20px;
          background: rgba(50,25,35,0.6); backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          animation: appear 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .modal-content { max-width: 500px; width: 100%; padding: 52px 34px; border-radius: 20px;
          text-align: center; position: relative; border: 1px solid rgba(240,210,215,0.3);
          background: linear-gradient(150deg, #fffaf5, #ffeef1, #fff5f0);
          box-shadow: 0 30px 90px rgba(0,0,0,0.15); }
        .modal-content h2 { font-family: 'Great Vibes', cursive;
          font-size: 54px; color: #b4687e; margin: 12px 0; font-weight: 400; }
        .modal-content p { font-family: 'Playfair Display', serif;
          font-size: 16px; line-height: 2.1; color: #946a76; }
        .close { position: absolute; top: 14px; right: 18px; border: none; background: none;
          color: #ae7b89; font-size: 28px; width: 36px; height: 36px; border-radius: 50%;
          display: grid; place-items: center; transition: all 0.3s; }
        .close:hover { background: rgba(200,140,150,0.15); transform: rotate(90deg); }
        .lightbox-img { max-width: 90vw; max-height: 80vh; object-fit: contain;
          border: 10px solid rgba(255,255,255,0.95); border-radius: 12px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.3); }

        /* Confetti */
        .confetti-piece { position: fixed; top: -20px; z-index: 200;
          pointer-events: none; animation: confettiFall 4s linear forwards; }
        @keyframes confettiFall { 0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          80% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(110vh) rotate(1080deg) scale(0.3); } }
        @keyframes appear { 0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); } }

        /* Responsive */
        @media(max-width: 860px) {
          .gallery { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .photo-frame { height: 240px; }
          .hero { min-height: 600px; padding-top: 90px; }
          .hero-glow { width: 350px; height: 350px; }
          .f1 { left: 4%; } .f2 { right: 4%; } .f5, .f6 { display: none; }
        }
        @media(max-width: 520px) {
          .topbar { height: 62px; padding: 0 16px; }
          .top-label { font-size: 7px; letter-spacing: 1.5px; }
          .brand { font-size: 15px; }
          .hero { min-height: 580px; padding-top: 80px; padding-left: 16px; padding-right: 16px; }
          .hero h1 { letter-spacing: -2px; }
          .hero-desc { font-size: 12px; }
          .age-badge { font-size: 11px; padding: 6px 16px 6px 14px; }
          .age-badge strong { font-size: 22px; min-width: 26px; }
          .gallery { gap: 10px; }
          .photo-card { padding: 8px 8px 14px; }
          .photo-frame { height: 150px; }
          .photo-caption { font-size: 13px; }
          .photo-sub { font-size: 8px; }
          .cake-section { margin: 0 12px 60px; padding: 40px 16px; border-radius: 14px; }
          .cake { font-size: 80px; }
          .letter { padding: 24px 18px; }
          .letter::before { display: none; }
          .divider { margin-bottom: 35px; gap: 12px; }
          .divider:before, .divider:after { width: 40px; }
          .video-container { border-radius: 12px; }
          .video-placeholder .play-icon { font-size: 40px; }
          .section { padding-left: 16px; padding-right: 16px; }
          .envelope-section { padding-left: 16px; padding-right: 16px; }
          .modal-content { padding: 40px 20px; }
          .music-fab { right: 14px; bottom: 14px; padding: 10px 14px; }
        }
      `}</style>
      <div className="sparkle-bg">
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="sparkle" key={i} />
        ))}
      </div>

      <div className="noise" />

      <div className="music-player">
        <button
          type="button"
          className="music-top"
          onClick={toggleMusic}
          title="Bật/tắt nhạc remix lặp liên tục"
        >
          <span className={`music-disc ${isPlaying ? "spinning" : ""}`}>
            {isPlaying ? "❚❚" : "▶"}
          </span>
          <span className="music-title">
            {isPlaying ? "Anh Bùi Thanh Minh Remix" : "Bật nhạc Remix liên tục"}
          </span>
        </button>

        <div className="music-seek-row">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="music-slider"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Tua nhạc"
            style={{
              background: `linear-gradient(to right, #c47b91 ${
                duration ? (currentTime / duration) * 100 : 0
              }%, #edd5dc 0%)`,
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">✿</span>
          Birthday Memories
        </div>
        <div className="top-label">A SPECIAL DAY · A SPECIAL PERSON</div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <span className="floating f1">✦</span>
        <span className="floating f2">♡</span>
        <span className="floating f3">✧</span>
        <span className="floating f4">✿</span>
        <span className="floating f5">☆</span>
        <span className="floating f6">🌸</span>
        <div className="eyebrow">A DAY TO REMEMBER</div>
        <h1>Happy Birthday</h1>
        <div className="script">Bùi Thanh Minh</div>
        <div className="age-badge">
          ✨ Turning <strong>{age}</strong> today! ✨
        </div>
        <p className="hero-desc">
          Today is all about celebrating you. Một ngày đặc biệt dành cho một
          người đặc biệt. Mong rằng tuổi mới sẽ mang đến thật nhiều niềm vui,
          hạnh phúc và những điều tuyệt vời nhất!
        </p>
        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              document
                .getElementById("memories")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            EXPLORE MEMORIES ✧
          </button>
          <button className="btn btn-outline" onClick={celebrate}>
            ✨ MAKE A WISH
          </button>
        </div>
      </section>

      <div className="divider">
        <span className="divider-icon">✧</span>&nbsp; WITH LOVE &nbsp;
        <span className="divider-icon">✧</span>
      </div>

      {/* PHOTO GALLERY */}
      <section className="section" id="memories">
        <div className="section-head">
          <div className="section-label">THE MEMORY COLLECTION</div>
          <h2 className="section-title">Beautiful Memories</h2>
          <p className="section-sub">
            Four little frames, each holding a treasure of beautiful moments.
          </p>
        </div>
        <div className="gallery">
          {photos.map((photo, index) => (
            <div
              className="photo-card"
              key={index}
              style={
                {
                  "--rotate": `${[-2.5, 2.5, -2, 2][index]}deg`,
                } as React.CSSProperties
              }
              onClick={() => photo.src && setSelectedPhoto(index)}
            >
              <div className="photo-frame">
                {photo.src ? (
                  <img src={photo.src} alt={photo.caption} />
                ) : (
                  <div className="photo-placeholder">
                    <span className="placeholder-icon">♡</span>
                    <small>YOUR PHOTO HERE</small>
                    <div style={{ fontSize: 10, marginTop: 10, opacity: 0.7 }}>
                      PHOTO {index + 1}
                    </div>
                  </div>
                )}
              </div>
              <div className="photo-caption">{photo.caption}</div>
              <div className="photo-sub">{photo.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="video-section">
        <div className="section-head">
          <div className="section-label">A MOVING SURPRISE</div>
          <h2 className="section-title">Watch This</h2>
          <p className="section-sub">
            A little video message made just for you...
          </p>
        </div>
        <div className="video-container">
          <video
            className="video-tag"
            controls
            preload="metadata"
            onPlay={() => {
              if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }}
          >
            <source
              src="/videos/gemini_generated_video_aac2d1fb.mp4"
              type="video/mp4"
            />
          </video>
          <div
            className="video-placeholder"
            onClick={() => {
              const vid =
                document.querySelector<HTMLVideoElement>(".video-tag");
              if (vid && vid.querySelector("source")) {
                vid.style.display = "block";
                (document.querySelector(
                  ".video-placeholder",
                ) as HTMLElement)!.style.display = "none";
                vid.play();
              }
            }}
          >
            <span className="play-icon">▶</span>
            <p>Click to play your birthday video</p>
            <small>✨ Add your video source in the code ✨</small>
          </div>
        </div>
      </section>

      {/* CAKE & WISHES */}
      <section className="cake-section">
        <div className="section-label">MAKE A WISH</div>
        <h2 className="section-title">A Little Birthday Magic</h2>
        <div
          className="cake"
          onClick={() => {
            setCandles(!candles);
            if (candles) celebrate();
          }}
          title="Click to blow out the candles"
        >
          {candles ? "🎂" : "🍰"}
        </div>
        <p className="cake-hint">
          {candles
            ? "✧ CLICK THE CAKE TO BLOW OUT THE CANDLES ✧"
            : "YOUR WISHES ARE ON THEIR WAY ✨"}
        </p>
        <div className="wish-box">{wishes[wishIndex]}</div>
        <button className="btn btn-outline" onClick={nextWish}>
          NEXT WISH ✧
        </button>
      </section>

      {/* LETTER */}
      <section className="envelope-section">
        <div className="section-head">
          <div className="section-label">A LITTLE SOMETHING FOR YOU</div>
          <h2 className="section-title">Open Your Surprise</h2>
          <p className="section-sub">
            There's a little message waiting just for you...
          </p>
        </div>
        <div
          className="envelope"
          onClick={() => setOpened(!opened)}
          title="Open the letter"
        >
          💌
        </div>
        <button className="btn btn-primary" onClick={() => setOpened(!opened)}>
          {opened ? "CLOSE LETTER ♡" : "OPEN YOUR LETTER ♡"}
        </button>
        {opened && (
          <div className="letter">
            <h3>Dear Minh,</h3>
            <p>
              Chúc mừng sinh nhật Minh! 🎂
              <br />
              <br />
              Thêm một tuổi mới, chúc Minh luôn vui vẻ, mạnh khỏe, gặp thật
              nhiều may mắn và luôn có những người tuyệt vời bên cạnh.
              <br />
              <br />
              Mong rằng những điều Minh đang cố gắng sẽ sớm có kết quả xứng
              đáng. Hãy luôn tự tin, theo đuổi những điều mình yêu thích và tạo
              nên thật nhiều kỷ niệm đẹp nhé!
              <br />
              <br />
              Hy vọng hôm nay sẽ là một trong những ngày đáng nhớ nhất của Minh.
              ❤️
            </p>
            <div className="letter-sign">With lots of love ♡</div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        MADE WITH <span>♥</span> JUST FOR BÙI THANH MINH
        <div style={{ marginTop: 10, opacity: 0.65 }}>
          May your new chapter be as beautiful as you are.
        </div>
      </footer>

      {/* SURPRISE MODAL */}
      {surprise && (
        <div className="modal" onClick={() => setSurprise(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSurprise(false)}>
              ×
            </button>
            <div style={{ fontSize: 50 }}>🎉</div>
            <h2>Happy Birthday!</h2>
            <p>
              Bùi Thanh Minh, hôm nay là ngày của bạn! Hãy cười thật nhiều, tận
              hưởng từng khoảnh khắc và đón nhận những điều tuyệt vời đang chờ
              phía trước.
            </p>
            <div style={{ marginTop: 25, fontSize: 26, letterSpacing: 4 }}>
              💗 ✨ 🎂 ✨ 💗
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 28 }}
              onClick={() => setSurprise(false)}
            >
              THANK YOU ♡
            </button>
          </div>
        </div>
      )}

      {/* PHOTO LIGHTBOX */}
      {selectedPhoto !== null && photos[selectedPhoto].src && (
        <div className="modal" onClick={() => setSelectedPhoto(null)}>
          <img
            className="lightbox-img"
            src={photos[selectedPhoto].src}
            alt="Birthday memory"
          />
          <button
            className="close"
            style={{ color: "white", top: 25, right: 25 }}
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* CONFETTI */}
      {confetti && (
        <div>
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              className="confetti-piece"
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                background: [
                  "#e9a4b3",
                  "#f2cc8f",
                  "#c6a0c9",
                  "#f7d5d0",
                  "#d7b5a6",
                  "#f0c0cb",
                  "#e8c4a0",
                ][i % 7],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                borderRadius: i % 2 ? "50%" : "2px",
                width: `${6 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 12}px`,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
