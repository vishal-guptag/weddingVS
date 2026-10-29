import { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';

/** Place your own legally usable file at public/music/wedding-instrumental.mp3 (see README). */
export const MUSIC_SRC = '/music/wedding-instrumental.mp3';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [missing, setMissing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = muted;
  }, [volume, muted]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    setExpanded(true);
    if (playing) {
      a.pause();
      setPlaying(false);
      return;
    }
    try {
      // Playback only ever starts from this click (visitor interaction).
      await a.play();
      setPlaying(true);
      setMissing(false);
    } catch {
      setPlaying(false);
      setMissing(true);
    }
  };

  return (
    <div className={`music ${expanded ? 'is-expanded' : ''} ${playing ? 'is-playing' : ''}`}>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="none"
        onError={() => {
          setMissing(true);
          setPlaying(false);
        }}
        onEnded={() => setPlaying(false)}
      />

      {expanded && (
        <div className="music__panel">
          <button
            type="button"
            className="music__mute"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
          <label className="music__vol">
            <span className="visually-hidden">Music volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (muted && Number(e.target.value) > 0) setMuted(false);
              }}
            />
          </label>
        </div>
      )}

      <div className="music__row">
        {!expanded && !playing && (
          <span className="music__hint" aria-hidden="true">
            Play our music
          </span>
        )}
        <button
          type="button"
          className="music__toggle"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          <span className="music__ring" aria-hidden="true" />
          {playing ? <Pause size={20} aria-hidden="true" /> : expanded ? <Play size={20} aria-hidden="true" /> : <Music size={20} aria-hidden="true" />}
        </button>
      </div>

      <p className="music__note" role="status" aria-live="polite">
        {missing ? 'Music is not available right now. The invitation works fine without it.' : ''}
      </p>
    </div>
  );
}
