const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60",
];

const GRADIENTS = [
  "linear-gradient(120deg,#0d2145 0%,#2f6bff 100%)",
  "linear-gradient(120deg,#1a3b78 0%,#5a92ff 100%)",
  "linear-gradient(120deg,#102a56 0%,#4b7cff 100%)",
];

export function ServicesSection({ services }) {
  return (
    <section id="services" className="section content-section">
      <style>{`
        .svc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px;margin-top:52px}
        .svc-card{position:relative;display:flex;flex-direction:column;border-radius:28px;border:1px solid var(--border);background:rgba(255,255,255,0.97);box-shadow:0 6px 28px rgba(14,38,84,0.07);overflow:hidden;transition:transform .38s ease,box-shadow .38s ease,border-color .38s ease}
        body.dark-mode .svc-card{background:rgba(10,20,42,0.82)}
        .svc-card:hover{transform:translateY(-10px);box-shadow:0 28px 64px rgba(20,58,140,0.16),0 0 0 1.5px rgba(75,124,255,0.22);border-color:rgba(75,124,255,0.3)}
        .svc-top-bar{height:5px;width:100%;flex-shrink:0}
        .svc-bg-img{position:absolute;inset:0;background-size:cover;background-position:center right;opacity:.07;transition:opacity .38s ease;pointer-events:none}
        .svc-card:hover .svc-bg-img{opacity:.13}
        .svc-body{position:relative;display:flex;flex-direction:column;gap:18px;padding:28px 28px 32px;flex:1;z-index:1}
        .svc-meta{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .svc-track-label{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:rgba(47,107,255,.1);color:var(--navy-800)}
        .svc-track-badge{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:.72rem;font-weight:700;background:rgba(47,107,255,.08);color:var(--blue-500)}
        .svc-title{margin:0;font-family:"Space Grotesk",sans-serif;font-size:clamp(1.5rem,2.2vw,1.8rem);font-weight:700;color:var(--navy-900);line-height:1.08;letter-spacing:-.025em}
        .svc-desc{margin:0;color:var(--text);font-size:.96rem;line-height:1.65;max-width:36ch}
        .svc-tags{display:flex;flex-wrap:wrap;gap:8px}
        .svc-tag{display:inline-flex;align-items:center;padding:7px 13px;border-radius:999px;border:1px solid var(--border);background:rgba(18,51,100,.045);color:var(--navy-800);font-size:.81rem;font-weight:600}
        body.dark-mode .svc-tag{background:rgba(255,255,255,.06)}
        .svc-btn{display:inline-flex;align-items:center;gap:8px;margin-top:6px;padding:13px 22px;border-radius:999px;font-size:.92rem;font-weight:800;color:#fff;border:0;background:linear-gradient(135deg,#10336a 0%,#2f6bff 55%,#5a92ff 100%);box-shadow:0 10px 26px rgba(21,63,138,.26);transition:transform .3s ease,box-shadow .3s ease;cursor:pointer;text-decoration:none;align-self:flex-start}
        .svc-btn:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(21,63,138,.34);color:#fff}
        .svc-arrow{transition:transform .3s ease}
        .svc-btn:hover .svc-arrow{transform:translateX(4px)}
        .svc-footer{margin-top:52px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
        .svc-footer-label{margin:0;font-family:"Space Grotesk",sans-serif;font-size:1.2rem;font-weight:700;color:var(--navy-900)}
        @media(max-width:900px){.svc-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="section-heading reveal">
        <p className="eyebrow">Services</p>
        <h2>Choose your startup path</h2>
        <p className="section-subtitle">
          Whether testing an idea, handling legal setup, or launching — pick the track
          that fits where you are right now.
        </p>
      </div>

      <div className="svc-grid">
        {services.map((service, index) => {
          const href = service.directHref ?? `#${service.id}`;
          return (
            <article key={service.id} className={`svc-card reveal delay-${index + 1}`}>
              <div className="svc-bg-img" style={{ backgroundImage: `url(${CARD_IMAGES[index]})` }} aria-hidden="true" />
              <div className="svc-top-bar" style={{ background: GRADIENTS[index] }} aria-hidden="true" />
              <div className="svc-body">
                <div className="svc-meta">
                  <span className="svc-track-label">{service.track}</span>
                  <span className="svc-track-badge">{service.badge}</span>
                </div>
                <h3 className="svc-title">{service.title}</h3>
                <p className="svc-desc">{service.description}</p>
                <div className="svc-tags">
                  {service.highlights.slice(0, 3).map((tag) => (
                    <span key={tag} className="svc-tag">{tag}</span>
                  ))}
                </div>
                <a href={href} className="svc-btn">
                  Explore Track
                  <svg className="svc-arrow" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="svc-footer reveal delay-2">
        <p className="svc-footer-label">Not sure where to start?</p>
        <a href="#contact" className="primary-btn">Find My Startup Track</a>
      </div>
    </section>
  );
}
