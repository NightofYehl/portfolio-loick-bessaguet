import React, { useMemo, useState, useEffect, useRef } from "react";

/* =====================================================
   Portfolio Loïck — V3.17 (Links in Bio)
   ===================================================== */

export default function PortfolioLoickV3() {
  const accents = ["#1769FF", "#E10086", "#00BFA6", "#FF8A00", "#7C4DFF"];
  const [accentIndex, setAccentIndex] = useState(0);
  const accentHover = accents[accentIndex];
  const cycleAccent = () => setAccentIndex((i) => (i + 1) % accents.length);

  // On initialise sur "home", on utilise "about" au lieu de "contact"
  const [route, setRoute] = useState("home");
  const [accentActive, setAccentActive] = useState(accents[0]);

  // --- Party toggle
  const [party, setParty] = useState(false);
  const toggleParty = () => {
    const next = !party;
    setParty(next);
    window.dispatchEvent(
      new CustomEvent("BG_TOGGLE", { detail: { on: next, palette: accents } })
    );
  };

  const go = (to) => { setRoute(to); setAccentActive(accentHover); };
  useEffect(() => { document.title = "Loïck Bessaguet — Portfolio"; }, []);

  const ENABLE_BG_ANIM = true;

  return (
    <div className="root">
      <StyleBlock accentHover={accentHover} accentActive={accentActive} />

      {/* Fond animé */}
      {ENABLE_BG_ANIM && <BackgroundFX />}

      {/* NAV */}
      <nav className="nav">
        <div className="container navgrid">
          {/* Left spacer caché sur mobile */}
          <div className="left desktop-only" /> 
          
          <div className="brand" onClick={() => go("home")}>
            LOÏCK&nbsp;BESSAGUET
          </div>
          
          <div className="menu">
            <button onMouseEnter={cycleAccent} className={`link ${route==='photos'?'active':''}`} onClick={() => go("photos")}>PHOTOS</button>
            <span className="sep" aria-hidden="true" />
            <button onMouseEnter={cycleAccent} className={`link ${route==='videos'?'active':''}`} onClick={() => go("videos")}>MONTAGES</button>
            <span className="sep" aria-hidden="true" />
            {/* Renommé en À PROPOS */}
            <button onMouseEnter={cycleAccent} className={`link ${route==='about'?'active':''}`} onClick={() => go("about")}>À PROPOS</button>
          </div>
        </div>
      </nav>

      {/* ROUTES */}
      {route === "home" && <Home go={go} cycleAccent={cycleAccent} toggleParty={toggleParty} party={party} />}
      {route === "photos" && <Photos cycleAccent={cycleAccent} accentHover={accentHover} />}
      {route === "videos" && <Videos cycleAccent={cycleAccent} />}
      {/* MODIFICATION: On passe la fonction 'go' au composant About pour le lien interne */}
      {route === "about" && <About cycleAccent={cycleAccent} go={go} />}

      {/* TICKER */}
      <TickerFooter />
    </div>
  );
}

/* -------------------- COMPOSANTS TICKER -------------------- */

function TickerFooter() {
  const items = [
    {
      type: "instagram",
      label: "@lolobessaguet",
      url: "https://instagram.com/lolobessaguet",
      icon: (
        <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"></rect>
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"></circle>
          <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"></circle>
        </svg>
      )
    },
    {
      type: "imdb",
      label: "Loïck Bessaguet",
      url: "https://www.imdb.com/fr/name/nm10475735/?language=fr-fr",
      icon: (
        <span className="ico-wrap">
           <span className="imdb-badge" aria-hidden="true">IMDb</span>
        </span>
      )
    },
    {
      type: "email",
      label: "loick.bessaguet@gmail.com",
      url: "mailto:loick.bessaguet@gmail.com",
      icon: null
    }
  ];

  const TickerSequence = () => (
    <div className="ticker-seq">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="ico-wrap">
            {item.icon && item.type !== 'imdb' ? item.icon : null}
            {item.type === 'imdb' ? item.icon : null}
            <a href={item.url} target="_blank" rel="noreferrer">{item.label}</a>
          </span>
          <span className="slash">/</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <footer className="ticker" role="contentinfo" aria-label="infos légales et liens">
      <div className="ticker-viewport">
        <div className="ticker-track">
          {/* 4 répétitions par moitié pour la fluidité */}
          <div className="ticker-half">
            {Array.from({ length: 4 }).map((_, i) => <TickerSequence key={i} />)}
          </div>
          <div className="ticker-half" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => <TickerSequence key={i} />)}
          </div>
        </div>
      </div>
    </footer>
  );
}


