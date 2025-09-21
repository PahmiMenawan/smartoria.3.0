import { useContext } from "react";
import { VolumeContext } from "./VolumeContext";

export function useSFX() {
  const { sfxVolume } = useContext(VolumeContext);

  const playSFX = (filename) => {
    const audio = new Audio(`/audio/${filename}`);
    audio.volume = sfxVolume / 100;
    audio.play().catch(() => {});
  };

  return playSFX;
}