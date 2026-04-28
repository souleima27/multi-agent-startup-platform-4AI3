export function TrackPage({ track }) {
  return (
    <section className="section track-page">
      <div className="track-page-hero reveal">
        <div className="track-page-copy">
          <div className="track-card-top">
            <span className="track-label">{track.track}</span>
            <span className="track-badge">{track.badge}</span>
          </div>
          <div className="track-icon large-track-icon">{track.icon}</div>
          <h1>{track.pageTitle}</h1>
          <p>{track.pageText}</p>
          <div className="track-highlights">
            {track.highlights.map((highlight) => (
              <span key={highlight} className="track-chip">
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="track-page-panel reveal delay-1">
          <p className="eyebrow">This path helps you</p>
          <div className="track-steps">
            {track.steps.map((step, index) => (
              <div key={step} className="track-step">
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="track-page-outcome reveal delay-2">
        <div>
          <p className="eyebrow">{track.outcomeTitle}</p>
          <h2>{track.title}</h2>
          <p>{track.outcomeText}</p>
        </div>
        <div className="track-page-actions">
          <a href="#contact" className="primary-btn">
            Talk About This Track
          </a>
          <a href="#services" className="secondary-btn">
            Back to All Tracks
          </a>
        </div>
      </div>
    </section>
  );
}
