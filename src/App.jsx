import { useState, useMemo, useCallback, useEffect } from "react";
import { questions } from "./data/questions";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuestionCard from "./components/QuestionCard";
import "./App.css";

const STORAGE_KEY = "cfa-portal-progress";

const initialStates = () =>
  questions.map(() => ({
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null,
    isFlagged: false,
  }));

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

export default function App() {
  const [questionStates, setQuestionStates] = useState(() => {
    const saved = loadFromStorage();
    if (saved?.questionStates && saved.questionStates.length === questions.length) {
      return saved.questionStates;
    }
    return initialStates();
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = loadFromStorage();
    return saved?.currentIndex ?? 0;
  });

  const [filterTopic, setFilterTopic] = useState("All Topics");
  const [filterStatus, setFilterStatus] = useState("all");

  // Auto-save whenever state changes
  useEffect(() => {
    saveToStorage({ questionStates, currentIndex });
  }, [questionStates, currentIndex]);

  // Compute filtered question indices
  const filteredIndices = useMemo(() => {
    return questions.reduce((acc, q, idx) => {
      const state = questionStates[idx];
      const topicMatch = filterTopic === "All Topics" || q.topic === filterTopic;
      let statusMatch = true;
      if (filterStatus === "unanswered") statusMatch = !state.isAnswered;
      else if (filterStatus === "correct") statusMatch = state.isAnswered && state.isCorrect;
      else if (filterStatus === "incorrect") statusMatch = state.isAnswered && !state.isCorrect;
      else if (filterStatus === "flagged") statusMatch = state.isFlagged;
      if (topicMatch && statusMatch) acc.push(idx);
      return acc;
    }, []);
  }, [questionStates, filterTopic, filterStatus]);

  // Keep currentIndex within filtered list
  const currentFilteredPos = filteredIndices.indexOf(currentIndex);
  const safeCurrentIndex =
    currentFilteredPos === -1
      ? filteredIndices.length > 0
        ? filteredIndices[0]
        : currentIndex
      : currentIndex;

  const handleAnswer = useCallback((questionIndex, selectedOption) => {
    setQuestionStates((prev) => {
      const next = [...prev];
      next[questionIndex] = {
        ...next[questionIndex],
        selectedAnswer: selectedOption,
        isAnswered: true,
        isCorrect: selectedOption === questions[questionIndex].answer,
      };
      return next;
    });
  }, []);

  const handleFlag = useCallback((questionIndex) => {
    setQuestionStates((prev) => {
      const next = [...prev];
      next[questionIndex] = {
        ...next[questionIndex],
        isFlagged: !next[questionIndex].isFlagged,
      };
      return next;
    });
  }, []);

  const handleNav = (direction) => {
    const pos = filteredIndices.indexOf(safeCurrentIndex);
    const newPos = pos + direction;
    if (newPos >= 0 && newPos < filteredIndices.length) {
      setCurrentIndex(filteredIndices[newPos]);
    }
  };

  const handleSelect = (idx) => setCurrentIndex(idx);

  const handleResetAll = () => {
    if (window.confirm("Reset all progress? This will clear all answers, flags, and scores.")) {
      const fresh = initialStates();
      setQuestionStates(fresh);
      setCurrentIndex(0);
      setFilterTopic("All Topics");
      setFilterStatus("all");
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const answered = questionStates.filter((s) => s.isAnswered).length;
  const flagged = questionStates.filter((s) => s.isFlagged).length;
  const correct = questionStates.filter((s) => s.isCorrect).length;

  const currentQuestion = questions[safeCurrentIndex];
  const currentState = questionStates[safeCurrentIndex];
  const displayPos = filteredIndices.indexOf(safeCurrentIndex);

  return (
    <div className="app">
      <Header
        totalQuestions={questions.length}
        answered={answered}
        flagged={flagged}
        onResetAll={handleResetAll}
      />

      <div className="app-body">
        <Sidebar
          questions={questions}
          questionStates={questionStates}
          currentIndex={safeCurrentIndex}
          onSelect={handleSelect}
          filterTopic={filterTopic}
          setFilterTopic={setFilterTopic}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filteredIndices={filteredIndices}
        />

        <main className="main-content">
          {filteredIndices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>No questions match your filters</h2>
              <p>Try changing the topic or status filter.</p>
              <button
                className="reset-filters-btn"
                onClick={() => { setFilterTopic("All Topics"); setFilterStatus("all"); }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <QuestionCard
                question={currentQuestion}
                questionNumber={displayPos + 1}
                totalVisible={filteredIndices.length}
                state={currentState}
                onAnswer={(option) => handleAnswer(safeCurrentIndex, option)}
                onFlag={() => handleFlag(safeCurrentIndex)}
                onNext={() => handleNav(1)}
                onPrev={() => handleNav(-1)}
                hasPrev={displayPos > 0}
                hasNext={displayPos < filteredIndices.length - 1}
              />

              {/* Score Summary */}
              {answered > 0 && (
                <div className="score-bar">
                  <div className="score-item">
                    <span className="score-num score-correct">{correct}</span>
                    <span className="score-lbl">Correct</span>
                  </div>
                  <div className="score-divider" />
                  <div className="score-item">
                    <span className="score-num score-wrong">{answered - correct}</span>
                    <span className="score-lbl">Incorrect</span>
                  </div>
                  <div className="score-divider" />
                  <div className="score-item">
                    <span className="score-num score-pct">
                      {Math.round((correct / answered) * 100)}%
                    </span>
                    <span className="score-lbl">Score</span>
                  </div>
                  <div className="score-divider" />
                  <div className="score-item">
                    <span className="score-num score-remain">{questions.length - answered}</span>
                    <span className="score-lbl">Remaining</span>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
