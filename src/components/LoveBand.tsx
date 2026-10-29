import { Heart } from 'lucide-react';
import Petals from './Petals';
import Reveal from './Reveal';

/** A quiet, romantic interlude between the invitation and the story. Decorative copy only. */
export default function LoveBand() {
  return (
    <section className="loveband section--dark" aria-label="A note of love">
      <Petals count={9} seed={17} />
      <Reveal className="loveband__inner">
        <Heart className="loveband__heart" size={26} fill="currentColor" aria-hidden="true" />
        <p className="script loveband__quote">Love is the beginning of every beautiful story</p>
        <p className="loveband__sub">Come, celebrate ours with us</p>
      </Reveal>
    </section>
  );
}
