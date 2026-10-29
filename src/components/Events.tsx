import { CalendarDays, Clock } from 'lucide-react';
import Particles from './Particles';
import Reveal from './Reveal';
import { EVENTS, type WeddingEvent } from '../data/wedding';

function Backdrop({ theme }: { theme: WeddingEvent['theme'] }) {
  if (theme === 'palace') {
    return (
      <div className="ev__bg ev__bg--palace" aria-hidden="true">
        <span className="ev__spot ev__spot--a" />
        <span className="ev__spot ev__spot--b" />
        <span className="ev__lantern ev__lantern--1" />
        <span className="ev__lantern ev__lantern--2" />
        <span className="ev__lantern ev__lantern--3" />
        <span className="ev__gate" />
        <Particles count={14} variant="gold" seed={31} />
      </div>
    );
  }
  if (theme === 'banquet') {
    return (
      <div className="ev__bg ev__bg--banquet" aria-hidden="true">
        <span className="ev__candle ev__candle--1" />
        <span className="ev__candle ev__candle--2" />
        <Particles count={16} variant="bokeh" seed={41} />
        <span className="ev__shimmer" />
      </div>
    );
  }
  return (
    <div className="ev__bg ev__bg--night" aria-hidden="true">
      <span className="ev__moon" />
      <Particles count={34} variant="stars" seed={51} />
      <Particles count={8} variant="gold" seed={52} />
    </div>
  );
}

function EventCard({ ev, index }: { ev: WeddingEvent; index: number }) {
  const [main, ...rest] = ev.title.split(' — ');
  return (
    <Reveal as="article" className={`ev ev--${ev.theme}`} delay={index * 120}>
      <Backdrop theme={ev.theme} />
      <div className="ev__body">
        <p className="ev__date">
          <CalendarDays size={16} aria-hidden="true" /> {ev.dateLabel}
        </p>
        <h4 className="ev__title">
          {main}
          {rest.length > 0 && <span className="ev__subtitle"> — {rest.join(' — ')}</span>}
        </h4>
        {ev.time && (
          <p className="ev__time">
            <Clock size={18} aria-hidden="true" /> {ev.time}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export default function Events() {
  const saturday = EVENTS.filter((e) => e.day === 'Saturday');
  const sunday = EVENTS.filter((e) => e.day === 'Sunday');

  return (
    <section id="events" className="section section--dark events" aria-labelledby="events-title">
      <div className="container">
        <Reveal className="center">
          <p className="eyebrow">The celebrations</p>
          <h2 id="events-title" className="display display--light">
            Wedding Events
          </h2>
        </Reveal>

        <div className="events__timeline">
          <span className="events__line" aria-hidden="true" />

          <div className="events__day">
            <Reveal as="h3" className="events__day-title">
              <span className="script">Saturday</span>
              <small>12th December 2026</small>
            </Reveal>
            {saturday.map((ev, i) => (
              <EventCard key={ev.id} ev={ev} index={i} />
            ))}
          </div>

          <div className="events__day events__day--next">
            <Reveal as="h3" className="events__day-title">
              <span className="script">Sunday</span>
              <small>13th December 2026</small>
            </Reveal>
            {sunday.map((ev, i) => (
              <EventCard key={ev.id} ev={ev} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
