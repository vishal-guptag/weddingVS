import { Heart } from 'lucide-react';
import Reveal from './Reveal';
import { useReveal } from '../lib/hooks';

// Decorative storytelling headings only. No invented memories, milestones or dates.
const CHAPTERS = [
  { title: 'Our Story', text: 'Every love story is beautiful, and ours is now blessed with the warmth of family and friends.' },
  { title: 'A Beautiful Beginning', text: 'A new chapter begins, filled with hope, laughter and gratitude.' },
  { title: 'Two Families, One Celebration', text: 'Two families come together to celebrate with love, tradition and joy.' },
  { title: 'A Lifetime of Togetherness', text: 'With your blessings, we step into a journey meant to be shared for a lifetime.' },
] as const;

export default function Journey() {
  const [ref, visible] = useReveal<HTMLOListElement>(0.1);
  return (
    <section id="journey" className="section section--cream journey" aria-labelledby="journey-title">
      <div className="container">
        <Reveal className="center">
          <p className="eyebrow eyebrow--maroon">Our wedding journey</p>
          <h2 id="journey-title" className="display">
            With Love &amp; Blessings
          </h2>
        </Reveal>

        <ol ref={ref} className={`journey__list ${visible ? 'is-visible' : ''}`}>
          <span className="journey__line" aria-hidden="true" />
          {CHAPTERS.map((c, i) => (
            <li key={c.title} className={`journey__item ${i % 2 ? 'is-right' : ''}`}>
              <span className="journey__heart" aria-hidden="true">
                <Heart size={14} fill="currentColor" />
              </span>
              <Reveal className="journey__card" delay={i * 120}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
