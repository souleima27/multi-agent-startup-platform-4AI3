import { useEffect, useState } from "react";

function Counter({ value, suffix, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <div className="stat-counter">
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export function StatsSection({ stats }) {
  return (
    <section className="section stats-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Statistics</p>
        <h2>Numbers that bring momentum to the startup story.</h2>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={item.label} className={`reveal delay-${(index % 3) + 1}`}>
            <Counter {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}
