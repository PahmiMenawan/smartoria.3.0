import { createContext, useState, useEffect } from "react";

export const VolumeContext = createContext();

export function VolumeProvider({ children }) {
  const [bgmVolume, setBgmVolume] = useState(
    () => Number(localStorage.getItem("bgmVolume") || 50)
  );
  const [sfxVolume, setSfxVolume] = useState(
    () => Number(localStorage.getItem("sfxVolume") || 50)
  );

  useEffect(() => {
    localStorage.setItem("bgmVolume", bgmVolume);
  }, [bgmVolume]);

  useEffect(() => {
    localStorage.setItem("sfxVolume", sfxVolume);
  }, [sfxVolume]);

  const resetProgress = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <VolumeContext.Provider
      value={{ bgmVolume, setBgmVolume, sfxVolume, setSfxVolume, resetProgress }}
    >
      {children}
    </VolumeContext.Provider>
  );
}