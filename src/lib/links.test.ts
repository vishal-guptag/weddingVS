import { describe, expect, it } from 'vitest';
import { mapsDirectionsUrl, telUrl, whatsappUrl } from './links';
import { VENUE } from '../data/wedding';

describe('links', () => {
  it('builds a Google Maps directions URL from venue name and address', () => {
    const url = new URL(mapsDirectionsUrl());
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('destination')).toBe(`${VENUE.name}, ${VENUE.address}`);
  });

  it('uses the +91 country code for tel links', () => {
    expect(telUrl('8439226496')).toBe('tel:+918439226496');
    expect(telUrl('8218386431')).toBe('tel:+918218386431');
  });

  it('uses the 91 country code for WhatsApp links', () => {
    expect(whatsappUrl('8439226496')).toBe('https://wa.me/918439226496');
    expect(whatsappUrl('8218386431', 'Hello & welcome')).toBe('https://wa.me/918218386431?text=Hello%20%26%20welcome');
  });
});
