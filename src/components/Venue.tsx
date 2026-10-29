import { useEffect, useRef, useState } from 'react';
import { Check, Copy, MapPin, Navigation, TriangleAlert } from 'lucide-react';
import Reveal from './Reveal';
import { VENUE } from '../data/wedding';
import { mapsDirectionsUrl } from '../lib/links';
import { useMagnetic } from '../lib/hooks';

type CopyState = 'idle' | 'success' | 'error';

/** Clipboard API with a textarea fallback for older / non-secure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function Venue() {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number>();
  const mapsRef = useMagnetic<HTMLAnchorElement>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(`${VENUE.name}, ${VENUE.address}`);
    setState(ok ? 'success' : 'error');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 3000);
  };

  return (
    <section id="venue" className="section section--ivory venue" aria-labelledby="venue-title">
      <div className="container">
        <Reveal className="venue__stage">
          <div className="venue__arch" aria-hidden="true">
            <span className="venue__light venue__light--1" />
            <span className="venue__light venue__light--2" />
            <span className="venue__light venue__light--3" />
          </div>

          <div className="venue__body">
            <p className="eyebrow eyebrow--maroon">
              <MapPin size={14} aria-hidden="true" /> The venue
            </p>
            <h2 id="venue-title" className="display venue__name">
              {VENUE.name}
            </h2>
            <address className="venue__address">
              {VENUE.addressLines.map((line, i) => (
                <span key={line} className="venue__line" style={{ animationDelay: `${0.5 + i * 0.28}s` }}>
                  {line}
                </span>
              ))}
            </address>

            <div className="venue__actions">
              <a
                ref={mapsRef}
                className="btn btn--frame"
                href={mapsDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={18} aria-hidden="true" /> Open in Google Maps
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
              <button type="button" className="btn btn--ghost" onClick={onCopy}>
                {state === 'success' ? (
                  <Check size={18} aria-hidden="true" />
                ) : state === 'error' ? (
                  <TriangleAlert size={18} aria-hidden="true" />
                ) : (
                  <Copy size={18} aria-hidden="true" />
                )}
                Copy venue address
              </button>
            </div>
            <p className={`venue__status venue__status--${state}`} role="status" aria-live="polite">
              {state === 'success' && 'Address copied to clipboard.'}
              {state === 'error' && 'Could not copy automatically. Please select and copy the address above.'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
