import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Difficulty from "./Difficulty"; // Make sure this file exists
import Subjects from "./Subjects";
import Chapters from "./Chapters";
import Quests from "./Quests";
import SettingsModal from "./SettingsModal";
import { VolumeProvider } from "./VolumeContext";
import BackgroundMusic from "./BackgroundMusic";



function resetProgress() {
  const subjects = ["mtk", "sejarah", "inggris", "negara"];
  const difficulties = ["SD", "SMP"];
  subjects.forEach(subj => {
    difficulties.forEach(diff => {
      localStorage.removeItem(`medals_${subj}_${diff}`);
      localStorage.removeItem(`${subj}_${diff}`);
    });
  });
  localStorage.removeItem("Difficulty");
  localStorage.removeItem("subjects");
  localStorage.removeItem("CurrentChapter");
  localStorage.removeItem("chapter");
  localStorage.removeItem("score");
  localStorage.removeItem("medals_SD");
  localStorage.removeItem("medals_SMP");
  localStorage.removeItem("bahasa inggris_SD");
  localStorage.removeItem("bahasa inggris_SMP");
  localStorage.removeItem("mtk_SD");
  localStorage.removeItem("mtk_SMP");
  localStorage.removeItem("negara_SD");
  localStorage.removeItem("negara_SMP");
  localStorage.removeItem("sejarah_SD");
  localStorage.removeItem("sejarah_SMP");
  localStorage.removeItem("bahasa inggris_SD_trophy");
  localStorage.removeItem("bahasa inggris_SMP_trophy");
  localStorage.removeItem("mtk_SD_trophy");
  localStorage.removeItem("mtk_SMP_trophy");
  localStorage.removeItem("negara_SD_trophy");
  localStorage.removeItem("negara_SMP_trophy");
  localStorage.removeItem("sejarah_SD_trophy");
  localStorage.removeItem("sejarah_SMP_trophy");
}

function HomePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(() =>
    Number(localStorage.getItem("bgmVolume") || 50)
  );
  const [sfxVolume, setSfxVolume] = useState(() =>
    Number(localStorage.getItem("sfxVolume") || 50)
  );
  const navigate = useNavigate();

  // Load saved settings when the app starts
  useEffect(() => {
    const savedBgm = localStorage.getItem("bgmVolume");
    const savedSfx = localStorage.getItem("sfxVolume");

    if (savedBgm !== null) setBgmVolume(Number(savedBgm));
    if (savedSfx !== null) setSfxVolume(Number(savedSfx));
  }, []);

  // Save settings when sliders change
  useEffect(() => {
    localStorage.setItem("bgmVolume", bgmVolume);
  }, [bgmVolume]);

  useEffect(() => {
    localStorage.setItem("sfxVolume", sfxVolume);
  }, [sfxVolume]);

  // Button click handlers
  const handleStart = () => {
    navigate("/difficulty");
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the game?")) {
      window.close();
    }
  };


  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-200 to-white">
      {/* Title with block reveal */}
      <div className="relative overflow-hidden mb-16 w-fit mx-auto">
        {/* Block sliding across (in front of title) */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-black z-20"
        />
        {/* Title text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-6xl font-extrabold text-white drop-shadow-lg select-none"
        >
          SMARTORIA
        </motion.h1>
      </div>

      {/* Buttons with entrance animation */}
      <div className="flex flex-col gap-4">
        {["START", "SETTINGS", "EXIT"].map((label, i) => (
          <motion.button
            key={label}
            initial={{
              transition: { duration: 0.15, ease: "easeOut" }, y: 200, opacity: 0
            }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.2, duration: 0.6, ease: "easeInOut" }}
            whileHover={{
              scale: 1.08,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (label === "SETTINGS") setShowSettings(true);
              if (label === "EXIT") handleExit();
              if (label === "START") handleStart();
            }}
            className={`px-8 py-3 sm:px-12 sm:py-4 text-xl sm:text-2xl font-bold rounded-2xl shadow-xl transition-all duration-200  
  ${label === "START"
                ? "bg-green-400 hover:bg-green-500 text-white"
                : label === "SETTINGS"
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {label}
          </motion.button>
        ))}
      </div>


      {/* Settings Modal */}
      <AnimatePresence>
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
          bgmVolume={bgmVolume}
          setBgmVolume={setBgmVolume}
          sfxVolume={sfxVolume}
          setSfxVolume={setSfxVolume}
          resetProgress={resetProgress}
        />
      </AnimatePresence>

    </div>
  );
}

// Main App component with routing
export default function App() {
  return (
    <VolumeProvider>
      <BackgroundMusic />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/difficulty" element={<Difficulty />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/quests" element={<Quests />} />
        </Routes>
      </Router>
    </VolumeProvider>
  );
}
