import { useMemo, type CSSProperties } from 'react';

interface Props {
  count?: number;
  /** Visual variant: gold motes, warm bokeh circles, or twinkling stars. */
  variant?: 'gold' | 'bokeh' | 'stars';
  seed?: number;
  className?: string;
}

// Small deterministic PRNG so layouts are stable between renders.
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Particles({ count = 18, variant = 'gold', seed = 7, className = '' }: Props) {
  const items = useMemo(() => {
    const rnd = mulberry32(seed + count);
    return Array.from({ length: count }, (_, i) => {
      const size = variant === 'bokeh' ? 14 + rnd() * 38 : variant === 'stars' ? 1.5 + rnd() * 2.2 : 2 + rnd() * 3.5;
      return {
        key: i,
        style: {
          left: `${(rnd() * 100).toFixed(1)}%`,
          top: `${(rnd() * 100).toFixed(1)}%`,
          width: `${size.toFixed(1)}px`,
          height: `${size.toFixed(1)}px`,
          animationDelay: `${(-rnd() * 14).toFixed(1)}s`,
          animationDuration: `${(variant === 'stars' ? 3 + rnd() * 4 : 12 + rnd() * 14).toFixed(1)}s`,
        } as CSSProperties,
      };
    });
  }, [count, seed, variant]);

  return (
    <div className={`particles particles--${variant} ${className}`} aria-hidden="true">
      {items.map((p) => (
        <span key={p.key} style={p.style} />
      ))}
    </div>
  );
}
