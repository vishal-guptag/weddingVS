// Single source of truth for every wedding detail.
// Names, dates, times, relationships, addresses and numbers are preserved exactly as supplied.

export const COUPLE = {
  bride: 'Shruti',
  groom: 'Vishal',
  names: 'Vishal & Shruti',
  monogram: 'V & S',
} as const;

export const FAMILY = {
  brideParents: 'Mrs. Pinky Bansal & Mr. Sanjay Kumar Bansal',
  groomParents: 'Mrs. Mamta Gupta & Mr. Surendra Kumar Gupta',
  hosts: 'Mrs. Usha Rani & Mr. Mahendra Kumar Bansal',
  groomResidence: 'R/o Meerut',
} as const;

export const WEDDING_DATE_LONG = 'Saturday, 12th December 2026';
export const WEDDING_DATE_SHORT = '12 December 2026';

/** Welcome of Barat: 12 Dec 2026, 7:00 PM IST (UTC+05:30, no DST). */
export const COUNTDOWN_TARGET_ISO = '2026-12-12T19:00:00+05:30';
export const COUNTDOWN_TIMEZONE = 'Asia/Kolkata';

export const INVOCATION = {
  title: '॥ श्री गणेशाय नमः ॥',
  lines: ['विघ्न हरण मंगल करण, श्री गणपति महाराज।', 'प्रथम निमंत्रण आपको, पूर्ण करियो काज॥'],
} as const;

export const INVITATION_TEXT =
  'cordially solicit your blessings and gracious presence on the occasion of the Wedding Ceremony of their beloved grand daughter';

export interface WeddingEvent {
  id: 'barat' | 'dinner' | 'doli';
  day: string;
  dateLabel: string;
  title: string;
  time: string | null;
  theme: 'palace' | 'banquet' | 'night';
}

export const EVENTS: WeddingEvent[] = [
  {
    id: 'barat',
    day: 'Saturday',
    dateLabel: 'Saturday, 12th December 2026',
    title: 'Welcome of Barat',
    time: '7:00 PM',
    theme: 'palace',
  },
  {
    id: 'dinner',
    day: 'Saturday',
    dateLabel: 'Saturday, 12th December 2026',
    title: 'Dinner',
    time: '8:00 PM',
    theme: 'banquet',
  },
  {
    id: 'doli',
    day: 'Sunday',
    dateLabel: 'Sunday, 13th December 2026',
    title: 'Doli — Taron Ki Chhaon Mein',
    time: null, // No time supplied. Never invent one.
    theme: 'night',
  },
];

export const VENUE = {
  name: 'Meraki Hotel & Banquets',
  address:
    'Delhi Road, Beside Radha Govind Maruti Car Showroom, Opposite Metro Pillar No. 1550, Partapur, Meerut',
  addressLines: [
    'Delhi Road,',
    'Beside Radha Govind Maruti Car Showroom,',
    'Opposite Metro Pillar No. 1550,',
    'Partapur, Meerut',
  ],
} as const;

export const RSVP = ['Ram Avtar Bansal', 'Anil Kumar Bansal', 'Raju Bansal', 'Bhanu Bansal'] as const;

export const WELCOMING = ['Ritik Bansal', 'Abhay Bansal', 'All Bansal Family', 'Relatives & Friends'] as const;

export const SENDER = {
  name: 'Sanjay Kumar Bansal',
  addressLines: ['380/5, Jagriti Vihar,', 'Near S.B.I. Bank, Meerut.'],
  /** Displayed exactly as printed; `dial` is the national number used to build +91 links. */
  phones: [
    { display: '8439226496', dial: '8439226496' },
    { display: '8218386431', dial: '8218386431' },
  ],
} as const;

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'invitation', label: 'Invitation' },
  { id: 'events', label: 'Events' },
  { id: 'venue', label: 'Venue' },
  { id: 'family', label: 'Family' },
  { id: 'blessings', label: 'Blessings' },
] as const;

export const TAGLINE = 'Two hearts, one beautiful journey, a lifetime of togetherness.';
