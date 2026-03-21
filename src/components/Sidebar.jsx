import { topics } from "../data/questions";

export default function Sidebar({
  questions,
  questionStates,
  currentIndex,
  onSelect,
  filterTopic,
  setFilterTopic,
  filterStatus,
  setFilterStatus,
  filteredIndices,
}) {
  const statusOptions = [
    { value: "all", label: "All Questions" },
    { value: "unanswered", label: "Unanswered" },
    { value: "correct", label: "Correct" },
    { value: "incorrect", label: "Incorrect" },
    { value: "flagged", label: "Flagged" },
  ];

  const getQuestionStatus = (qIndex) => {
    const state = questionStates[qIndex];
    if (state.isFlagged && !state.isAnswered) return "flagged";
    if (!state.isAnswered) return "unanswered";
    if (state.isCorrect) return "correct";
    return "incorrect";
  };

  const statusClass = (qIndex) => {
    const s = getQuestionStatus(qIndex);
    return `q-dot q-dot--${s}`;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-heading">Filter by Topic</h3>
        <select
          className="sidebar-select"
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">Filter by Status</h3>
        <div className="status-filters">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              className={`filter-btn ${filterStatus === opt.value ? "filter-btn--active" : ""}`}
              onClick={() => setFilterStatus(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">
          Question Navigator
          <span className="q-count">{filteredIndices.length} shown</span>
        </h3>
        <div className="q-grid">
          {filteredIndices.map((qIndex) => {
            const q = questions[qIndex];
            const isActive = qIndex === currentIndex;
            return (
              <button
                key={q.id}
                className={`q-nav-btn ${statusClass(qIndex)} ${isActive ? "q-nav-btn--active" : ""}`}
                onClick={() => onSelect(qIndex)}
                title={`Q${q.id}: ${q.subtopic}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot legend-dot--unanswered" />
            Unanswered
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--correct" />
            Correct
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--incorrect" />
            Incorrect
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--flagged" />
            Flagged
          </div>
        </div>
      </div>
    </aside>
  );
}