/* -------------------- STYLE & BACKGROUND -------------------- */

function StyleBlock({ accentHover, accentActive }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
      :root { color-scheme: light only; --ink:#0A0A0A; --paper:#FAFAF6; --accentHover:${accentHover}; --accentActive:${accentActive}; }
      * { box-sizing: border-box; }
      img { display:block; max-width:100%; }
      
      /* CONTAINER: Source de vérité pour les marges latérales (desktop & mobile) */
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; }

      html, body { background: #fff; margin:0; padding:0; -webkit-font-smoothing: antialiased; }
      .root { 
        min-height: 100vh; 
        color: var(--ink); 
        padding-bottom: 54px; 
        position: relative; 
        overflow-x: hidden;
        padding-top: 74px; /* espace pour la nav fixe sur desktop */
      }

      /* Canvas de fond */
      .bgfx-canvas { position: fixed; left:0; right:0; top:74px; bottom:46px; z-index: 0; display:block; width:100vw; height:auto; pointer-events:none; }

      /* NAV & HEADER - Mobile Optimized */
      .nav { 
        position: fixed; 
        top: 0; 
        left: 0; 
        right: 0; 
        z-index: 30; 
        border-bottom: 2px solid #0A0A0A; 
        background: #fff; 
      }
      .navgrid { display:grid; grid-template-columns: 1fr auto 1fr; align-items:center; height:74px; }
      .brand { font-family:'Space Grotesk', system-ui; font-weight:700; letter-spacing:.02em; cursor:pointer; font-size: clamp(20px, 4vw, 36px); text-align:center; white-space:nowrap; }
      .menu { display:flex; align-items:center; gap:10px; justify-self:end; }
      .sep { display:inline-block; width:1px; height:12px; background: currentColor; opacity:.3; transform: translateY(1px); }
      .link { font-family:'Inter', system-ui; letter-spacing:.08em; font-weight:600; font-size:13px; background:none; border:none; padding:8px 0; cursor:pointer; color:var(--ink); text-transform:uppercase; }
      .link.active { color: var(--accentActive); }
      .link:hover { color: var(--accentHover); }

      /* Mobile Navigation Tweaks */
      @media (max-width: 768px) {
        .navgrid { display:flex; flex-direction:column; justify-content:center; height:auto; padding: 12px 0; gap:8px; }
        .desktop-only { display: none; }
        .menu { justify-self: center; flex-wrap: wrap; justify-content: center; }
        .brand { font-size: 24px; }
        .bgfx-canvas { top: 90px; }
        .root { padding-top: 90px; }
      }

      /* HOME */
      .home { min-height: calc(100vh - 130px); display:grid; place-items:center; position:relative; z-index:1; }
      .cta { display:flex; gap:24px; flex-wrap:wrap; justify-content:center; }
      .cta .btn { font-family:'Space Grotesk'; font-weight:700; font-size: clamp(28px, 7vw, 80px); letter-spacing:.02em; text-transform:uppercase; border: 3px solid var(--ink); padding: 22px 28px; background: var(--paper); color: var(--ink); cursor: pointer; transition: transform 0.1s; }
      .cta .btn:hover { background: var(--accentHover); color: white; border-color: var(--accentHover); }
      .cta .btn:active { transform: scale(0.98); }
      .egg { position:absolute; bottom: 14px; left: 16px; right: auto; top: auto; font-family:'Inter'; font-size:10px; letter-spacing:.04em; opacity:.1; cursor:pointer; background:none; border:none; padding:2px 4px; }
      .egg:hover { color: var(--accentHover); opacity:.9; }

      /* SECTION headings + notes */
      .section { padding-top: 48px; padding-bottom: 60px; position: relative; z-index: 1; }
      
      .h1 { font-family:'Space Grotesk'; font-weight:700; font-size: clamp(34px, 5vw, 64px); letter-spacing:.01em; margin:0; line-height:1.1; }
      .sub { font-family: 'Inter', system-ui; font-size: 12px; letter-spacing: .12em; opacity: .8; text-transform: uppercase; color: #000000ff;}
      .note { font-family:'Inter'; font-size:14px; line-height:1.45; letter-spacing:.02em; color: #242424ff; opacity:1; max-width: 520px; font-weight: 500; }
      .note-right { margin-left:auto; text-align:right; }
      .headrow { display:flex; align-items:flex-end; gap:12px; border-bottom:2px solid #0A0A0A; padding-bottom:12px; margin-bottom:18px; }
      @media (max-width: 900px){
        .note-right { margin-left:0; text-align:left; max-width:none; margin-top:8px; }
        .headrow { flex-direction:column; align-items:flex-start; gap:4px; }
      }

      /* FILTERS */
      .filters { display:flex; flex-wrap:wrap; gap:10px; margin: 10px 0 18px; }
      .fbtn { font-family:'Inter'; font-size:12px; letter-spacing:.1em; text-transform:uppercase; border:2px solid #111; padding:6px 10px; cursor:pointer; background: var(--paper); color: var(--ink); }
      .fbtn.active { border-color: var(--filterActive); color: var(--filterActive); background: var(--paper); }
      .fbtn:hover { border-color: var(--accentHover); color: var(--accentHover); background: var(--paper); }

      /* PHOTOS — Masonry */
      .masonry { column-count: 3; column-gap: 12px; transition: opacity .25s ease; }
      @media (max-width: 1000px) { .masonry { column-count: 2; } }
      @media (max-width: 600px)  { .masonry { column-count: 1; } }
      .masonry.hidden { opacity: 0; pointer-events:none; }
      .masonry.visible { opacity: 1; }

      .tile { position: relative; display: block; width: 100%; margin: 0 0 12px; border: 2px solid transparent; break-inside: avoid; -webkit-column-break-inside: avoid; page-break-inside: avoid; overflow: hidden; background: #eee; }
      .tile.ready { border-color: #111; }
      .tile img { width: 100%; height: auto; object-fit: cover; display: block; opacity: 0; transition: opacity .35s ease; }
      .tile.ready img { opacity: 1; }
      .tile:hover { border-color: transparent; }
      .tile .hl { position:absolute; inset:0; background: var(--accentHover); opacity:0; mix-blend-mode: multiply; transition: opacity .12s linear; }
      .tile .edge { position:absolute; inset:0; border:6px solid var(--accentHover); opacity:0; transition: opacity .12s linear; pointer-events:none; }
      .tile .cap { position:absolute; left:0; right:0; bottom:6px; background: color-mix(in srgb, var(--accentHover) 45%, transparent); color: white; padding:6px 18px; display:flex; justify-content:space-between; gap:8px; font-family:'Inter'; font-size:12px; letter-spacing:.06em; text-transform:uppercase; opacity:0; transition: opacity .12s linear; }
      .tile:hover .hl { opacity:.28; }
      .tile:hover .edge, .tile:hover .cap { opacity:1; }

      /* SKELETON */
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      .skelgrid { column-count: 3; column-gap: 12px; }
      @media (max-width: 1000px) { .skelgrid { column-count: 2; } }
      @media (max-width: 600px)  { .skelgrid { column-count: 1; } }
      .skel { height: 220px; margin: 0 0 12px; border: 2px solid #111; break-inside: avoid; -webkit-column-break-inside: avoid; page-break-inside: avoid; background: linear-gradient(90deg, #ecebe6 0%, #f7f6f2 40%, #ecebe6 80%); background-size: 200% 100%; animation: shimmer 1.1s linear infinite; }

      /* VIEWER */
      .viewerS { position: fixed; inset: 0; background: rgba(10,10,10,.92); z-index: 80; display:flex; align-items:center; justify-content:center; padding: 36px; }
      .viewerS img { max-width: calc(100vw - 40px); max-height: calc(100vh - 40px); object-fit: contain; border: none; }
      .viewer-close {
        position: absolute;
        top: 18px;
        right: 18px;
        z-index: 100;
        background: rgba(255,255,255,0.15);
        border: 2px solid rgba(255,255,255,0.6);
        color: #fff;
        font-size: 22px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 0;
        padding: 0;
        line-height: 1;
        transition: background 0.15s, border-color 0.15s;
        font-family: 'Inter', system-ui;
      }
      .viewer-close:hover {
        background: var(--accentHover);
        border-color: var(--accentHover);
      }

      /* VIDEOS */
      .vlist { display:grid; gap: 18px; }
      .vcard { display:grid; grid-template-columns: 3fr 2fr; border:2px solid #111; background: transparent; }
      .thumb { position: relative; background:transparent; display:flex; }
      .thumb img { width:100%; height:auto; aspect-ratio:16/9; object-fit:cover; display:block; }
      .meta { border-left:2px solid #111; display:flex; flex-direction:column; justify-content:space-between; padding: 14px 16px; background: var(--paper); }
      .meta h3 { font-family:'Space Grotesk'; font-size: 20px; margin:0; line-height:1.2; }
      .meta .info { font-family:'Inter'; text-transform:uppercase; letter-spacing:.09em; font-size:12px; opacity:.8; }
      .meta .grid { display:grid; grid-template-columns: 120px 1fr; gap:6px 10px; margin:10px 0 6px; }
      .meta .btn { border:2px solid var(--ink); padding:8px 10px; background:transparent; font-family:'Inter'; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; color: var(--ink); text-decoration: none; display:inline-block; font-size:12px;}
      .meta .btn:hover{ background: var(--accentHover); color:white; border-color: var(--accentHover); }
      @media (max-width: 900px){ 
        .vcard{ grid-template-columns: 1fr; } 
        .meta{ border-left: none; border-top:2px solid #111; } 
        .meta .grid{ grid-template-columns: 1fr; } 
      }

      /* Fix Galaxy S8+ (360px) overflow */
      .vcard {
        max-width: 100%;
        overflow: hidden;
        word-break: break-word;
      }

      /* ABOUT / CONTACT SECTION */
      .about-grid { 
        display: grid; 
        grid-template-columns: 1fr 2fr; 
        gap: 24px; 
        margin-bottom: 28px;
        align-items: stretch; /* Hauteur égale */
      }

      .bio-photo { 
        background: #e0e0e0; 
        aspect-ratio: 124 / 100; 
        border: 2px solid #111; 
        position: relative; 
        overflow:hidden; 
        max-height: 340px; 
      }
      .bio-photo img { width:100%; height:100%; object-fit:cover; display:block; }
      .bio-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#999; font-family:'Space Grotesk'; font-weight:700; letter-spacing:0.1em; }
      
      .bio-text { 
        font-family: 'Inter'; 
        font-size: 15px; 
        line-height: 1.6; 
        color: var(--ink);
        border: 2px solid #111;
        padding: 18px;
        background: var(--paper);
        display: flex;
        flex-direction: column;
        justify-content: center; /* Centrage vertical */
        height: 100%;
      }
      .bio-text p { margin-top: 0; }
      .bio-text p:last-child { margin-bottom: 0; }

      /* Styles spécifiques pour les liens dans la bio */
      .bio-text a {
        color: inherit;
        text-decoration: underline;
        cursor: pointer;
        transition: color 0.2s;
      }
      .bio-text a:hover {
        color: var(--accentHover);
      }

      .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
      .contact-card { border: 2px solid #111; padding: 16px; background: var(--paper); }

      @media (max-width: 768px) {
        .about-grid { grid-template-columns: 1fr; gap: 16px; }
        .bio-photo { 
          max-width: 100%; 
          aspect-ratio: 4 / 5;
          max-height: 320px;
        }
      }

      /* TICKER (Smooth V3.14) */
      .ticker { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; border-top: 2px solid #0A0A0A; background: #fff; height: 46px; overflow: hidden; }
      .ticker-viewport { width: 100%; height: 100%; overflow: hidden; }

      .ticker-track {
        display: flex;
        align-items: center;
        width: max-content; 
        height: 100%;
        animation: ticker-move 80s linear infinite; 
        will-change: transform;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
      }

      .ticker-half { display: flex; align-items: center; }
      .ticker-seq { display: flex; align-items: center; gap: 16px; padding-right: 16px; white-space: nowrap; font-family: 'Inter', system-ui; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink); }
      
      .ticker a { color: var(--ink); text-decoration:none; }
      .ticker a:hover { color: var(--accentHover); }
      .ticker .slash { opacity: .5; }
      .ticker .ico { width:18px; height:18px; margin-right:8px; vertical-align:middle; fill: currentColor; }
      .ticker .ico-wrap { display:inline-flex; align-items:center; }
      .ticker .imdb-badge { display:inline-flex; align-items:center; justify-content:center; height:16px; padding:0 6px; border:2px solid currentColor; border-radius:3px; font-weight:800; font-size:10px; margin-right:6px; line-height:1; }

      @keyframes ticker-move { 
        0% { transform: translate3d(0, 0, 0); } 
        100% { transform: translate3d(-50%, 0, 0); } 
      }

      @media (prefers-reduced-motion: reduce) {
        .ticker-track { animation: none; }
        .skel { animation: none; }
      }


      /* COMING SOON placeholder */
      .coming-soon {
        width: 100%;
        height: 100%;
        min-height: 200px;
        aspect-ratio: 1274 / 716;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        user-select: none;
        cursor: default;
      }
      .coming-soon p {
        font-family: 'Space Grotesk', system-ui;
        color: var(--ink);
        font-size: clamp(20px, 4vw, 32px);
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        margin: 0;
      }

    `}</style>
  );
}

function BackgroundFX() {
  const ref = useRef(null);
  useEffect(() => {
    function hash(x,y,seed=0){let h=(x|0)*0x8da6b343^(y|0)*0xd8163841^(seed|0);h^=h>>>16;return h>>>0}
    const rand01=h=>(h>>>0)/4294967296;
    const smooth=t=>t*t*(3-2*t);
    function valueNoise2D(x,y,seed=0){
      const xi=Math.floor(x), yi=Math.floor(y);
      const xf=x-xi, yf=y-yi;
      const v00=rand01(hash(xi,yi,seed)), v10=rand01(hash(xi+1,yi,seed)),
            v01=rand01(hash(xi,yi+1,seed)), v11=rand01(hash(xi+1,yi+1,seed));
      const u=smooth(xf), v=smooth(yf);
      return (v00*(1-u)+v10*u)*(1-v)+(v01*(1-u)+v11*u)*v;
    }
    function fbm(x,y,oct=4,lac=2,gain=.5,seed=0){
      let a=1,f=1,sum=0,norm=0;
      for(let i=0;i<oct;i++){sum+=(valueNoise2D(x*f,y*f,seed+i)-.5)*a;norm+=a;a*=gain;f*=lac}
      return sum/norm;
    }
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", {alpha:false});
    let DPR = Math.max(1, window.devicePixelRatio||1);
    let seed = (Math.random()*1e9)|0;
    const SPACING=9, CONTRAST=180, DOT_BASE_ALPHA=0.11;
    let DOT_ALPHA=DOT_BASE_ALPHA, DOT_COLOR='rgb(0 0 0)';
    const BG_GRAD_A='#ffffff', BG_GRAD_B='#ffffff';
    const FPS=20, BASE_FREQ=0.9, AMP_GLOBAL=0.20, PHASE_JITTER=Math.PI*2;
    const VIGNETTE_STRENGTH=0.1;
    let partyOn=false, palette=["#1769FF", "#E10086", "#00BFA6", "#FF8A00", "#7C4DFF"];
    const COLOR_STEP_MS=100;
    let grid=[], cols=0, rows=0, spacing=SPACING, last=0, raf;

    function resize(){
      DPR = Math.max(1, window.devicePixelRatio||1);
      const w = window.innerWidth;
      const navHeightApprox = window.innerWidth > 768 ? 74 : 90; 
      const h = Math.max(0, window.innerHeight - navHeightApprox - 46); 
      canvas.style.width = w+'px';
      canvas.style.height = h+'px';
      canvas.width = Math.round(w*DPR);
      canvas.height = Math.round(h*DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
      buildGrid();
      drawStaticBackground();
      last=0;
      drawFrame(0);
    }
    function drawStaticBackground(){
      const w=canvas.clientWidth, h=canvas.clientHeight;
      ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,w,h);
      const g=ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0, BG_GRAD_A); g.addColorStop(1, BG_GRAD_B);
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    }
    function buildGrid(){
      const w=canvas.clientWidth, h=canvas.clientHeight;
      spacing=SPACING; cols=Math.ceil(w/spacing); rows=Math.ceil(h/spacing);
      const baseRadius=Math.max(1, spacing*0.55);
      const scale=0.006*(100/CONTRAST);
      const cx=w*0.52, cy=h*0.48;
      const maxD=Math.hypot(cx,cy);
      grid=[];
      for(let iy=0; iy<rows; iy++){
        const y=(iy+0.5)*spacing;
        const colOffset=(iy%2)*(spacing*0.35);
        for(let ix=0; ix<cols; ix++){
          const x=(ix+0.5)*spacing+colOffset;
          const nx=x*scale, ny=y*scale;
          const n=fbm(nx+seed*1.3, ny+seed*0.7, 4, 2, .5, seed);
          const d=Math.hypot(x-cx, y-cy);
          const vign=1-(d/maxD);
          const rBase=baseRadius*Math.max(0, 0.12+(n*1.3)*1.05+vign*0.8);
          const hsh=hash(ix,iy,seed);
          const phase=(hsh&0xffff)/0xffff*PHASE_JITTER;
          const amp=AMP_GLOBAL*(0.5+((hsh>>>16)&0xff)/255);
          if(rBase>0.25) grid.push({x,y,rBase:rBase*0.45,phase,amp});
        }
      }
    }
    function drawVignette(){
      if(VIGNETTE_STRENGTH<=0)return;
      const w=canvas.clientWidth, h=canvas.clientHeight;
      const g=ctx.createRadialGradient(w*0.5,h*0.5,Math.min(w,h)*0.35,w*0.5,h*0.5,Math.max(w,h)*0.9);
      g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(0.2,'rgba(0,0,0,0.02)');
      g.addColorStop(0.7,`rgba(0,0,0,${VIGNETTE_STRENGTH*0.8})`);
      g.addColorStop(0.8,`rgba(0,0,0,${VIGNETTE_STRENGTH})`);
      ctx.save(); ctx.globalCompositeOperation='multiply'; ctx.fillStyle=g; ctx.fillRect(0,0,w,h); ctx.restore();
    }
    function drawFrame(tms){
      drawStaticBackground();
      if(partyOn){
        const idx=Math.floor(tms/COLOR_STEP_MS)%palette.length;
        DOT_COLOR=palette[idx];
        DOT_ALPHA=0.6+0.4*(0.5+0.5*Math.sin(tms*0.02));
      }else{ DOT_COLOR='rgb(0 0 0)'; DOT_ALPHA=DOT_BASE_ALPHA; }
      ctx.fillStyle=DOT_COLOR; ctx.globalAlpha=Math.min(1,DOT_ALPHA);
      const omega=2*Math.PI*BASE_FREQ, t=tms/1000;
      for(let i=0;i<grid.length;i++){
        const p=grid[i];
        const k=1+p.amp*Math.sin(omega*t+p.phase);
        const r=p.rBase*k*(partyOn?1.08:1.0);
        ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1; drawVignette();
    }
    function loop(now){ if(now-last>1000/FPS){drawFrame(now); last=now;} raf=requestAnimationFrame(loop); }
    const onToggle=e=>{ const d=e?.detail||{}; partyOn=!!d.on; if(Array.isArray(d.palette)) palette=d.palette.slice(); };
    const onResize=()=>{ clearTimeout(window._bg_rs); window._bg_rs=setTimeout(resize,120); };
    resize(); raf=requestAnimationFrame(loop);
    window.addEventListener('resize',onResize); window.addEventListener('BG_TOGGLE',onToggle);
    return ()=>{ window.removeEventListener('resize',onResize); window.removeEventListener('BG_TOGGLE',onToggle); if(raf)cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="bgfx-canvas" aria-hidden="true" />;
}

function Home({ go, cycleAccent, toggleParty, party }) {
  return (
    <main className="home container">
      <button className="egg" onMouseEnter={cycleAccent} onClick={toggleParty}>
        Mode fun ? {party ? "— ON" : "— OFF"}
      </button>
      <div className="cta">
        <button onMouseEnter={cycleAccent} className="btn" onClick={() => go("photos")}>Photos</button>
        <button onMouseEnter={cycleAccent} className="btn" onClick={() => go("videos")}>Montages</button>
      </div>
    </main>
  );
}

function Photos({ cycleAccent, accentHover }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let alive = true;
    fetch("/data/photos.json").then((r) => r.json()).then((d) => { if (alive) setData(Array.isArray(d) ? d : []); }).catch(() => { if (alive) setData([]); });
    return () => { alive = false; };
  }, []);
  const [loaded, setLoaded] = useState(new Set());
  const markLoaded = (src) => setLoaded(prev => { const next = new Set(prev); next.add(src); return next; });
  const isReady = (src) => loaded.has(src);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState("all");
  const [filterActiveColor, setFilterActiveColor] = useState(accentHover);
  const filtered = useMemo(() => data.filter(d => filter === 'all' ? true : d.tag === filter), [data, filter]);
  const readyCount = loaded.size;
  const threshold = Math.min(8, filtered.length || 0);
  const showSkeleton = (filtered.length === 0) || (readyCount < threshold);
  useEffect(()=>{
    const onKey = (e)=>{ if(viewerOpen && e.key==='Escape') setViewerOpen(false); };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [viewerOpen]);
  const filters = [
    {key:'all', label:'All'}, {key:'paysage', label:'Paysage'}, {key:'street', label:'Street photography'},
    {key:'architecture', label:'Architecture'}, {key:'abstract', label:'Abstract'}, {key:'edito', label:'Edito'},
  ];
  const SIZES = [240, 180, 300, 220, 260, 200];
  return (
    <section className="section container">
      <div className="headrow">
        <div className="h1">Photographies</div>
        <p className="note note-right">Tout mon travail photographique est effectué à l’argentique, sans effets,<br />notamment les photos abstraites qui sont directement issues du négatif.</p>
      </div>
      <div className="filters" style={{"--filterActive": filterActiveColor}}>
        {filters.map(f=> (
          <button key={f.key} onMouseEnter={cycleAccent} className={`fbtn ${filter===f.key?'active':''}`} onClick={()=>{ setFilter(f.key); setFilterActiveColor(accentHover); }}>{f.label.toUpperCase()}</button>
        ))}
      </div>
      {showSkeleton && (
        <div className="skelgrid" aria-hidden="true">
          {Array.from({length: 12}).map((_,i)=>(<div key={i} className="skel" style={{height: SIZES[i % SIZES.length]}} />))}
        </div>
      )}
      <div className={`masonry ${showSkeleton ? 'hidden' : 'visible'}`} style={{"--filterActive": filterActiveColor}}>
        {filtered.map((p, i) => (
          <figure key={p.src || i} className={`tile ${isReady(p.src) ? 'ready' : ''}`} onMouseEnter={cycleAccent} onClick={()=>{ setCurrent(i); setViewerOpen(true); }}>
            <img src={p.src} alt={`${p.cat} — ${p.title}`} onLoad={() => markLoaded(p.src)} />
            <span className="hl" /> <span className="edge" />
            <div className="cap"><span>{p.title}</span><span>{p.cat}{p.film ? ` — ${p.film}` : ""}</span></div>
          </figure>
        ))}
      </div>
      {viewerOpen && filtered[current] && (
        <div className="viewerS" onClick={()=>setViewerOpen(false)}>
          <button className="viewer-close" onClick={()=>setViewerOpen(false)} aria-label="Fermer">✕</button>
          <img src={filtered[current].full || filtered[current].src} alt={`${filtered[current].cat} — ${filtered[current].title}`} onClick={(e)=>e.stopPropagation()}/>
        </div>
      )}

    </section>
  );
}

function Videos({ cycleAccent }) {
  const [vids, setVids] = useState([]);
  useEffect(() => {
    let alive = true;
    fetch("/data/videos.json").then((r) => r.json()).then((d) => { if (alive) setVids(Array.isArray(d) ? d : []); }).catch(() => { if (alive) setVids([]); });
    return () => { alive = false; };
  }, []);
  const LABELS = { year: "Année", type: "Type", role: "Rôle", duration: "Durée", diffuseur : "Diffuseur", director: "Réalisation", production: "Production", client: "Client", festivals: "Festival", camera: "Caméra", format: "Format", sound: "Son", music: "Musique", color: "Étalonnage", awards: "Prix", pitch: "Pitch" };
  const ORDER = ["year", "type", "role", "duration", "director", "production", "client", "festivals", "camera", "format", "sound", "music", "color", "awards", "pitch"];
  const isFilled = (val) => val !== undefined && val !== null && String(val).trim() !== "";
  const shouldShow = (key, val) => {
    if (!isFilled(val)) return false;
    if (key === "year" || key === "type") return false;
    if (key === "role" && String(val).trim().toLowerCase() === "montage") return false;
    return true;
  };
  const humanize = (k) => k.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const buildPairs = (v) => {
    const reserved = new Set(["title", "img", "thumb", "poster", "link", "more_info"]);
    const pairs = [];
    ORDER.forEach((key) => { if (shouldShow(key, v[key])) pairs.push([LABELS[key] || humanize(key), v[key]]); });
    Object.keys(v).forEach((key) => { if (!reserved.has(key) && !ORDER.includes(key) && shouldShow(key, v[key])) { pairs.push([LABELS[key] || humanize(key), v[key]]); } });
    return pairs;
  };
  const headerLine = (v) => {
    const bits = [];
    if (isFilled(v.year)) bits.push(v.year);
    if (isFilled(v.type)) bits.push(v.type);
    if (isFilled(v.role) && v.role.trim().toLowerCase() !== "montage") { bits.push(v.role); }
    return bits.join(" • ");
  };
  return (
    <section className="section container">
      <div className="headrow">
        <div className="h1">Montages</div>
        <p className="note note-right">Certains de mes travaux en tant que monteur. Non exhaustif.<br />Bien plus en tant qu'assistant monteur ou en technique sur IMDb.</p>
      </div>
      <div className="vlist">
        {vids.map((v, idx) => (
          <article key={idx} className="vcard">
            <div className="thumb">{v.img ? (<img src={v.img} alt={v.title} />) : (<div className="coming-soon"><p>Le film sort bientôt</p></div>)}</div>
            <div className="meta">
              <div>
                <h3>{v.title}</h3>
                {headerLine(v) && <div className="info" style={{ marginTop: 6 }}>{headerLine(v)}</div>}
                <div className="grid">
                  {buildPairs(v).map(([label, value], i) => (<React.Fragment key={i}><div className="info">{label}</div><div>{value}</div></React.Fragment>))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                {v.more_info ? (<a onMouseEnter={cycleAccent} className="btn" href={v.more_info} target="_blank" rel="noreferrer">Plus d'infos sur le projet</a>) : null}
                {v.link ? (<a onMouseEnter={cycleAccent} className="btn" href={v.link} target="_blank" rel="noreferrer">Voir le film</a>) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Renommé de "Contact" à "About" (mis à jour avec les liens)
function About({ cycleAccent, go }) {
  return (
    <section className="section container">
      <div className="h1" style={{borderBottom:"2px solid #0A0A0A", paddingBottom:12, marginBottom:24}}>À Propos</div>
      
      {/* Nouvelle section BIO avec style encadré */}
      <div className="about-grid">
        <div className="bio-photo">
          <img src="/images/portrait.jpg" alt="Loïck Bessaguet" />
        </div>
        {/* La classe bio-text a maintenant le style "carte" */}
        <div className="bio-text">
           <p>Monteur sur les projets de ce site (cf : <a href="#" onClick={(e)=>{e.preventDefault(); go('videos');}} onMouseEnter={cycleAccent}>page "MONTAGE"</a>), ainsi que sur d'autres court-métrages, des publicités et des bandes annonces pour Gulli et Edan TV.</p> 
           <p>Assistant monteur sur plusieurs séries, en français et en anglais. (cf : <a href="https://www.imdb.com/fr/name/nm10475735/?language=fr-fr" target="_blank" rel="noreferrer" onMouseEnter={cycleAccent}>iMDB</a>)</p>
           <p>Responsable technique chez <a href="https://www.blackship.tv/" target="_blank" rel="noreferrer" onMouseEnter={cycleAccent}>Blackship</a> pendant presque 7 ans, avec une grande connaissance des workflows images dans le domaine de la fiction et du documentaire. J'ai eu l'occasion de travailler avec Netflix, Disney, Amazon, Apple, Canal +, Arte, FTV, TF1, OCS et Blackpills.</p>
           <p>Photographe argentique avec de nombreux projets et de l'editorial, notamment pour la marque de vétements Synes et quelques petites expositions.</p>
           <p>Basé à Paris, appelez moi même pour des projets ailleurs, j'aime voyager ! </p>
        </div>
      </div>

      {/* Section Contact existante (maintenant en dessous) */}
      <div className="contact-grid">
        <div className="contact-card">
          <div className="sub">Email</div>
          <a onMouseEnter={cycleAccent} className="link" href="mailto:loick.bessaguet@gmail.com" style={{display:'inline-block', marginTop:6}}>loick.bessaguet@gmail.com</a>
        </div>
        <div className="contact-card">
          <div className="sub">Téléphone</div>
          <a onMouseEnter={cycleAccent} className="link" href="tel:0621574374" style={{display:'inline-block', marginTop:6}}>06 21 57 43 74</a>
        </div>
        <div className="contact-card">
          <div className="sub">Réseaux</div>
          <div style={{display:'flex', gap:16, marginTop:6}}>
            <a onMouseEnter={cycleAccent} className="link" href="https://instagram.com/lolobessaguet" target="_blank" rel="noreferrer">Instagram</a>
            <a onMouseEnter={cycleAccent} className="link" href="https://www.imdb.com/fr/name/nm10475735/?language=fr-fr" target="_blank" rel="noreferrer">IMDb</a>
          </div>
        </div>
      </div>
      <p className="sub" style={{marginTop:24}}>Intéressé par un tirage photo ? Contactez-moi — tirages signés et numérotés, plusieurs formats disponibles.</p>
    </section>
  );
}