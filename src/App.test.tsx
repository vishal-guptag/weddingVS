import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import Countdown from './components/Countdown';
import { COUNTDOWN_TARGET_ISO, EVENTS, INVOCATION } from './data/wedding';
import { STORAGE_KEY } from './lib/guestbook';

const target = new Date(COUNTDOWN_TARGET_ISO).getTime();

async function openSite() {
  const utils = render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /skip intro/i }));
  return utils;
}

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('opening screen', () => {
  it('shows the required intro text, Open and Skip buttons', () => {
    render(<App />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Vishal & Shruti')).toBeInTheDocument();
    expect(within(dialog).getByText('Our Wedding Celebration')).toBeInTheDocument();
    expect(within(dialog).getByText('Saturday, 12th December 2026')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /open our invitation/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /skip intro/i })).toBeInTheDocument();
  });

  it('Skip intro removes the overlay immediately', async () => {
    await openSite();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Open Our Invitation removes the overlay after its transition', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /open our invitation/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 4000 });
  });
});

describe('content audit (exact wedding details)', () => {
  it('contains every supplied detail', async () => {
    await openSite();
    const text = document.body.textContent ?? '';

    // invocation
    expect(text).toContain(INVOCATION.title);
    expect(text).toContain('विघ्न हरण मंगल करण, श्री गणपति महाराज।');
    expect(text).toContain('प्रथम निमंत्रण आपको, पूर्ण करियो काज॥');

    // hosts + invitation
    expect(text).toContain('Mrs. Usha Rani & Mr. Mahendra Kumar Bansal');
    expect(text).toContain(
      'cordially solicit your blessings and gracious presence on the occasion of the Wedding Ceremony of their beloved grand daughter',
    );
    expect(text).toContain('(D/o Mrs. Pinky Bansal & Mr. Sanjay Kumar Bansal)');
    expect(text).toContain('(S/o Mrs. Mamta Gupta & Mr. Surendra Kumar Gupta)');
    expect(text).toContain('R/o Meerut');
    expect(text).toContain('weds');

    // events
    expect(text).toContain('Welcome of Barat');
    expect(text).toContain('7:00 PM');
    expect(text).toContain('Dinner');
    expect(text).toContain('8:00 PM');
    expect(text).toContain('Doli — Taron Ki Chhaon Mein');
    expect(text).toContain('Sunday, 13th December 2026');

    // venue
    expect(text).toContain('Meraki Hotel & Banquets');
    for (const line of ['Delhi Road,', 'Beside Radha Govind Maruti Car Showroom,', 'Opposite Metro Pillar No. 1550,', 'Partapur, Meerut']) {
      expect(text).toContain(line);
    }

    // RSVP + welcoming + sender
    for (const n of ['Ram Avtar Bansal', 'Anil Kumar Bansal', 'Raju Bansal', 'Bhanu Bansal']) expect(text).toContain(n);
    for (const n of ['Ritik Bansal', 'Abhay Bansal', 'All Bansal Family', 'Relatives & Friends']) expect(text).toContain(n);
    expect(text).toContain('Sanjay Kumar Bansal');
    expect(text).toContain('380/5, Jagriti Vihar,');
    expect(text).toContain('Near S.B.I. Bank, Meerut.');
    expect(text).toContain('Mob. : 8439226496, 8218386431');

    // hero + tagline
    expect(text).toContain('12 December 2026');
    expect(text).toContain('Two hearts, one beautiful journey, a lifetime of togetherness.');
  });

  it('shows the four storytelling headings', async () => {
    await openSite();
    for (const h of ['Our Story', 'A Beautiful Beginning', 'Two Families, One Celebration', 'A Lifetime of Togetherness']) {
      expect(screen.getByRole('heading', { name: h })).toBeInTheDocument();
    }
  });

  it('never gives the Doli event a time and lists exactly three events', () => {
    expect(EVENTS).toHaveLength(3);
    expect(EVENTS.find((e) => e.id === 'doli')?.time).toBeNull();
    expect(EVENTS.map((e) => e.time)).toEqual(['7:00 PM', '8:00 PM', null]);
  });

  it('has no gallery, carousel, lightbox, album or photo-upload UI', async () => {
    const { container } = await openSite();
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    const text = (document.body.textContent ?? '').toLowerCase();
    for (const w of ['gallery', 'carousel', 'lightbox', 'album', 'upload photo']) expect(text).not.toContain(w);
  });
});

