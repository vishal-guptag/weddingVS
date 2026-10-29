import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Heart, Info } from 'lucide-react';
import Reveal from './Reveal';
import HeartBurst from './HeartBurst';
import {
  MESSAGE_MAX,
  NAME_MAX,
  loadEntries,
  makeEntry,
  saveEntries,
  validateEntry,
  type GuestEntry,
} from '../lib/guestbook';

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; text: string };

/** Sends one blessing to Netlify Forms (collected in the Netlify dashboard). Resolves false on any failure. */
async function sendToNetlify(name: string, message: string, botField: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ 'form-name': 'guestbook', name, message, 'bot-field': botField });
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const fmt = (t: number) =>
  new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestEntry[]>(() => loadEntries());
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [sending, setSending] = useState(false);
  const [bot, setBot] = useState('');
  const timer = useRef<number>();
  const nameRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const v = validateEntry(name, message);
    setErrors(v.errors);
    if (!v.ok) {
      setStatus({ kind: 'error', text: 'Please fix the highlighted fields.' });
      (v.errors.name ? nameRef : msgRef).current?.focus();
      return;
    }
    setSending(true);
    const delivered = await sendToNetlify(v.name, v.message, bot);
    setSending(false);

    // Always keep a copy on this device so the visitor can see what they wrote.
    const next = [makeEntry(v.name, v.message), ...entries];
    saveEntries(next);
    setEntries(next);
    setName('');
    setMessage('');
    setStatus(
      delivered
        ? { kind: 'success' }
        : {
            kind: 'error',
            text: 'We could not send your blessing right now, but it is saved on this device. Please check your connection and try again.',
          },
    );
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus({ kind: 'idle' }), 7000);
  };

  return (
    <section id="blessings" className="section section--cream blessings" aria-labelledby="blessings-title">
      <div className="container container--narrow">
        <Reveal className="center">
          <p className="eyebrow eyebrow--maroon">Guestbook</p>
          <h2 id="blessings-title" className="display">
            Leave Your Blessings
          </h2>
        </Reveal>

        <Reveal as="p" className="blessings__notice" delay={100}>
          <Info size={18} aria-hidden="true" />
          <span>
            Your blessing is sent privately to the family. A copy is also kept on this device so you can see it here; other
            visitors cannot see it.
          </span>
        </Reveal>

        <Reveal delay={150}>
        {/* noValidate: we show our own accessible messages */}
        <form className="gform" name="guestbook" onSubmit={onSubmit} noValidate aria-label="Guestbook form">
          {/* spam trap: hidden from people, bots tend to fill it */}
          <p className="visually-hidden" aria-hidden="true">
            <label>
              Do not fill this in
              <input name="bot-field" tabIndex={-1} autoComplete="off" value={bot} onChange={(e) => setBot(e.target.value)} />
            </label>
          </p>
          <div className="field">
            <label htmlFor="gb-name">Your name</label>
            <input
              id="gb-name"
              ref={nameRef}
              type="text"
              value={name}
              maxLength={NAME_MAX + 20}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'gb-name-err' : 'gb-name-count'}
            />
            <div className="field__meta">
              <span id="gb-name-err" className="field__error" role={errors.name ? 'alert' : undefined}>
                {errors.name}
              </span>
              <span id="gb-name-count" className={name.length > NAME_MAX ? 'over' : ''}>
                {name.length}/{NAME_MAX}
              </span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="gb-msg">Your blessing</label>
            <textarea
              id="gb-msg"
              ref={msgRef}
              rows={4}
              value={message}
              maxLength={MESSAGE_MAX + 40}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'gb-msg-err' : 'gb-msg-count'}
            />
            <div className="field__meta">
              <span id="gb-msg-err" className="field__error" role={errors.message ? 'alert' : undefined}>
                {errors.message}
              </span>
              <span id="gb-msg-count" className={message.length > MESSAGE_MAX ? 'over' : ''}>
                {message.length}/{MESSAGE_MAX}
              </span>
            </div>
          </div>

          <div className="gform__actions">
            <button type="submit" className="btn btn--maroon" disabled={sending} aria-busy={sending}>
              <Heart size={18} aria-hidden="true" /> {sending ? 'Sending…' : 'Send blessing'}
            </button>
            {status.kind === 'success' && <HeartBurst count={12} />}
          </div>

          <p
            className={`gform__status gform__status--${status.kind}`}
            role={status.kind === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {status.kind === 'success' && (
              <>
                <Heart size={16} fill="currentColor" aria-hidden="true" /> Thank you! Your blessing has been sent to the family.
              </>
            )}
            {status.kind === 'error' && status.text}
          </p>
        </form>
        </Reveal>

        <div className="gwall" aria-live="polite">
          {entries.length === 0 ? (
            <div className="gwall__empty">
              <Heart size={26} aria-hidden="true" />
              <p>No blessings yet. Be the first to write one.</p>
            </div>
          ) : (
            <ul>
              {entries.map((en) => (
                <li key={en.id} className="gcard">
                  {/* React escapes text; no HTML is ever injected */}
                  <p className="gcard__msg">{en.message}</p>
                  <p className="gcard__by">
                    — {en.name} <time dateTime={new Date(en.createdAt).toISOString()}>{fmt(en.createdAt)}</time>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
