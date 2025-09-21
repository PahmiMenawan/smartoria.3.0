import { useContext } from "react";
import { motion } from "framer-motion";
import { VolumeContext } from "./VolumeContext";
import { useSFX } from "./useSFX";

export default function SettingsModal({ show, onClose }) {
  const playSFX = useSFX();
  if (!show) return null;

  const { bgmVolume, setBgmVolume, sfxVolume, setSfxVolume, resetProgress } =
    useContext(VolumeContext);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, scale: 0.7, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 100, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bg-white rounded-2xl shadow-2xl p-8 w-96 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>

        {/* BGM Volume */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Background Music</label>
          <input
            type="range"
            min="0"
            max="100"
            value={bgmVolume}
            onChange={(e) => setBgmVolume(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <p className="text-sm mt-1">Volume: {bgmVolume}%</p>
        </div>

        {/* SFX Volume */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Sound Effects</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <p className="text-sm mt-1">Volume: {sfxVolume}%</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition" v
        >
          Close
        </button>
        <button
          onClick={() => {
            playSFX("click.webm");
            resetProgress();
            onClose();
          }}
          className="w-full mt-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reset Progress
        </button>
      </motion.div>
    </motion.div>
  );
}