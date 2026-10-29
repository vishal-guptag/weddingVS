import Monogram from './Monogram';
import Reveal from './Reveal';
import { COUPLE, VENUE, WEDDING_DATE_LONG } from '../data/wedding';

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal className="footer__inner">
        <Monogram size={64} title="V & S monogram" />
        <p className="script footer__names">{COUPLE.names}</p>
        <p>{WEDDING_DATE_LONG}</p>
        <p>{VENUE.name}</p>
      </Reveal>
    </footer>
  );
}
