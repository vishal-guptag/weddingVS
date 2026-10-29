import { MessageCircle, Phone } from 'lucide-react';
import Reveal from './Reveal';
import { RSVP, SENDER, WELCOMING } from '../data/wedding';
import { telUrl, whatsappUrl } from '../lib/links';

export default function Family() {
  return (
    <section id="family" className="section section--dark family" aria-labelledby="family-title">
      <div className="container">
        <Reveal className="center">
          <p className="eyebrow">With love from our family</p>
          <h2 id="family-title" className="display display--light">
            Family &amp; R.S.V.P.
          </h2>
        </Reveal>

        <div className="family__grid">
          <Reveal as="article" className="fcard" delay={0}>
            <h3 className="fcard__title">R.S.V.P.</h3>
            <ul className="fcard__list">
              {RSVP.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="article" className="fcard" delay={140}>
            <h3 className="fcard__title">Welcoming You</h3>
            <ul className="fcard__list">
              {WELCOMING.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="article" className="fcard fcard--sender" delay={280}>
            <h3 className="fcard__title">Invitation sender</h3>
            <p className="fcard__sender">{SENDER.name}</p>
            <address className="fcard__address">
              {SENDER.addressLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="fcard__mob">Mob. : {SENDER.phones.map((p) => p.display).join(', ')}</p>
            <ul className="fcard__contacts">
              {SENDER.phones.map((p) => (
                <li key={p.dial}>
                  <span className="fcard__num">{p.display}</span>
                  <a className="icon-link" href={telUrl(p.dial)} aria-label={`Call ${p.display}`}>
                    <Phone size={18} aria-hidden="true" />
                    <span>Call</span>
                  </a>
                  <a
                    className="icon-link"
                    href={whatsappUrl(p.dial)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${p.display} (opens in a new tab)`}
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
