import { useCallback, useEffect, useState } from 'react';
import Intro from './components/Intro';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Invitation from './components/Invitation';
import LoveBand from './components/LoveBand';
import Journey from './components/Journey';
import Events from './components/Events';
import Venue from './components/Venue';
import Family from './components/Family';
import Guestbook from './components/Guestbook';
import Closing from './components/Closing';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  // Lock page scroll only while the intro overlay is on screen.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', !introDone);
    return () => document.body.classList.remove('no-scroll');
  }, [introDone]);

  // Honour a deep link (#venue etc.) after the intro closes.
  useEffect(() => {
    if (!introDone) return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [introDone]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!introDone && <Intro onDone={finishIntro} />}
      <Nav />
      <main id="main">
        <Hero active={introDone} />
        <Countdown />
        <Invitation />
        <LoveBand />
        <Journey />
        <Events />
        <Venue />
        <Family />
        <Guestbook />
        <Closing />
      </main>
      <Footer />
      <MusicPlayer />
    </>
  );
}
