import { useMemo, type CSSProperties } from 'react';

interface Props {
  count?: number;
  seed?: number;
  className?: string;
}

function rng(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Softly falling rose petals (CSS only: transform + opacity). Hidden for reduced-motion users. */
export default function Petals({ count = 12, seed = 5, className = '' }: Props) {
  const petals = useMemo(() => {
    const r = rng(seed * 31 + count);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      style: {
        left: `${(r() * 100).toFixed(1)}%`,
        '--s': `${(10 + r() * 12).toFixed(1)}px`,
        '--drift': `${(-60 + r() * 120).toFixed(0)}px`,
        '--rot': `${(180 + r() * 360).toFixed(0)}deg`,
        animationDuration: `${(11 + r() * 10).toFixed(1)}s`,
        animationDelay: `${(-r() * 20).toFixed(1)}s`,
      } as CSSProperties,
    }));
  }, [count, seed]);

  return (
    <div className={`petals ${className}`} aria-hidden="true">
      {petals.map((p) => (
        <span key={p.key} style={p.style} />
      ))}
    </div>
  );
}
