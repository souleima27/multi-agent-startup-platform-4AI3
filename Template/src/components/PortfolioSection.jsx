export function PortfolioSection({ items }) {
  return (
    <section id="portfolio" className="section content-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Portfolio</p>
        <h2>Examples of clear and confident startup presentation.</h2>
      </div>

      <div className="portfolio-grid">
        {items.map((item, index) => (
          <article key={item.title} className={`portfolio-card reveal delay-${(index % 3) + 1}`}>
            <img src={item.image} alt={item.title} />
            <div className="portfolio-body">
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
