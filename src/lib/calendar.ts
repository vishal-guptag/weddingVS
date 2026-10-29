import { VENUE } from '../data/wedding';

const CRLF = '\r\n';

/** RFC 5545 text escaping. */
export function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Fold long lines at 75 octets (approximated by characters; our text is ASCII except the dash). */
function fold(line: string): string {
  if (line.length <= 73) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 73));
  rest = rest.slice(73);
  while (rest.length > 72) {
    parts.push(' ' + rest.slice(0, 72));
    rest = rest.slice(72);
  }
  if (rest) parts.push(' ' + rest);
  return parts.join(CRLF);
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/**
 * Calendar file for the three printed events. Only printed times are used:
 * Welcome of Barat 7:00 PM IST, Dinner 8:00 PM IST (both UTC+05:30), and Doli as an all-day
 * entry on Sunday because no time was given. No end times are invented.
 */
export function buildIcs(now: Date = new Date()): string {
  const location = escapeIcs(`${VENUE.name}, ${VENUE.address}`);
  const events = [
    { uid: 'barat', summary: 'Welcome of Barat: Vishal & Shruti Wedding', start: 'DTSTART:20261212T133000Z' },
    { uid: 'dinner', summary: 'Dinner: Vishal & Shruti Wedding', start: 'DTSTART:20261212T143000Z' },
    {
      uid: 'doli',
      summary: 'Doli, Taron Ki Chhaon Mein: Vishal & Shruti Wedding',
      start: 'DTSTART;VALUE=DATE:20261213',
      end: 'DTEND;VALUE=DATE:20261214',
    },
  ];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vishal and Shruti Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}-20261212@vishal-shruti-wedding`,
      `DTSTAMP:${stamp(now)}`,
      e.start,
      ...(e.end ? [e.end] : []),
      `SUMMARY:${escapeIcs(e.summary)}`,
      `LOCATION:${location}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join(CRLF) + CRLF;
}

/** Triggers a download of the .ics file in the browser. */
export function downloadIcs(): void {
  const blob = new Blob([buildIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Vishal-and-Shruti-Wedding.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
