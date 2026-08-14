"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiracLogo } from "./airac-logo";
import { landmarkSlides } from "./data";
import { Icon } from "./icons";

export function LandmarkHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const touchStart = useRef<number | null>(null);
  const total = landmarkSlides.length;
  const go = useCallback((direction: number) => {
    setActive((current) => (current + direction + total) % total);
  }, [total]);
  const goToPrevious = useCallback(() => go(-1), [go]);
  const goToNext = useCallback(() => go(1), [go]);

  useEffect(() => {
    if (paused || interacting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(goToNext, 6500);
    return () => window.clearInterval(timer);
  }, [active, paused, interacting, goToNext]);

  return <section
    className="landmark-hero"
    aria-roledescription="carousel"
    aria-label="چشم‌اندازهای استان سمنان"
    onMouseEnter={() => setInteracting(true)}
    onMouseLeave={() => setInteracting(false)}
    onFocusCapture={() => setInteracting(true)}
    onBlurCapture={() => setInteracting(false)}
    onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
    onTouchEnd={(event) => {
      if (touchStart.current === null) return;
      const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
      if (Math.abs(distance) > 45) go(distance > 0 ? 1 : -1);
      touchStart.current = null;
    }}
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft") go(1);
      if (event.key === "ArrowRight") go(-1);
    }}
    tabIndex={0}
  >
    <div className="hero-slides">
      {landmarkSlides.map((slide, index) => <div className={`hero-slide ${active === index ? "active" : ""}`} key={slide.src} aria-hidden={active !== index}>
        <Image src={slide.src} alt={slide.title} fill sizes="100vw" priority={index === 0} quality={88} />
      </div>)}
    </div>
    <div className="hero-scrim" />
    <div className="hero-content page-shell">
      <div className="hero-institution">
        <span className="institution-line" />
        <div><span>استانداری سمنان</span><span>مرکز راهبری پژوهش و پیشرفت هوش مصنوعی</span></div>
        <AiracLogo className="hero-airac-logo" hero priority />
      </div>
      <div className="hero-copy" aria-live="polite">
        <span className="hero-eyebrow">{landmarkSlides[active].eyebrow}</span>
        <h1>{landmarkSlides[active].title}</h1>
        <p>{landmarkSlides[active].description}</p>
        <div className="hero-links">
          <a className="button button-gold" href="#province">شناخت استان <Icon name="arrow" /></a>
          <a className="text-link" href="#governance">مرور چشم‌انداز حکمرانی <Icon name="arrow" /></a>
        </div>
      </div>
      <div className="hero-controls">
        <button className="hero-previous" type="button" onClick={goToPrevious} aria-label="اسلاید قبلی"><Icon name="arrow" /></button>
        <div className="hero-progress" aria-label={`اسلاید ${active + 1} از ${total}`}>
          {landmarkSlides.map((slide, index) => <button key={slide.src} className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-label={`نمایش ${slide.title}`}><i /></button>)}
        </div>
        <button className="hero-next" type="button" onClick={goToNext} aria-label="اسلاید بعدی"><Icon name="chevron" /></button>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "پخش خودکار" : "توقف پخش خودکار"} aria-pressed={paused}><Icon name={paused ? "play" : "pause"} /></button>
      </div>
    </div>
    <div className="hero-index"><b>{String(active + 1).padStart(2, "0")}</b><span>/ {String(total).padStart(2, "0")}</span></div>
  </section>;
}

