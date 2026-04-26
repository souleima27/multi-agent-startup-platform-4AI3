export function PricingSection({ billing, onBillingChange, plans, onPlanSelect }) {
  return (
    <section id="pricing" className="section content-section pricing-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Pricing</p>
        <h2>Simple plans for startups at every stage.</h2>
      </div>

      <div className="billing-toggle reveal">
        <button
          type="button"
          className={billing === "monthly" ? "toggle-option active" : "toggle-option"}
          onClick={() => onBillingChange("monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          className={billing === "yearly" ? "toggle-option active" : "toggle-option"}
          onClick={() => onBillingChange("yearly")}
        >
          Yearly
        </button>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`pricing-card reveal delay-${(index % 3) + 1}${plan.featured ? " featured-plan" : ""}`}
          >
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <div className="price-line">
              <strong>${plan.price}</strong>
              <span>/{billing === "monthly" ? "month" : "year"}</span>
            </div>
            <div className="plan-features">
              {plan.features.map((feature) => (
                <div key={feature} className="plan-feature">
                  {feature}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onPlanSelect(plan)}
              className={plan.featured ? "primary-btn full-width-btn" : "secondary-btn full-width-btn"}
            >
              Get This Plan
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
