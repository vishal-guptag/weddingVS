import { useMemo, type CSSProperties } from 'react';

/** A short burst of little hearts. Mount it to play it; it fades out by itself. */
export default function HeartBurst({ count = 14 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const dist = 60 + Math.random() * 90;
        return {
          key: i,
          style: {
            '--dx': `${(Math.cos(angle) * dist).toFixed(0)}px`,
            '--dy': `${(Math.sin(angle) * dist * 0.8 - 50).toFixed(0)}px`,
            '--hs': `${(12 + Math.random() * 14).toFixed(0)}px`,
            '--hr': `${(-30 + Math.random() * 60).toFixed(0)}deg`,
            animationDelay: `${(Math.random() * 0.25).toFixed(2)}s`,
          } as CSSProperties,
        };
      }),
    [count],
  );
  return (
    <span className="burst" aria-hidden="true">
      {hearts.map((h) => (
        <i key={h.key} style={h.style} />
      ))}
    </span>
  );
}
