export function HeroSection({ copy, stats, heroParallax, onPrimaryAction }) {
  return (
    <section id="home" className="hero-section section">
      <div className="hero-copy reveal">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="hero-text">{copy.text}</p>

        <div className="hero-actions">
          <button type="button" className="primary-btn" onClick={onPrimaryAction}>
            Start Your Project
          </button>
          <a href="#services" className="secondary-btn">
            Explore Services
          </a>
        </div>

        <div className="hero-stats">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual reveal delay-1">
        <div className="hero-image-frame" style={heroParallax}>
          <img src={copy.image} alt="Startup team working around laptops in a modern innovation workspace" />
        </div>
        <div className="floating-card card-a">
          <strong>For New Founders</strong>
        </div>
        <div className="floating-card card-b">
          <strong>Launch Faster</strong>
        </div>
        <div className="floating-card card-c">
          <strong>Build Trust</strong>
        </div>
        <div className="floating-card card-d">
          <strong>Ready to Grow</strong>
        </div>
      </div>
    </section>
  );
}
