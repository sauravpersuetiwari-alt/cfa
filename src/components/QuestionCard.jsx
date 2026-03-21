import { useState } from "react";

const DIFFICULTY_COLOR = {
  Easy: "badge--easy",
  Medium: "badge--medium",
  Hard: "badge--hard",
};

export default function QuestionCard({
  question,
  questionNumber,
  totalVisible,
  state,
  onAnswer,
  onFlag,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionClick = (option) => {
    if (state.isAnswered) return;
    onAnswer(option);
    setShowExplanation(false);
  };

  const getOptionClass = (option) => {
    if (!state.isAnswered) {
      return "option-btn option-btn--default";
    }
    if (option === question.answer) {
      return "option-btn option-btn--correct";
    }
    if (option === state.selectedAnswer && option !== question.answer) {
      return "option-btn option-btn--incorrect";
    }
    return "option-btn option-btn--dimmed";
  };

  const getOptionIcon = (option) => {
    if (!state.isAnswered) return null;
    if (option === question.answer) return <span className="option-icon correct-icon">✓</span>;
    if (option === state.selectedAnswer && option !== question.answer)
      return <span className="option-icon incorrect-icon">✗</span>;
    return null;
  };

  return (
    <div className="question-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="card-header-left">
          <span className="topic-badge">{question.topic}</span>
          <span className={`difficulty-badge ${DIFFICULTY_COLOR[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>
        <div className="card-header-right">
          <span className="question-counter">
            {questionNumber} / {totalVisible}
          </span>
          <button
            className={`flag-btn ${state.isFlagged ? "flag-btn--active" : ""}`}
            onClick={onFlag}
            title={state.isFlagged ? "Remove flag" : "Flag this question"}
          >
            {state.isFlagged ? "🚩" : "⚑"}
            <span className="flag-label">{state.isFlagged ? "Flagged" : "Flag"}</span>
          </button>
        </div>
      </div>

      {/* Subtopic & LOS */}
      <div className="los-box">
        <div className="subtopic-label">
          <strong>Subtopic:</strong> {question.subtopic}
        </div>
        <div className="los-label">
          <strong>Learning Objective:</strong> {question.los}
        </div>
      </div>

      {/* Question */}
      <div className="question-body">
        <p className="question-text">{question.question}</p>
      </div>

      {/* Options */}
      <div className="options-list">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            className={getOptionClass(key)}
            onClick={() => handleOptionClick(key)}
            disabled={state.isAnswered}
          >
            <span className="option-key">{key}.</span>
            <span className="option-text">{value}</span>
            {getOptionIcon(key)}
          </button>
        ))}
      </div>

      {/* Answer Result Banner */}
      {state.isAnswered && (
        <div className={`result-banner ${state.isCorrect ? "result-banner--correct" : "result-banner--incorrect"}`}>
          <span className="result-icon">{state.isCorrect ? "✓" : "✗"}</span>
          <span className="result-text">
            {state.isCorrect
              ? "Correct! Well done."
              : `Incorrect. The correct answer is ${question.answer}.`}
          </span>
          <button
            className="explanation-toggle"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? "Hide" : "Show"} Explanation
          </button>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && state.isAnswered && (
        <div className="explanation-box">
          <h4 className="explanation-title">Explanation</h4>
          <p className="explanation-text">{question.explanation}</p>
          <p className="source-text">
            <strong>Source:</strong> {question.source}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="card-footer">
        <button className="nav-btn nav-btn--prev" onClick={onPrev} disabled={!hasPrev}>
          ← Previous
        </button>
        {!state.isAnswered && (
          <span className="select-hint">Select an option to answer</span>
        )}
        <button className="nav-btn nav-btn--next" onClick={onNext} disabled={!hasNext}>
          Next →
        </button>
      </div>
    </div>
  );
}
