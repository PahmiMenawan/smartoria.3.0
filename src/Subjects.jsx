import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavButtons, { SettingsButton } from "./NavButtons";
import SettingsModal from "./SettingsModal";
import { useSFX } from "./useSFX";


const subjectsList = [
  { name: "MTK", icon: "📐", color: "#fbbf24", bg: "#fef3c7" },
  { name: "Bahasa Inggris", icon: "🇬🇧", color: "#60a5fa", bg: "#dbeafe" },
  { name: "Negara", icon: "🌏", color: "#34d399", bg: "#d1fae5" },
  { name: "Sejarah", icon: "📜", color: "#f87171", bg: "#fee2e2" },
];

// Trophy animation styles
const trophyGlow = {
  animation: "trophy-shine 1.2s infinite alternate",
  filter: "drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 16px #000)",
};

export default function Subjects() {
  const playSFX = useSFX();
  const [selected, setSelected] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const navigate = useNavigate();
  const [bgmVolume, setBgmVolume] = useState(() =>
  Number(localStorage.getItem("bgmVolume") || 50)
);
const [sfxVolume, setSfxVolume] = useState(() =>
  Number(localStorage.getItem("sfxVolume") || 50)
);

  // Get current difficulty
  const difficulty = localStorage.getItem("Difficulty") === "1" ? "SD" : "SMP";

  // Helper to check trophy for subject/difficulty
  const hasTrophy = (subject) => {
    const trophyKey = `${subject.toLowerCase()}_${difficulty}_trophy`;
    return localStorage.getItem(trophyKey) === "true";
  };

  const handleSelect = (subject) => {
    setSelected(subject);
    localStorage.setItem("subjects", subject);
    playSFX("click.webm");

  };

  const handleNext = () => {
    navigate("/chapters");
    playSFX("click.webm");

  };
const resetProgress = () => {
  localStorage.clear();
  window.location.reload();
};
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-200 to-white">
      <NavButtons backTo="/difficulty" />
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


      {/* Mobile: one card at a time */}
      <div className="w-full flex flex-col items-center sm:hidden">
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => setCurrentIdx((prev) => Math.max(prev - 1, 0))}
            disabled={currentIdx === 0}
            className="px-2 py-1 text-2xl text-white"
          >
            ◀
          </button>
          <motion.div
            key={subjectsList[currentIdx].name}
            whileHover={{ scale: selected === subjectsList[currentIdx].name ? 1.12 : 1.05 }}
            animate={{
              scale: selected === subjectsList[currentIdx].name ? 1.12 : 1,
              boxShadow:
                selected === subjectsList[currentIdx].name
                  ? `0 0 0 4px ${subjectsList[currentIdx].color}, 0 10px 20px rgba(0,0,0,0.15)`
                  : "0 10px 20px rgba(0,0,0,0.15)",
              backgroundColor: hasTrophy(subjectsList[currentIdx].name)
                ? "linear-gradient(135deg, #111 60%, #FFD700 100%)"
                : selected === subjectsList[currentIdx].name
                  ? subjectsList[currentIdx].bg
                  : "#fff",
              border: hasTrophy(subjectsList[currentIdx].name)
                ? "4px solid #FFD700"
                : undefined,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`rounded-2xl shadow-xl w-56 h-72 flex flex-col items-center justify-between p-6 cursor-pointer select-none mx-4 ${hasTrophy(subjectsList[currentIdx].name) ? "text-white" : ""
              }`}
            onClick={() => handleSelect(subjectsList[currentIdx].name)}
            style={
              hasTrophy(subjectsList[currentIdx].name)
                ? { background: "linear-gradient(135deg, #111 60%, #FFD700 100%)" }
                : {}
            }
          >
            <div className="w-full h-32 flex items-center justify-center mb-4 text-5xl">
              <span>{subjectsList[currentIdx].icon}</span>
            </div>
            {hasTrophy(subjectsList[currentIdx].name) && (
              <div className="flex flex-col items-center mb-2">
                <span
                  className="text-5xl mb-2"
                  style={trophyGlow}
                >
                  🏆
                </span>
                <span className="text-yellow-400 font-bold text-lg animate-pulse">Trophy Unlocked!</span>
              </div>
            )}
            <div
              className="w-full text-center text-lg font-bold mb-2"
              style={{
                color: hasTrophy(subjectsList[currentIdx].name)
                  ? "#FFD700"
                  : subjectsList[currentIdx].color,
                textShadow: hasTrophy(subjectsList[currentIdx].name)
                  ? "0 0 8px #FFD700, 0 0 2px #000"
                  : undefined,
              }}
            >
              {subjectsList[currentIdx].name}
            </div>
          </motion.div>
          <button
            onClick={() => setCurrentIdx((prev) => Math.min(prev + 1, subjectsList.length - 1))}
            disabled={currentIdx === subjectsList.length - 1}
            className="px-2 py-1 text-2xl text-white"
          >
            ▶
          </button>
        </div>
        {selected && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleNext}
            className="mt-6 px-8 py-3 font-bold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
          >
            Next
          </motion.button>
        )}
      </div>

      {/* Desktop: show all cards */}
      <div className="hidden sm:flex gap-8 mb-8">
        {subjectsList.map((subject, idx) => (
          <motion.div
            key={subject.name}
            whileHover={{ scale: selected === subject.name ? 1.12 : 1.05 }}
            animate={{
              scale: selected === subject.name ? 1.12 : 1,
              boxShadow:
                selected === subject.name
                  ? `0 0 0 4px ${subject.color}, 0 10px 20px rgba(0,0,0,0.15)`
                  : "0 10px 20px rgba(0,0,0,0.15)",
              backgroundColor: hasTrophy(subject.name)
                ? "linear-gradient(135deg, #111 60%, #FFD700 100%)"
                : selected === subject.name
                  ? subject.bg
                  : "#fff",
              border: hasTrophy(subject.name)
                ? "4px solid #FFD700"
                : undefined,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`rounded-2xl shadow-xl w-56 h-72 flex flex-col items-center justify-between p-6 cursor-pointer select-none ${hasTrophy(subject.name) ? "text-white" : ""
              }`}
            onClick={() => handleSelect(subject.name)}
            style={
              hasTrophy(subject.name)
                ? { background: "linear-gradient(135deg, #111 60%, #FFD700 100%)" }
                : {}
            }
          >
            <div className="w-full h-32 flex items-center justify-center mb-4 text-5xl">
              <span>{subject.icon}</span>
            </div>
            {hasTrophy(subject.name) && (
              <div className="flex flex-col items-center mb-2">
                <span
                  className="text-5xl mb-2"
                  style={trophyGlow}
                >
                  🏆
                </span>
                <span className="text-yellow-400 font-bold text-lg animate-pulse">Trophy Unlocked!</span>
              </div>
            )}
            <div
              className="w-full text-center text-lg font-bold mb-2"
              style={{
                color: hasTrophy(subject.name) ? "#FFD700" : subject.color,
                textShadow: hasTrophy(subject.name)
                  ? "0 0 8px #FFD700, 0 0 2px #000"
                  : undefined,
              }}
            >
              {subject.name}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Desktop next button */}
      {selected && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleNext}
          className="hidden sm:block px-8 py-3 font-bold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        >
          Next
        </motion.button>
      )}
    </div>
  );
}

/*
@keyframes trophy-shine {
  0% { filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 16px #000); }
  100% { filter: drop-shadow(0 0 24px #FFD700) drop-shadow(0 0 32px #000); }
}
*/