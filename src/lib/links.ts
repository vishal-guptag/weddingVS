import { VENUE } from '../data/wedding';

/** Google Maps directions link built from the venue name and address. */
export function mapsDirectionsUrl(): string {
  const destination = encodeURIComponent(`${VENUE.name}, ${VENUE.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

/** tel: link using the +91 India country code. */
export function telUrl(nationalNumber: string): string {
  return `tel:+91${nationalNumber.replace(/\D/g, '')}`;
}

/** WhatsApp click-to-chat link using the 91 India country code (no plus sign, per wa.me format). */
export function whatsappUrl(nationalNumber: string, text?: string): string {
  const base = `https://wa.me/91${nationalNumber.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** WhatsApp share link with a ready-to-send invitation message. */
export function shareWhatsappUrl(pageUrl: string): string {
  const text = [
    'You are warmly invited to the wedding of Shruti & Vishal \u{1F495}',
    'Saturday, 12th December 2026',
    `${VENUE.name}, Meerut`,
    pageUrl,
  ]
    .filter(Boolean)
    .join('\n');
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
