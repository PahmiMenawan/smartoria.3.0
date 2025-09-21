import { useContext, useEffect, useRef } from "react";
import { VolumeContext } from "./VolumeContext";

export default function BackgroundMusic() {
  const { bgmVolume } = useContext(VolumeContext);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = bgmVolume / 100;
      audio.play().catch(() => {}); // prevent autoplay errors
    }
  }, [bgmVolume]);

  return (
    <audio
      ref={audioRef}
      src="/audio/background.webm"
      autoPlay
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
}