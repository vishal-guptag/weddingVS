# Vishal & Shruti — Wedding Website

A single-page, cinematic Indian wedding invitation site built with **React + Vite + TypeScript** and plain CSS.
Ready to deploy on **Netlify**.

**Wedding:** Saturday, 12th December 2026 · Meraki Hotel & Banquets, Partapur, Meerut

---

## Quick start

Requires Node.js 18 or newer (Node 20+ recommended).

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build into ./dist
npm run preview    # serve the production build locally
```

Quality checks:

```bash
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Vitest (countdown, guestbook, links, content audit, interactions)
```

## What is on the page

| Section | Notes |
| --- | --- |
| Opening screen | Animated palace arch, V & S monogram, names, date. **Skip intro** and **Open Our Invitation** buttons. |
| Hero | Parallax palace arches, floating gold particles, name reveal, tagline. |
| Countdown | Live countdown to **12 Dec 2026, 7:00 PM IST** (Welcome of Barat). Celebration state afterwards; never negative. |
| Invitation | Ganesh invocation and the full invitation text, with a staged reveal. |
| Our wedding journey | Decorative headings only. No invented memories or dates. |
| Wedding events | Welcome of Barat (7:00 PM), Dinner (8:00 PM), Doli — Taron Ki Chhaon Mein (Sunday, **no time given**). Each has its own animated backdrop. |
| Venue | Open in Google Maps + Copy venue address (with success/failure feedback). |
| Family & R.S.V.P. | R.S.V.P., Welcoming You, Invitation sender, with click-to-call and WhatsApp (+91) links. |
| Blessings (guestbook) | Sends blessings to you through Netlify Forms (see below). |
| Closing + footer | Animated closing with the monogram. |
| Music | Optional soundtrack with play/pause, mute and volume. A small "Play our music" hint helps guests find it. |
| Save the date | **Add to calendar** downloads a `.ics` file (Barat 7:00 PM, Dinner 8:00 PM, Doli as an all-day Sunday entry, since no Doli time is printed). **Share on WhatsApp** sends a ready-made invitation message with the site link. |
| Romantic touches | Falling rose petals, heart-shaped dividers, a heart burst when the invitation opens and when a blessing is sent, a love-quote interlude, and a softly beating crest. All are switched off for visitors who prefer reduced motion. |

There is intentionally **no photo gallery**, carousel, lightbox or photo upload.

## Editing the wedding details

Every name, date, time, address and phone number lives in one file: **`src/data/wedding.ts`**.
Edit it there and the whole site updates. The countdown target is `COUNTDOWN_TARGET_ISO`
(`2026-12-12T19:00:00+05:30`). Because it carries an explicit IST offset, every visitor sees the same
countdown no matter which timezone their device is in.

> The Doli event deliberately has `time: null`. Add a time only when the family confirms one.

## Adding background music (optional)

The site does not bundle any music, because most popular tracks are copyrighted.

1. Choose music you are allowed to use, for example your own recording, a track you have purchased a licence for,
   or royalty-free / Creative Commons music (check the licence terms and give credit if required).
2. Save it as **`public/music/wedding-instrumental.mp3`**.
3. Rebuild/redeploy. The music button will now play it.

Behaviour:

- Audio **never autoplays**. It starts only when a visitor presses the music button.
- If the file is missing or the browser blocks playback, the site shows a short, polite message and keeps working.
- To use a different file name, change `MUSIC_SRC` in `src/components/MusicPlayer.tsx`.

## Guestbook: receiving the messages (Netlify Forms)

Every blessing a guest sends is posted to **Netlify Forms** (form name: `guestbook`) and also kept in that guest's own
browser so they can see what they wrote. Other visitors never see it.

To read the messages and get them by email:

1. Deploy the site to Netlify (Git import, drag-and-drop of `dist`, or CLI all work).
2. In Netlify open your site → **Forms**. The `guestbook` form appears after the first deploy.
   If it does not, open **Site configuration → Forms** and make sure form detection is enabled, then redeploy.
3. Read messages under **Forms → guestbook → Verified submissions**.
4. For emails: **Forms → Form notifications → Add notification → Email notification**, choose `guestbook`, enter your email.

Notes:

- Forms only work on the deployed Netlify site. On `npm run dev` the post fails and the page shows a polite message.
- Netlify's free plan includes a monthly submission limit (check your plan). Spam is filtered by a hidden honeypot field plus Netlify's spam filter.
- Names and messages are validated (name <= 40 characters, blessing 3-280) and shown as plain text, so HTML cannot run.

## Fonts

Fonts (Great Vibes for calligraphy, Cormorant Garamond for text, Tiro Devanagari Hindi for the Hindi invocation) are
**self-hosted** through the `@fontsource` npm packages and bundled into the build. There are no calls to Google Fonts,
so the site loads the same way on slow or restricted networks. System script/serif fonts are the fallback.

## Accessibility and motion

- Semantic landmarks, labelled controls, skip link, visible focus rings, keyboard-friendly navigation.
- `prefers-reduced-motion` turns off animations and shows all content immediately.
- Animations are CSS-only and use `transform`/`opacity` for smooth performance on phones.

## Upload to GitHub

```bash
cd vishal-shruti-wedding
git init
git add .
git commit -m "Wedding website for Vishal & Shruti"
git branch -M main
# create an empty repository on github.com first, then:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`node_modules` and `dist` are ignored by `.gitignore`.

## Deploy to Netlify

**Option A: from GitHub (recommended, auto-updates on every push)**

1. Log in at <https://app.netlify.com> → **Add new site → Import an existing project**.
2. Choose GitHub and select your repository.
3. Netlify reads `netlify.toml`, so these should already be filled in: build command `npm run build`,
   publish directory `dist`.
4. Click **Deploy site**. When finished you get a `*.netlify.app` URL. Rename it under
   **Site configuration → Change site name**, or attach a custom domain under **Domain management**.

**Option B: drag and drop**

1. Run `npm install && npm run build` locally.
2. In Netlify, open **Sites** and drag the generated **`dist`** folder onto the page.

**Option C: Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --build --prod
```

`netlify.toml` also includes single-page-app routing (all paths serve `index.html`) and long-term caching for
hashed assets.

## Project structure

```
src/
  data/wedding.ts        all wedding details (single source of truth)
  lib/                   countdown, guestbook, links, hooks (+ unit tests)
  components/            Intro, Nav, Hero, Countdown, Invitation, Journey, Events,
                         Venue, Family, Guestbook, MusicPlayer, Closing, Footer, Monogram
  styles.css             design system and animations
  App.test.tsx           content audit + interaction tests
public/
  favicon.svg            V & S favicon (same crest as the site logo)
  music/                 put wedding-instrumental.mp3 here (optional)
netlify.toml
```
