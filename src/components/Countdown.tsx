import { useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { COUNTDOWN_TARGET_ISO } from '../data/wedding';
import { getCountdown, pad2 } from '../lib/countdown';
import { useNow } from '../lib/hooks';
import Reveal from './Reveal';
import SaveTheDate from './SaveTheDate';

interface Props {
  /** Injectable clock for tests / previews. */
  getNow?: () => number;
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = label === 'Days' ? String(value) : pad2(value);
  return (
    <div className="count__card">
      {/* key re-mounts the digits on change so the gold flash + roll animation replays */}
      <span key={text} className="count__num" aria-hidden="true">
        {text}
      </span>
      <span className="count__label">{label}</span>
      <span className="visually-hidden">
        {value} {label.toLowerCase()}
      </span>
    </div>
  );
}

export default function Countdown({ getNow }: Props) {
  const clock = useCallback(() => (getNow ? getNow() : Date.now()), [getNow]);
  const now = useNow(1000, clock);
  const c = getCountdown(COUNTDOWN_TARGET_ISO, now);

  return (
    <section id="countdown" className="section section--ivory countdown" aria-labelledby="countdown-title">
      <Reveal className="container center">
        <p className="eyebrow eyebrow--maroon">Counting the moments</p>
        <h2 id="countdown-title" className="display">
          Until the Welcome of Barat
        </h2>
        <p className="countdown__love script">Every heartbeat brings us closer to forever</p>
        <p className="countdown__sub">Saturday, 12th December 2026 · 7:00 PM IST</p>

        {c.done ? (
          <div className="count__done" role="status">
            <Sparkles size={28} aria-hidden="true" />
            <p className="script">The celebration has begun</p>
            <p>Thank you for being part of our joy.</p>
          </div>
        ) : (
          <div className="count__grid" role="timer" aria-label="Time remaining until the Welcome of Barat">
            <Unit value={c.days} label="Days" />
            <Unit value={c.hours} label="Hours" />
            <Unit value={c.minutes} label="Minutes" />
            <Unit value={c.seconds} label="Seconds" />
          </div>
        )}
        <SaveTheDate />
      </Reveal>
    </section>
  );
}
