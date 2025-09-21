import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiSettings } from "react-icons/fi";
import { useSFX } from "./useSFX";

export default function NavButtons({ onSettings, backTo }) {
  const navigate = useNavigate();
  const playSFX = useSFX();
  return (
    <div className="absolute top-6 left-6 flex gap-3 z-50">
      <button
        onClick={() => {
          playSFX("click.webm");
          navigate(backTo || "/");
        }}
        className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition"
        title="Back"
      >

        <FiArrowLeft size={22} />
      </button>
      <button
        onClick={() => {
          playSFX("click.webm");
          navigate("/");
        }}
        className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition"
        title="Home"
      >
        <FiHome size={22} />
      </button>
      {/* Settings button will be placed on the right */}
    </div>
  );
}

export function SettingsButton({ onClick }) {
  return (
    <div className="absolute top-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition"
        title="Settings"
      >
        <FiSettings size={22} />
      </button>
    </div>
  );
}