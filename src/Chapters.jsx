import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavButtons, { SettingsButton } from "./NavButtons";
import SettingsModal from "./SettingsModal";
import { useSFX } from "./useSFX";


const chapters = [
  { name: "Chapter 1", img: "📘" },
  { name: "Chapter 2", img: "📙" },
  { name: "Chapter 3", img: "📗" },
];

export default function Chapters() {
  const playSFX = useSFX();
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [subject, setSubject] = useState("");
  const [unlocked, setUnlocked] = useState(1);
  const navigate = useNavigate();
  const [bgmVolume, setBgmVolume] = useState(() =>
  Number(localStorage.getItem("bgmVolume") || 50)
);
const [sfxVolume, setSfxVolume] = useState(() =>
  Number(localStorage.getItem("sfxVolume") || 50)
);

  useEffect(() => {
    const diff = localStorage.getItem("Difficulty") === "1" ? "SD" : "SMP";
    setDifficulty(diff);
    const subj = localStorage.getItem("subjects");
    setSubject(subj);

    // Compose unlock variable key, e.g. mtk_SD
    const unlockKey = subj ? `${subj.toLowerCase()}_${diff}` : "";
    const unlockLevel = unlockKey ? Number(localStorage.getItem(unlockKey) || 1) : 1;
    setUnlocked(unlockLevel);
  }, []);

  // Handler for chapter click
  const handleChapterClick = (chapterIdx) => {
    if (chapterIdx < unlocked) {
    playSFX("click.webm")
      localStorage.setItem("chapter", chapters[chapterIdx].name);
      localStorage.setItem("CurrentChapter", chapterIdx + 1); // 1-based index
      navigate("/quests");
    }
  };
const resetProgress = () => {
  localStorage.clear();
  window.location.reload();
};
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-200 to-green-300">
      <NavButtons backTo="/subjects" />
      <SettingsButton onClick={() => setShowSettings(true)} />
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        bgmVolume={bgmVolume}
        setBgmVolume={setBgmVolume}
        sfxVolume={sfxVolume}
        setSfxVolume={setSfxVolume}
        resetProgress={resetProgress}
      />


      {/* Desktop title at the top */}
      <div className="hidden sm:block mb-20 text-white text-xl font-bold">
        {subject && difficulty
          ? `Subject: ${subject} | Difficulty: ${difficulty}`
          : "Select subject and difficulty first"}
      </div>

      <div className="flex items-center justify-center w-full max-w-3xl relative">
        {/* Path stripes */}
        {/* Desktop: horizontal path */}
        <div className="hidden sm:block absolute left-0 right-0 top-1/2 h-4 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full z-0" style={{ transform: "translateY(-50%)" }} />
        {/* Mobile: vertical path (longer) */}
        <div className="sm:hidden absolute bottom-0 top-0 left-1/2 w-4 bg-gradient-to-t from-gray-200 via-gray-400 to-gray-200 rounded-full z-0" style={{ transform: "translateX(-50%)", height: "70vh" }} />

        {/* Checkpoints */}
        {/* Desktop: horizontal */}
        <div className="hidden sm:flex justify-between w-full z-10">
          {chapters.map((chapter, idx) => (
            <div key={chapter.name} className="flex flex-col items-center relative">
              {/* Actor on top of current unlocked chapter */}
              {idx === unlocked - 1 && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <span className="text-6xl">🧑‍🚀</span>
                </div>
              )}
              <button
                onClick={() => handleChapterClick(idx)}
                disabled={idx >= unlocked}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-2 text-4xl transition transform
                  ${idx < unlocked
                    ? "bg-white hover:scale-105 active:scale-95 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed opacity-60"}
                `}
                style={{ outline: "none" }}
              >
                {chapter.img}
              </button>
              <div className="text-white font-semibold">{chapter.name}</div>
            </div>
          ))}
        </div>
        {/* Mobile: vertical */}
        <div className="flex flex-col-reverse items-center justify-between h-[85vh] w-full z-10 sm:hidden">
          {chapters.map((chapter, idx) => (
            <div key={chapter.name} className="flex flex-col items-center relative mb-9">
              {/* Actor on top of current unlocked chapter */}
              {idx === unlocked - 1 && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <span className="text-6xl">🧑‍🚀</span>
                </div>
              )}
              <button
                onClick={() => handleChapterClick(idx)}
                disabled={idx >= unlocked}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-2 text-3xl transition transform
                  ${idx < unlocked
                    ? "bg-white hover:scale-105 active:scale-95 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed opacity-60"}
                `}
                style={{ outline: "none" }}
              >
                {chapter.img}
              </button>
              <div className="text-white font-semibold text-sm">{chapter.name}</div>
            </div>
          ))}
        </div>

        {/* Mobile title at the bottom */}
        <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center text-white text-lg font-bold z-20">
          {subject && difficulty
            ? `Subject: ${subject} | Difficulty: ${difficulty}`
            : "Select subject and difficulty first"}
        </div>
      </div>
    </div>
  );
}