import Particles from './Particles';
import Reveal from './Reveal';
import { COUPLE, FAMILY, INVITATION_TEXT, INVOCATION } from '../data/wedding';

export default function Invitation() {
  return (
    <section id="invitation" className="section section--ivory invitation" aria-labelledby="invitation-title">
      <Reveal className="container">
        <div className="invite">
          <span className="invite__lantern invite__lantern--l" aria-hidden="true" />
          <span className="invite__lantern invite__lantern--r" aria-hidden="true" />
          <Particles count={12} variant="gold" seed={21} className="invite__particles" />

          <h2 id="invitation-title" className="visually-hidden">
            Wedding invitation
          </h2>

          <div className="invite__invocation">
            <p className="deva invite__ganesh" lang="hi">
              {INVOCATION.title}
            </p>
            <p className="deva invite__verse" lang="hi">
              {INVOCATION.lines[0]}
              <br />
              {INVOCATION.lines[1]}
            </p>
          </div>

          <div className="divider" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <Reveal className="invite__hosts" delay={200}>
            <p className="invite__host-names">{FAMILY.hosts}</p>
            <p className="invite__text">{INVITATION_TEXT}</p>
          </Reveal>

          <Reveal className="invite__person" delay={350}>
            <p className="script invite__name">{COUPLE.bride}</p>
            <p className="invite__parents">(D/o {FAMILY.brideParents})</p>
          </Reveal>

          <Reveal className="invite__weds" delay={500}>
            <span className="script">weds</span>
          </Reveal>

          <Reveal className="invite__person" delay={650}>
            <p className="script invite__name">{COUPLE.groom}</p>
            <p className="invite__parents">(S/o {FAMILY.groomParents})</p>
            <p className="invite__residence">{FAMILY.groomResidence}</p>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
