import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Monogram from './Monogram';
import Particles from './Particles';
import Petals from './Petals';
import { COUPLE, TAGLINE, WEDDING_DATE_SHORT } from '../data/wedding';
import { scrollToSection } from './Nav';

export default function Hero({ active }: { active: boolean }) {
  const layerBack = useRef<HTMLDivElement>(null);
  const layerMid = useRef<HTMLDivElement>(null);

  // Gentle parallax; skipped for reduced motion.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.2);
      if (layerBack.current) layerBack.current.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
      if (layerMid.current) layerMid.current.style.transform = `translate3d(0, ${(y * 0.32).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="home" className={`hero section--dark ${active ? 'is-active' : ''}`} aria-labelledby="hero-title">
      <div ref={layerBack} className="hero__layer hero__layer--back" aria-hidden="true">
        <div className="hero__arch hero__arch--outer" />
        <div className="hero__arch hero__arch--inner" />
      </div>
      <div ref={layerMid} className="hero__layer hero__layer--mid" aria-hidden="true">
        <div className="hero__rays" />
        <Particles count={22} variant="gold" seed={11} />
        <Petals count={14} seed={2} />
      </div>

      <div className="hero__content">
        <div className="hero__monogram">
          <Monogram size={150} title="V & S monogram" />
        </div>
        <p className="eyebrow">The wedding celebration of</p>
        <h1 id="hero-title" className="hero__names">
          <span className="script hero__name hero__name--1">{COUPLE.bride}</span>
          <span className="script hero__amp" aria-hidden="true">
            &amp;
          </span>
          <span className="visually-hidden"> and </span>
          <span className="script hero__name hero__name--2">{COUPLE.groom}</span>
        </h1>
        <div className="divider" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <p className="hero__date">{WEDDING_DATE_SHORT}</p>
        <p className="hero__tagline">“{TAGLINE}”</p>
      </div>

      <button type="button" className="hero__scroll" onClick={() => scrollToSection('countdown')} aria-label="Scroll down to the countdown">
        <ChevronDown size={26} aria-hidden="true" />
      </button>
    </section>
  );
}
