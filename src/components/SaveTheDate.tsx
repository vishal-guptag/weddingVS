import { CalendarPlus, MessageCircle } from 'lucide-react';
import { downloadIcs } from '../lib/calendar';
import { shareWhatsappUrl } from '../lib/links';
import { useMagnetic } from '../lib/hooks';

export default function SaveTheDate() {
  const calRef = useMagnetic<HTMLButtonElement>();
  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  return (
    <div className="savedate">
      <button ref={calRef} type="button" className="btn btn--maroon" onClick={downloadIcs}>
        <CalendarPlus size={18} aria-hidden="true" /> Add to calendar
      </button>
      <a
        className="btn btn--frame"
        href={shareWhatsappUrl(pageUrl)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={18} aria-hidden="true" /> Share on WhatsApp
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
