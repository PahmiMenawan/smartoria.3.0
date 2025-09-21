import { useState, useEffect } from "react";
import NavButtons, { SettingsButton } from "./NavButtons";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import questions from "./questions.json";
import { useSFX } from "./useSFX";


export default function Quests() {
  const playSFX = useSFX();
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [score, setScore] = useState(0);
  const [showEnd, setShowEnd] = useState(false);
  const navigate = useNavigate();
  const [bgmVolume, setBgmVolume] = useState(() =>
    Number(localStorage.getItem("bgmVolume") || 50)
  );
  const [sfxVolume, setSfxVolume] = useState(() =>
    Number(localStorage.getItem("sfxVolume") || 50)
  );

  useEffect(() => {
    return () => {
      setScore(0);
      localStorage.removeItem("score");
    };
  }, []);

  const currentChapter = Number(localStorage.getItem("CurrentChapter"));
  const currentSubject = localStorage.getItem("subjects");
  const currentDifficulty = localStorage.getItem("Difficulty") === "1" ? "SD" : "SMP";
  const chapterKey = `${currentSubject.toLowerCase()}_${currentDifficulty}`;

  const filteredQuestions = questions
    .filter(
      (q) =>
        q.chapter === currentChapter &&
        q.subject === currentSubject &&
        String(q.difficulty) === String(localStorage.getItem("Difficulty"))
    )
    .slice(0, 5);

  const currentQuestion = filteredQuestions[currentIdx];

  const handleSelect = (idx) => {
    setSelected(idx);
    if (currentQuestion.answers[idx].correct) {
      setScore((prev) => prev + 1);
      playSFX("correct.webm");
      localStorage.setItem("score", score + 1);
    } else {
      playSFX("wrong.webm");
    }

  };

const handleNext = () => {
  if (currentIdx < filteredQuestions.length - 1) {
    setCurrentIdx(currentIdx + 1);
    setSelected(null);
  } else {
    const completionKey = `${currentSubject}_${currentDifficulty}_chapter${currentChapter}_completed`;
    const completedBefore = localStorage.getItem(completionKey) === "true";
    setAlreadyCompleted(completedBefore); // ← move this here
    setShowEnd(true);
  }
};

  // Award medal and unlock next chapter if perfect score
  const handleEndNext = () => {
    const completionKey = `${currentSubject}_${currentDifficulty}_chapter${currentChapter}_completed`;
    const completedBefore = localStorage.getItem(completionKey) === "true";
    // Medal logic
    const medalKey = `medals_${currentDifficulty}`;

    if (score === 5 && !alreadyCompleted) {
      // Award medal
      const medalKey = `medals_${currentDifficulty}`;
      let medalCount = Number(localStorage.getItem(medalKey) || 0);
      localStorage.setItem(medalKey, medalCount + 1);

      // Mark chapter as completed
      localStorage.setItem(completionKey, "true");
    }
    if (alreadyCompleted) {
      console.log("Medal already earned for this chapter.");
    }
    // Unlock next chapter if score is 5
    let chapterUnlock = Number(localStorage.getItem(chapterKey) || 1);
    if (score === 5 && chapterUnlock < 3 && currentChapter === chapterUnlock) {
      localStorage.setItem(chapterKey, chapterUnlock + 1);
      chapterUnlock += 1; // update for trophy check below
    }

    // TROPHY LOGIC: Award trophy when chapter unlock reaches 3
    const trophyKey = `${currentSubject.toLowerCase()}_${currentDifficulty}_trophy`;
    if (chapterUnlock === 3) {
      localStorage.setItem(trophyKey, "true");
    }

    setScore(0);
    localStorage.removeItem("score");
    setShowEnd(false);
    navigate("/chapters");
  };
  const resetProgress = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-200 to-white">

      <NavButtons backTo="/chapters" />
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


      {!showEnd && (
        <>
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 mb-8 w-72 sm:w-full sm:max-w-xl flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4">
              {currentQuestion ? currentQuestion.question : "No questions found."}
            </div>
          </div>

          {/* Answer Cards */}
          <div className="flex flex-col sm:flex-row gap-4 w-72 sm:w-full sm:max-w-xl">
            {currentQuestion &&
              currentQuestion.answers.map((ans, idx) => (
                <button
                  key={ans.label}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-72 sm:w-1/4 h-14 sm:h-32 rounded-2xl shadow-xl flex flex-row sm:flex-col items-center justify-between sm:justify-center px-4 sm:px-0 text-lg sm:text-xl font-bold transition
                    ${selected === idx
                      ? ans.correct
                        ? "bg-green-500 text-white scale-105"
                        : "bg-red-500 text-white scale-105"
                      : "bg-white text-indigo-700 hover:bg-blue-100 hover:scale-105"}
                  `}
                  style={{ outline: "none" }}
                >
                  <div className="text-xl mr-4 sm:mr-0">{ans.label}</div>
                  <div>{ans.text}</div>
                </button>
              ))}
          </div>

          {/* Next Button */}
          {selected !== null && (
            <button
              onClick={handleNext}
              className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition"
            >
              {currentIdx < filteredQuestions.length - 1 ? "Next" : "Finish"}
            </button>
          )}
        </>
      )}

      {/* Ending Popup */}
      {showEnd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              Quiz Finished!
            </h2>
            <div className="mb-2 text-lg font-semibold">
              Score: {score} / 5
            </div>
            <div className="mb-2 text-lg">Wrong Answers: {5 - score}</div>
            {score === 5 && (
              <div className="mb-2 text-yellow-500 text-xl font-bold">
                🏅 {alreadyCompleted ? "You’ve already earned the medal for this chapter." : "Perfect! You earned a medal!"}
              </div>
            )}
            <button
              onClick={handleEndNext}
              className="mt-4 px-8 py-2 rounded-full bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition"
            >
              Back to Chapters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}