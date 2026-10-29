import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/wedding';
import Monogram from './Monogram';
import { useActiveSection, useScrollProgress } from '../lib/hooks';

const IDS = NAV_LINKS.map((l) => l.id);

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // Move focus for keyboard / screen-reader users without a second scroll jump.
  window.setTimeout(() => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }, reduce ? 0 : 600);
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const progress = useScrollProgress();
  const active = useActiveSection(IDS);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div className="progress__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <header className="nav">
        <nav className={`nav__inner ${open ? 'is-open' : ''}`} aria-label="Main">
          <a href="#home" className="nav__brand" onClick={go('home')} aria-label="Vishal and Shruti, back to top">
            <Monogram size={40} />
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-links"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>

          <ul id="nav-links" className="nav__links">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className={active === l.id ? 'is-active' : ''}
                  aria-current={active === l.id ? 'true' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
