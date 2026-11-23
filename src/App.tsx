
import { useEffect, useState } from "react";

const photos = [
  { src: "/images/2aOboREbp2lpwfQurdP4Pbz4aKVKX2wcONapB9No.jpg", caption: "Beautiful Moments", sub: "Những khoảnh khắc đáng nhớ" },
  { src: "/images/2aOboREbp2ykGzDdSwxv8VJRT3bKGANz4fYmUdUG.jpg", caption: "Little Memories", sub: "Những kỷ niệm tuyệt vời" },
  { src: "/images/2aOboREbp2ZdP8b1K3Zesme3PAIeI7U3KY2f0JzU.jpg", caption: "Happy Together", sub: "Những ngày thật vui" },
  { src: "", caption: "Forever Young", sub: "Tuổi trẻ và những ước mơ" },
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=Great+Vibes&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: #fff8f5;
          font-family: 'DM Sans', sans-serif;
        }

        button { font-family: inherit; cursor: pointer; }

        .birthday {
          min-height: 100vh;
          overflow: hidden;
          color: #603e50;
          background:
            radial-gradient(ellipse at 10% 10%, #ffe3e9 0%, transparent 35%),
            radial-gradient(ellipse at 90% 30%, #fce6ed 0%, transparent 32%),
            linear-gradient(160deg, #fffaf6, #fff0f3 55%, #fff9f1);
          position: relative;
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          opacity: .12;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
        }

        .topbar {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1160px;
          margin: auto;
          padding: 0 24px;
          border-bottom: 1px solid #eecfd4;
        }

        .brand {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #a65b76;
          letter-spacing: 1px;
        }

        .top-label {
          font-size: 10px;
          letter-spacing: 3px;
          color: #b58b91;
          font-weight: 700;
        }

        .hero {
          min-height: 650px;
          max-width: 1160px;
          padding: 95px 24px 75px;
          margin: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #b2788c;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 700;
          animation: appear .9s ease both;
        }

        .eyebrow:before, .eyebrow:after {
          content: '';
          width: 35px;
          height: 1px;
          background: #d6a5ae;
        }

        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(54px, 9vw, 110px);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -4px;
          margin-top: 28px;
          background: linear-gradient(120deg, #9e526e, #e2a1a5, #a45e78);
          -webkit-background-clip: text;
          color: transparent;
          animation: appear 1s .15s both;
        }

        .script {
          font-family: 'Great Vibes', cursive;
          color: #d49a9c;
          font-size: clamp(43px, 6vw, 68px);
          margin-top: 0;
          animation: appear 1s .3s both;
        }

        .hero-desc {
          max-width: 510px;
          font-size: 14px;
          line-height: 2;
          color: #a68a90;
          margin-top: 20px;
          animation: appear 1s .45s both;
        }

        .hero-actions {
          display: flex;
          gap: 13px;
          margin-top: 34px;
          flex-wrap: wrap;
          justify-content: center;
          animation: appear 1s .6s both;
        }

        .btn {
          border: none;
          padding: 15px 25px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .5px;
          transition: .3s;
        }

        .btn-primary {
          color: white;
          background: linear-gradient(120deg, #c47b91, #e5a8a8);
          box-shadow: 0 9px 25px #d59ba555;
        }

        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px #d59ba577;
        }

        .btn-outline {
          color: #a66c7f;
          border: 1px solid #e6bdc6;
          background: #ffffff88;
        }

        .btn-outline:hover {
          background: white;
          transform: translateY(-3px);
        }

        .floating {
          position: absolute;
          color: #d8a2ad;
          animation: float 5s ease-in-out infinite;
          pointer-events: none;
        }

        .f1 { left: 12%; top: 20%; font-size: 26px; }
        .f2 { right: 13%; top: 23%; font-size: 32px; animation-delay: 1s; }
        .f3 { left: 19%; bottom: 20%; font-size: 19px; animation-delay: 2s; }
        .f4 { right: 18%; bottom: 23%; font-size: 24px; animation-delay: 1.5s; }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          color: #c58d9c;
          font-size: 12px;
          letter-spacing: 4px;
          margin: 0 auto 65px;
        }

        .divider:before, .divider:after {
          content: '';
          width: 70px;
          height: 1px;
          background: #e6c5cb;
        }

        .section {
          max-width: 1060px;
          margin: auto;
          padding: 45px 24px 100px;
        }

        .section-head { text-align: center; margin-bottom: 48px; }

        .section-label {
          color: #bd8292;
          font-size: 10px;
          letter-spacing: 4px;
          font-weight: 700;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 5vw, 48px);
          font-weight: 500;
          color: #8e596b;
          margin: 13px 0;
        }

        .section-sub {
          font-size: 13px;
          color: #b29499;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .photo-card {
          background: #fffdfb;
          padding: 10px 10px 19px;
          border: 1px solid #f2e1e0;
          border-radius: 5px;
          box-shadow: 0 12px 30px #ad7c7c12;
          transition: .4s;
          cursor: pointer;
          transform: rotate(var(--rotate));
        }

        .photo-card:hover {
          transform: translateY(-12px) rotate(0deg);
          box-shadow: 0 20px 40px #ad7c7c25;
        }

        .photo-frame {
          height: 230px;
          overflow: hidden;
          background:
            radial-gradient(circle at 30% 20%, #fff1ed, transparent 50%),
            linear-gradient(145deg, #f4d9df, #f8e9db);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .photo-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: .5s;
        }

        .photo-card:hover img { transform: scale(1.07); }

        .photo-placeholder {
          text-align: center;
          color: #ba8290;
          padding: 12px;
        }

        .photo-placeholder span {
          font-size: 34px;
          display: block;
          margin-bottom: 10px;
        }

        .photo-placeholder small {
          font-size: 9px;
          letter-spacing: 2px;
        }

        .photo-caption {
          text-align: center;
          margin-top: 14px;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          color: #9e6878;
        }

        .photo-sub {
          font-size: 9px;
          text-align: center;
          color: #c0a0a3;
          margin-top: 5px;
        }

        .cake-section {
          max-width: 850px;
          margin: 0 auto 100px;
          padding: 65px 24px;
          text-align: center;
          border: 1px solid #f0dadd;
          border-radius: 12px;
          background: #ffffff78;
          box-shadow: 0 20px 60px #b77c8510;
        }

        .cake {
          font-size: 110px;
          margin: 28px 0 20px;
          display: inline-block;
          cursor: pointer;
          transition: .3s;
          filter: drop-shadow(0 12px 12px #b47b7b30);
        }

        .cake:hover { transform: scale(1.1) rotate(-4deg); }

        .cake-hint {
          font-size: 11px;
          color: #bb9096;
          letter-spacing: 1px;
        }

        .wish-box {
          max-width: 580px;
          min-height: 95px;
          margin: 30px auto 20px;
          padding: 23px;
          border-radius: 10px;
          background: #fff6f5;
          border: 1px solid #f3e0df;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          line-height: 1.8;
          color: #9c6b79;
          transition: .3s;
        }

        .envelope-section {
          text-align: center;
          padding: 40px 24px 110px;
        }

        .envelope {
          width: 130px;
          height: 90px;
          margin: 30px auto;
          position: relative;
          background: #e9b8c0;
          border-radius: 5px;
          display: grid;
          place-items: center;
          font-size: 37px;
          box-shadow: 0 12px 30px #c98c9a33;
          cursor: pointer;
          transition: .4s;
        }

        .envelope:hover { transform: translateY(-8px) scale(1.05); }

        .envelope:after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, transparent 49%, #d99eab 50%);
          border-radius: 5px;
          opacity: .4;
        }

        .letter {
          max-width: 570px;
          margin: 30px auto 0;
          padding: 35px;
          background: #fffdf9;
          border: 1px solid #ead5d1;
          box-shadow: 0 15px 45px #b77c8515;
          text-align: left;
          border-radius: 8px;
          animation: appear .6s both;
        }

        .letter h3 {
          font-family: 'Great Vibes', cursive;
          font-size: 38px;
          color: #bb788b;
          margin-bottom: 15px;
        }

        .letter p {
          color: #9f8186;
          font-size: 13px;
          line-height: 2.2;
        }

        .letter-sign {
          text-align: right;
          margin-top: 22px;
          font-family: 'Playfair Display', serif;
          color: #bd8290;
        }

        footer {
          text-align: center;
          border-top: 1px solid #efdce0;
          padding: 35px 20px;
          color: #bd9299;
          font-size: 11px;
          letter-spacing: 1px;
        }

        footer span { color: #d78f9f; }

        .modal {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #482e3ccc;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: appear .3s both;
        }

        .modal-content {
          max-width: 500px;
          width: 100%;
          padding: 50px 30px;
          border-radius: 15px;
          background: linear-gradient(145deg, #fffaf5, #ffeef1);
          text-align: center;
          box-shadow: 0 25px 80px #0003;
          position: relative;
        }

        .modal-content h2 {
          font-family: 'Great Vibes', cursive;
          font-size: 52px;
          color: #b66f83;
          margin: 15px 0;
        }

        .modal-content p {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          line-height: 2;
          color: #98717c;
        }

        .close {
          position: absolute;
          top: 15px;
          right: 18px;
          border: none;
          background: none;
          color: #ae7b89;
          font-size: 25px;
        }

        .lightbox-img {
          max-width: 90vw;
          max-height: 80vh;
          object-fit: contain;
          border: 8px solid white;
          border-radius: 5px;
          box-shadow: 0 20px 70px #0005;
        }

        .confetti-piece {
          position: fixed;
          top: -20px;
          z-index: 200;
          width: 9px;
          height: 13px;
          pointer-events: none;
          animation: fall 3.5s linear forwards;
        }

        @keyframes fall {
          to { transform: translateY(110vh) rotate(900deg); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-18px) rotate(10deg); }
        }

        @keyframes appear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width: 800px) {
          .gallery { grid-template-columns: repeat(2, 1fr); }
          .photo-frame { height: 250px; }
          .hero { min-height: 590px; padding-top: 100px; }
          .f1 { left: 4%; }
          .f2 { right: 4%; }
        }

        @media(max-width: 480px) {
          .topbar { height: 65px; }
          .top-label { font-size: 8px; letter-spacing: 1px; }
          .brand { font-size: 17px; }
          .hero { min-height: 570px; padding-top: 95px; }
          .hero h1 { letter-spacing: -2px; }
          .hero-desc { font-size: 12px; }
          .gallery { gap: 12px; }
          .photo-card { padding: 7px 7px 13px; }
          .photo-frame { height: 170px; }
          .photo-caption { font-size: 14px; }
          .photo-sub { font-size: 8px; }
          .cake-section { margin: 0 14px 70px; padding: 45px 16px; }
          .cake { font-size: 85px; }
          .letter { padding: 25px 20px; }
          .divider { margin-bottom: 40px; }
        }
      `}</style>

      <div className="noise" />

      <header className="topbar">
        <div className="brand">✿ Birthday Memories</div>
        <div className="top-label">A SPECIAL DAY · A SPECIAL PERSON</div>
      </header>

      {/* HERO */}
      <section className="hero">
        <span className="floating f1">✦</span>
        <span className="floating f2">♡</span>
        <span className="floating f3">✧</span>
        <span className="floating f4">✿</span>

        <div className="eyebrow">A DAY TO REMEMBER</div>

        <h1>Happy Birthday</h1>
        <div className="script">Bùi Thanh Minh</div>

        <p className="hero-desc">
          Today is all about celebrating you.
          Một ngày đặc biệt dành cho một người đặc biệt.
          Mong rằng tuổi mới sẽ mang đến thật nhiều
          niềm vui, hạnh phúc và những điều tuyệt vời nhất!
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => {
            document.getElementById("memories")?.scrollIntoView({ behavior: "smooth" });
          }}>
            EXPLORE MEMORIES ✧
          </button>
          <button className="btn btn-outline" onClick={celebrate}>
            ✨ MAKE A WISH
          </button>
        </div>
      </section>

      <div className="divider">✧ &nbsp; WITH LOVE &nbsp; ✧</div>

      {/* PHOTO GALLERY */}
      <section className="section" id="memories">
        <div className="section-head">
          <div className="section-label">THE MEMORY COLLECTION</div>
          <h2 className="section-title">Beautiful Memories</h2>
          <p className="section-sub">
            Four little frames, countless beautiful moments.
          </p>
        </div>

        <div className="gallery">
          {photos.map((photo, index) => (
            <div
              className="photo-card"
              key={index}
              style={{ "--rotate": `${[-2, 2, -1.5, 1.5][index]}deg` } as React.CSSProperties}
              onClick={() => photo.src && setSelectedPhoto(index)}
            >
              <div className="photo-frame">
                {photo.src ? (
                  <img src={photo.src} alt={photo.caption} />
                ) : (
                  <div className="photo-placeholder">
                    <span>♡</span>
                    <small>YOUR PHOTO HERE</small>
                    <div style={{ fontSize: 10, marginTop: 8 }}>
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

      {/* CAKE */}
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

        <div className="wish-box">
          {wishes[wishIndex]}
        </div>

        <button className="btn btn-outline" onClick={nextWish}>
          NEXT WISH ✧
        </button>
      </section>

      {/* LETTER */}
      <section className="envelope-section">
        <div className="section-label">A LITTLE SOMETHING FOR YOU</div>
        <h2 className="section-title">Open Your Surprise</h2>
        <p className="section-sub">
          There's a little message waiting just for you...
        </p>

        <div
          className="envelope"
          onClick={() => setOpened(!opened)}
          title="Open the letter"
        >
          💌
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setOpened(!opened)}
        >
          {opened ? "CLOSE LETTER ♡" : "OPEN YOUR LETTER ♡"}
        </button>

        {opened && (
          <div className="letter">
            <h3>Dear Minh,</h3>
            <p>
              Chúc mừng sinh nhật Minh! 🎂
              <br />
              <br />
              Thêm một tuổi mới, chúc Minh luôn vui vẻ,
              mạnh khỏe, gặp thật nhiều may mắn và luôn
              có những người tuyệt vời bên cạnh.
              <br />
              <br />
              Mong rằng những điều Minh đang cố gắng
              sẽ sớm có kết quả xứng đáng. Hãy luôn tự tin,
              theo đuổi những điều mình yêu thích và tạo
              nên thật nhiều kỷ niệm đẹp nhé!
              <br />
              <br />
              Hy vọng hôm nay sẽ là một trong những
              ngày đáng nhớ nhất của Minh. ❤️
            </p>
            <div className="letter-sign">
              With lots of love ♡
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        MADE WITH <span>♥</span> JUST FOR BÙI THANH MINH
        <div style={{ marginTop: 10, opacity: .7 }}>
          May your new chapter be as beautiful as you are.
        </div>
      </footer>

      {/* SURPRISE MODAL */}
      {surprise && (
        <div className="modal" onClick={() => setSurprise(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSurprise(false)}>×</button>
            <div style={{ fontSize: 48 }}>🎉</div>
            <h2>Happy Birthday!</h2>
            <p>
              Bùi Thanh Minh, hôm nay là ngày của bạn!
              Hãy cười thật nhiều, tận hưởng từng khoảnh khắc
              và đón nhận những điều tuyệt vời đang chờ phía trước.
            </p>
            <div style={{ marginTop: 25, fontSize: 25 }}>💗 ✨ 🎂 ✨ 💗</div>
            <button className="btn btn-primary" style={{ marginTop: 25 }} onClick={() => setSurprise(false)}>
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
          <button className="close" style={{ color: "white", top: 25, right: 25 }}
            onClick={() => setSelectedPhoto(null)}>×</button>
        </div>
      )}

      {/* CONFETTI */}
      {confetti && (
        <div>
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              className="confetti-piece"
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                background: ["#e9a4b3", "#f2cc8f", "#c6a0c9", "#f7d5d0", "#d7b5a6"][i % 5],
                animationDelay: `${Math.random() * 1.5}s`,
                borderRadius: i % 2 ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
