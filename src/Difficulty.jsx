import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavButtons, { SettingsButton } from "./NavButtons";
import SettingsModal from "./SettingsModal";
import { useSFX } from "./useSFX";

const subjects = ["mtk", "sejarah", "inggris", "negara"];

function getMedalCount(difficulty) {
  return subjects.reduce((total, subj) => {
    const key = `medals_${subj}_${difficulty}`;
    return total + Number(localStorage.getItem(key) || 0);
  }, 0);
}

export default function Difficulty() {
  const playSFX = useSFX();
  const [selected, setSelected] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  // Get total medals for SD and SMP
  const medals_SD = Number(localStorage.getItem("medals_SD") || 0);
  const medals_SMP = Number(localStorage.getItem("medals_SMP") || 0);

  const handleSelect = (level) => {
    setSelected(level);
    localStorage.setItem("Difficulty", level);
    playSFX("click.webm")
  };

  const handleNext = () => {
    navigate("/subjects");
    playSFX("click.webm")
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-200 to-white">
      <NavButtons backTo="/" />
      <SettingsButton onClick={() => setShowSettings(true)} />
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <div className="flex gap-4 sm:gap-12 mb-8 flex-wrap justify-center">
        {/* SD Card */}
        <motion.div
          whileHover={{ scale: selected === 1 ? 1.12 : 1.05 }}
          animate={{
            scale: selected === 1 ? 1.12 : 1,
            boxShadow:
              selected === 1
                ? "0 0 0 4px #a5b4fc, 0 10px 20px rgba(0,0,0,0.15)"
                : "0 10px 20px rgba(0,0,0,0.15)",
            backgroundColor: selected === 1 ? "#eef2ff" : "#fff",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl shadow-xl w-40 h-56 sm:w-64 sm:h-80 flex flex-col items-center justify-between p-4 sm:p-6 cursor-pointer select-none relative"
          onClick={() => handleSelect(1)}
        >
          <div className="w-full h-24 sm:h-40 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
            <span className="text-3xl sm:text-5xl text-gray-400">🧒</span>
          </div>
          <div className="w-full flex flex-col items-center mb-2">
            <div className="flex justify-center flex-wrap">
              {[...Array(medals_SD)].map((_, i) => (
                <span
                  key={i}
                  className="text-yellow-400 text-base sm:text-xl mx-0.5"
                >
                  🏅
                </span>
              ))}
            </div>
          </div>
          <div className="w-full text-center text-lg sm:text-xl font-bold text-indigo-600 mb-2">
            SD
          </div>
        </motion.div>

        {/* SMP Card */}
        <motion.div
          whileHover={{ scale: selected === 2 ? 1.12 : 1.05 }}
          animate={{
            scale: selected === 2 ? 1.12 : 1,
            boxShadow:
              selected === 2
                ? "0 0 0 4px #fca5a5, 0 10px 20px rgba(0,0,0,0.15)"
                : "0 10px 20px rgba(0,0,0,0.15)",
            backgroundColor: selected === 2 ? "#fff1f2" : "#fff",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl shadow-xl w-40 h-56 sm:w-64 sm:h-80 flex flex-col items-center justify-between p-4 sm:p-6 cursor-pointer select-none relative"
          onClick={() => handleSelect(2)}
        >
          <div className="w-full h-24 sm:h-40 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
            <span className="text-3xl sm:text-5xl text-gray-400">🧑‍🎓</span>
          </div>
          <div className="w-full flex flex-col items-center mb-2">
            <div className="flex justify-center flex-wrap">
              {[...Array(medals_SMP)].map((_, i) => (
                <span
                  key={i}
                  className="text-yellow-400 text-base sm:text-xl mx-0.5"
                >
                  🏅
                </span>
              ))}
            </div>
          </div>
          <div className="w-full text-center text-lg sm:text-xl font-bold text-indigo-600 mb-2">
            SMP
          </div>
        </motion.div>
      </div>

      {selected && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleNext}
          className="px-8 py-3 font-bold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        >
          Next
        </motion.button>
      )}
    </div>
  );
}