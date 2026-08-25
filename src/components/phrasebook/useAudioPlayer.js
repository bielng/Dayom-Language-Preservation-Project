import { useCallback, useRef, useState } from "react";

export function useAudioPlayer() {
  const audioRef = useRef(null);
  const [playingPath, setPlayingPath] = useState(null);
  const [missingPath, setMissingPath] = useState(null);

  const play = useCallback((path) => {
    if (!path) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(`/${path}`);
    audioRef.current = audio;
    setMissingPath(null);
    setPlayingPath(path);
    audio.play().catch(() => {
      setPlayingPath(null);
      setMissingPath(path);
    });
    audio.onended = () => setPlayingPath(null);
    audio.onerror = () => {
      setPlayingPath(null);
      setMissingPath(path);
    };
  }, []);

  return { play, playingPath, missingPath };
}
