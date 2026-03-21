export default function Header({ totalQuestions, answered, flagged, onResetAll }) {
  const progress = totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0;

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">CFA</div>
          <div>
            <h1 className="header-title">Practice Portal</h1>
            <p className="header-subtitle">CFA Institute Exam Preparation</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-label">Questions</span>
            <span className="stat-value">{totalQuestions}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Answered</span>
            <span className="stat-value answered">{answered}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Flagged</span>
            <span className="stat-value flagged">{flagged}</span>
          </div>
          <button className="reset-btn" onClick={onResetAll} title="Reset all progress">
            ↺ Reset
          </button>
        </div>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        <span className="progress-label">{progress}% Complete</span>
      </div>
    </header>
  );
}
