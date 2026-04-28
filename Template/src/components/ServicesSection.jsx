export function ServicesSection({ services }) {
  return (
    <section id="services" className="section content-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Services</p>
        <h2>Choose your startup path</h2>
        <p className="section-subtitle">
          Whether you are testing an idea, preparing legal steps, or getting ready to launch, Venture Path gives you a
          clear path forward.
        </p>
      </div>

      <div className="services-grid tracks-grid">
        {services.map((service, index) => (
          <article key={service.title} className={`service-card track-card-modern reveal delay-${index + 1}`}>
            <div className="track-card-top">
              <span className="track-label">{service.track}</span>
              <span className="track-badge">{service.badge}</span>
            </div>

            <div className="track-icon">{service.icon}</div>

            <h3>{service.title}</h3>
            <p>{service.description}</p>

            <div className="track-highlights">
              {service.highlights.map((highlight) => (
                <span key={highlight} className="track-chip">
                  {highlight}
                </span>
              ))}
            </div>

            <a href={`#${service.id}`} className="secondary-btn track-link">
              Explore Track
            </a>
          </article>
        ))}
      </div>

      <div className="services-cta reveal delay-2">
        <p className="services-cta-text">Not sure where to start?</p>
        <a href="#contact" className="primary-btn">
          Find My Startup Track
        </a>
      </div>
    </section>
  );
}
