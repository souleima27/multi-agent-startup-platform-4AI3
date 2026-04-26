export function FeatureSection({ values, aboutParallax }) {
  return (
    <section id="about" className="section about-section">
      <div className="about-image reveal">
        <img
          style={aboutParallax}
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80"
          alt="Entrepreneurs collaborating in a modern startup office"
        />
      </div>

      <div className="about-copy reveal delay-1">
        <p className="eyebrow">About</p>
        <h2>Simple support for founders who want to move from idea to action.</h2>
        <p>
          Venture Path is here to support founders who need clarity, guidance, and practical next steps. It helps you
          understand where you are, what to do next, and how to move forward with more confidence.
        </p>

        <div className="values-grid">
          {values.map((value) => (
            <article key={value.title} className="feature-card compact-card">
              <div className="feature-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
