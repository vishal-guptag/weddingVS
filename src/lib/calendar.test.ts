import { describe, expect, it } from 'vitest';
import { buildIcs, escapeIcs } from './calendar';
import { shareWhatsappUrl } from './links';

const ics = buildIcs(new Date('2026-10-29T10:00:00Z'));
// Unfold folded lines before inspecting values.
const flat = ics.replace(/\r\n /g, '');

describe('buildIcs', () => {
  it('is a valid CRLF calendar with three events', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(flat.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    expect(flat.match(/END:VEVENT/g)).toHaveLength(3);
  });

  it('uses the printed times only (7:00 PM and 8:00 PM IST = 13:30Z and 14:30Z)', () => {
    expect(flat).toContain('DTSTART:20261212T133000Z');
    expect(flat).toContain('DTSTART:20261212T143000Z');
  });

  it('makes Doli an all-day entry on Sunday 13 Dec with no invented time', () => {
    expect(flat).toContain('DTSTART;VALUE=DATE:20261213');
    expect(flat).toContain('DTEND;VALUE=DATE:20261214');
    expect(flat).not.toMatch(/DTSTART:20261213T/);
  });

  it('includes the venue, comma-escaped', () => {
    expect(flat).toContain('LOCATION:Meraki Hotel & Banquets\\, Delhi Road\\, Beside Radha Govind');
  });

  it('keeps every physical line within 75 characters', () => {
    expect(ics.split('\r\n').every((l) => l.length <= 75)).toBe(true);
  });
});

describe('escapeIcs', () => {
  it('escapes commas, semicolons, backslashes and newlines', () => {
    expect(escapeIcs('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
  });
});

describe('shareWhatsappUrl', () => {
  it('builds a wa.me share link containing the date, venue and page URL', () => {
    const url = shareWhatsappUrl('https://example.com/');
    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('Saturday, 12th December 2026');
    expect(text).toContain('Meraki Hotel & Banquets');
    expect(text).toContain('https://example.com/');
  });
});