describe('navigation', () => {
  it('has links to Home, Invitation, Events, Venue, Family and Blessings that match real section ids', async () => {
    await openSite();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const [label, id] of [
      ['Home', 'home'],
      ['Invitation', 'invitation'],
      ['Events', 'events'],
      ['Venue', 'venue'],
      ['Family', 'family'],
      ['Blessings', 'blessings'],
    ]) {
      const link = within(nav).getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', `#${id}`);
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it('toggles the mobile menu and exposes aria-expanded', async () => {
    await openSite();
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('venue actions', () => {
  it('Open in Google Maps is a working external link', async () => {
    await openSite();
    const a = screen.getByRole('link', { name: /open in google maps/i });
    const url = new URL(a.getAttribute('href')!);
    expect(url.hostname).toBe('www.google.com');
    expect(url.searchParams.get('destination')).toContain('Meraki Hotel & Banquets');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
  });

  it('Copy venue address shows a success state', async () => {
    await openSite();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await userEvent.click(screen.getByRole('button', { name: /copy venue address/i }));
    await waitFor(() => expect(screen.getByText(/address copied/i)).toBeInTheDocument());
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Partapur, Meerut'));
  });

  it('Copy venue address shows a failure state when copying is impossible', async () => {
    await openSite();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    });
    (document as unknown as { execCommand: () => boolean }).execCommand = () => false;
    await userEvent.click(screen.getByRole('button', { name: /copy venue address/i }));
    await waitFor(() => expect(screen.getByText(/could not copy/i)).toBeInTheDocument());
  });
});

describe('contact links', () => {
  it('provides +91 tel and WhatsApp links while displaying numbers as printed', async () => {
    await openSite();
    for (const n of ['8439226496', '8218386431']) {
      expect(screen.getByRole('link', { name: `Call ${n}` })).toHaveAttribute('href', `tel:+91${n}`);
      expect(screen.getByRole('link', { name: new RegExp(`WhatsApp ${n}`) })).toHaveAttribute('href', `https://wa.me/91${n}`);
    }
  });
});

describe('romance + save-the-date', () => {
  it('offers Add to calendar and a WhatsApp share link', async () => {
    await openSite();
    expect(screen.getByRole('button', { name: /add to calendar/i })).toBeInTheDocument();
    const share = screen.getByRole('link', { name: /share on whatsapp/i });
    expect(share.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(share).toHaveAttribute('target', '_blank');
  });

  it('shows the love interlude and closing line', async () => {
    await openSite();
    expect(screen.getByText(/love is the beginning of every beautiful story/i)).toBeInTheDocument();
    expect(screen.getByText(/forever begins with your blessings/i)).toBeInTheDocument();
  });

  it('plays a heart burst when the invitation is opened', async () => {
    const { container } = render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /open our invitation/i }));
    expect(container.querySelectorAll('.burst i').length).toBeGreaterThan(5);
  });
});

describe('countdown component', () => {
  it('renders four units from an injected clock', () => {
    const now = target - ((12 * 24 + 5) * 3600 + 9 * 60 + 3) * 1000;
    render(<Countdown getNow={() => now} />);
    const timer = screen.getByRole('timer');
    expect(within(timer).getByText('12 days')).toBeInTheDocument();
    expect(within(timer).getByText('5 hours')).toBeInTheDocument();
    expect(within(timer).getByText('9 minutes')).toBeInTheDocument();
    expect(within(timer).getByText('3 seconds')).toBeInTheDocument();
  });

  it('shows a celebration state and no timer after the target', () => {
    render(<Countdown getNow={() => target + 5000} />);
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    expect(screen.getByText(/the celebration has begun/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/-\d/);
  });
});

describe('guestbook', () => {
  it('says blessings are sent privately to the family and not shown to other visitors', async () => {
    await openSite();
    expect(screen.getByText(/sent privately to the family/i)).toBeInTheDocument();
    expect(screen.getByText(/other\s+visitors cannot see it/i)).toBeInTheDocument();
  });

  it('shows the empty state, then validation errors on an empty submit', async () => {
    await openSite();
    expect(screen.getByText(/no blessings yet/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /send blessing/i }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please write a short blessing.')).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('posts to Netlify Forms, persists a copy, and renders HTML as inert text', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    await openSite();
    await userEvent.type(screen.getByLabelText('Your name'), 'Asha <img src=x>');
    fireEvent.change(screen.getByLabelText('Your blessing'), { target: { value: '<script>alert(1)</script> Many blessings!' } });
    await userEvent.click(screen.getByRole('button', { name: /send blessing/i }));

    expect(await screen.findByText(/blessing has been sent to the family/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/');
    expect(init.method).toBe('POST');
    const sent = new URLSearchParams(init.body as string);
    expect(sent.get('form-name')).toBe('guestbook');
    expect(sent.get('name')).toBe('Asha <img src=x>');
    expect(sent.get('message')).toContain('Many blessings!');
    expect(screen.getByText(/<script>alert\(1\)<\/script> Many blessings!/)).toBeInTheDocument();
    expect(document.querySelector('.gwall script')).toBeNull();
    expect(document.querySelector('.gwall img')).toBeNull();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Asha <img src=x>');
  });

  it('shows an error but keeps a local copy when sending fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await openSite();
    await userEvent.type(screen.getByLabelText('Your name'), 'Ravi');
    await userEvent.type(screen.getByLabelText('Your blessing'), 'Congratulations to you both');
    await userEvent.click(screen.getByRole('button', { name: /send blessing/i }));
    expect(await screen.findByText(/could not send your blessing right now/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(1);
  });

  it('loads previously saved blessings on mount', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'x1', name: 'Ravi', message: 'Congratulations!', createdAt: 1700000000000 }]),
    );
    await openSite();
    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    expect(screen.queryByText(/no blessings yet/i)).not.toBeInTheDocument();
  });
});

describe('music controls', () => {
  it('has play/pause, then mute and volume controls once opened, and handles a missing file gracefully', async () => {
    await openSite();
    const audio = document.querySelector('audio')!;
    expect(audio.getAttribute('preload')).toBe('none');
    expect(audio.hasAttribute('autoplay')).toBe(false);

    // jsdom does not implement media playback; simulate a missing/blocked file.
    audio.play = vi.fn().mockRejectedValue(new Error('NotSupportedError'));
    await userEvent.click(screen.getByRole('button', { name: /play music/i }));
    expect(await screen.findByText(/music is not available right now/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mute music/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Music volume')).toBeInTheDocument();
  });

  it('plays only after the visitor clicks, and toggles pause', async () => {
    await openSite();
    const audio = document.querySelector('audio')!;
    audio.play = vi.fn().mockResolvedValue(undefined);
    audio.pause = vi.fn();
    expect(audio.play).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /play music/i }));
    expect(audio.play).toHaveBeenCalledTimes(1);
    await userEvent.click(await screen.findByRole('button', { name: /pause music/i }));
    expect(audio.pause).toHaveBeenCalled();
  });
});
