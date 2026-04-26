export function SearchPanel({ query, onQueryChange, results, isSemanticReady }) {
  return (
    <section className="section content-section search-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Smart Search</p>
        <h2>Search the product experience before you wire in semantic retrieval.</h2>
      </div>

      <div className="search-shell reveal delay-1">
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search pricing, testimonials, newsletter, contact..."
        />
        <span className="search-badge">{isSemanticReady ? "Supabase live" : "Demo mode"}</span>
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((item) => (
            <a key={item.title} href={item.href} className="search-result-card reveal delay-2">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
