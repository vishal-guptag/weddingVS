import Monogram from './Monogram';
import Particles from './Particles';
import Petals from './Petals';
import Reveal from './Reveal';
import { COUPLE, VENUE, WEDDING_DATE_LONG } from '../data/wedding';

export default function Closing() {
  return (
    <section id="closing" className="closing section--dark" aria-labelledby="closing-title">
      <Petals count={12} seed={9} className="closing__petals" />
      <div className="closing__glow" aria-hidden="true" />
      <Reveal className="closing__frame">
        <div className="closing__orbit" aria-hidden="true">
          <Particles count={20} variant="gold" seed={61} />
        </div>
        <h2 id="closing-title" className="script closing__names">
          {COUPLE.names}
        </h2>
        <div className="divider" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <p className="closing__date">{WEDDING_DATE_LONG}</p>
        <p className="closing__venue">{VENUE.name}</p>
        <p className="script closing__forever">Forever begins with your blessings</p>
        <div className="closing__monogram">
          <Monogram size={132} title="V & S monogram" />
        </div>
      </Reveal>
    </section>
  );
}
