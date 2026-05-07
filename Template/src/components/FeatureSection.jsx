const BLUE = { color: "#2f6bff", bg: "rgba(47,107,255,0.1)" };
const VALUE_ACCENTS = [BLUE, BLUE, BLUE, BLUE];

export function FeatureSection({ values, aboutParallax }) {
  return (
    <section id="about" className="section about-section">
      <style>{`
        /* ── Layout ────────────────────────────────── */
        .about-section {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 48px;
          align-items: center;
        }

        /* ── Left image panel ──────────────────────── */
        .about-image {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(14,38,84,0.14);
          aspect-ratio: 3/4;
          max-height: 560px;
        }

        .about-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          will-change: transform;
          transition: transform 0.6s ease;
        }

        .about-image:hover img { transform: scale(1.04); }

        .about-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(10,25,60,0.22));
          pointer-events: none;
        }

        /* ── Right copy ────────────────────────────── */
        .about-copy {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .about-copy h2 {
          max-width: 22ch;
          font-size: clamp(1.9rem, 3.2vw, 2.8rem);
          line-height: 1.1;
        }

        .about-copy > p {
          margin: 0;
          color: var(--text);
          font-size: 1.02rem;
          line-height: 1.72;
          max-width: 52ch;
        }

        /* ── Values grid ───────────────────────────── */
        .fv-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        /* ── Value card ────────────────────────────── */
        .fv-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px;
          border-radius: 22px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.96);
          box-shadow: 0 4px 18px rgba(14,38,84,0.06);
          overflow: hidden;
          transition: transform 0.36s ease, box-shadow 0.36s ease, border-color 0.36s ease;
        }

        body.dark-mode .fv-card { background: rgba(10,20,42,0.72); }

        .fv-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          opacity: 0;
          transition: opacity 0.36s ease;
        }

        .fv-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 52px rgba(14,38,84,0.13);
        }

        .fv-card:hover::before { opacity: 1; }

        /* ── Number badge ──────────────────────────── */
        .fv-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-family: "Space Grotesk", sans-serif;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          transition: transform 0.36s ease;
        }

        .fv-card:hover .fv-num { transform: scale(1.12); }

        /* ── Card title ────────────────────────────── */
        .fv-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy-900);
          line-height: 1.2;
        }

        /* ── Card text ─────────────────────────────── */
        .fv-text {
          margin: 0;
          font-size: 0.88rem;
          color: var(--text);
          line-height: 1.65;
        }

        /* ── Accent line on hover per card ─────────── */
        .fv-card-0::before { background: linear-gradient(90deg,#0d2145,#2f6bff); }
        .fv-card-1::before { background: linear-gradient(90deg,#065f46,#0d9488); }
        .fv-card-2::before { background: linear-gradient(90deg,#4c1d95,#7c3aed); }
        .fv-card-3::before { background: linear-gradient(90deg,#92400e,#d97706); }

        /* ── Responsive ────────────────────────────── */
        @media (max-width: 960px) {
          .about-section { grid-template-columns: 1fr; }
          .about-image { aspect-ratio: 16/7; max-height: none; }
        }

        @media (max-width: 600px) {
          .fv-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Left: image */}
      <div className="about-image reveal">
        <img
          style={aboutParallax}
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80"
          alt="Entrepreneurs collaborating in a modern startup office"
        />
      </div>

      {/* Right: copy + cards */}
      <div className="about-copy reveal delay-1">
        <p className="eyebrow">About</p>
        <h2>Simple support for founders who want to move from idea to action.</h2>
        <p>
          Starti is here to support founders who need clarity, guidance, and practical next steps.
          It helps you understand where you are, what to do next, and how to move forward with confidence.
        </p>

        <div className="fv-grid">
          {values.map((value, index) => {
            const accent = VALUE_ACCENTS[index] ?? VALUE_ACCENTS[0];
            const num = String(index + 1).padStart(2, "0");
            return (
              <article
                key={value.title}
                className={`fv-card fv-card-${index} reveal delay-${index + 1}`}
              >
                {/* Number circle */}
                <div
                  className="fv-num"
                  style={{ background: accent.bg, color: accent.color }}
                  aria-hidden="true"
                >
                  {num}
                </div>

                <h3 className="fv-title">{value.title}</h3>
                <p className="fv-text">{value.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
