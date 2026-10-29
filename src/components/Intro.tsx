import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Monogram from './Monogram';
import Particles from './Particles';
import HeartBurst from './HeartBurst';
import { COUPLE, WEDDING_DATE_LONG } from '../data/wedding';
import { useMagnetic } from '../lib/hooks';

interface Props {
  onDone: () => void;
}

export default function Intro({ onDone }: Props) {
  const [leaving, setLeaving] = useState(false);
  const [burst, setBurst] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const openRef = useMagnetic<HTMLButtonElement>();

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  const open = () => {
    setBurst(true);
    setLeaving(true);
    window.setTimeout(onDone, 1700);
  };

  return (
    <div
      className={`intro ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation introduction"
    >
      <Particles count={26} variant="gold" seed={3} className="intro__particles" />
      <div className="intro__arch" aria-hidden="true" />
      <div className="intro__rays" aria-hidden="true" />

      <button ref={skipRef} type="button" className="intro__skip" onClick={onDone}>
        Skip intro
      </button>

      <div className="intro__content">
        <p className="intro__kicker">With joy in our hearts</p>
        <div className="intro__monogram">
          <Monogram size={168} title="V & S monogram" />
        </div>
        <h1 className="intro__names script">{COUPLE.names}</h1>
        <p className="intro__sub">Our Wedding Celebration</p>
        <p className="intro__date">{WEDDING_DATE_LONG}</p>
        <div className="intro__cta">
          <button ref={openRef} type="button" className="btn btn--gold intro__open" onClick={open}>
            Open Our Invitation <ArrowRight size={18} aria-hidden="true" />
          </button>
          {burst && <HeartBurst count={18} />}
        </div>
      </div>
    </div>
  );
}
