import { useState } from "react";

export function TestimonialsSection({ testimonials, loading, onSubmitReview, submittingReview }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
  });
  const [message, setMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await onSubmitReview({
        name: form.name,
        role: form.role,
        quote: form.quote,
        rating: Number(form.rating),
        approved: false,
      });

      setForm({
        name: "",
        role: "",
        quote: "",
        rating: 5,
      });
      setMessage("Review submitted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section id="testimonials" className="section content-section testimonials-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Testimonials</p>
        <h2>What founders and startup supporters say.</h2>
      </div>

      <div className="testimonials-grid">
        {(loading ? [] : testimonials).map((item, index) => (
          <article key={item.id ?? item.name} className={`testimonial-card reveal delay-${(index % 3) + 1}`}>
            <p className="quote">"{item.quote}"</p>
            <strong>{item.name}</strong>
            <span>{item.role}</span>
          </article>
        ))}
      </div>

      <form className="review-form reveal delay-2" onSubmit={handleSubmit}>
        <div className="section-heading compact-heading">
          <p className="eyebrow">Share Your Experience</p>
          <h2>Tell others how this support helped you.</h2>
        </div>

        <div className="form-row">
          <input value={form.name} onChange={handleChange("name")} type="text" placeholder="Your name" required />
          <input value={form.role} onChange={handleChange("role")} type="text" placeholder="Your role" required />
        </div>
        <div className="form-row">
          <select value={form.rating} onChange={handleChange("rating")} className="select-field">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
          </select>
        </div>
        <textarea
          value={form.quote}
          onChange={handleChange("quote")}
          rows="4"
          placeholder="Share your experience..."
          required
        />
        <button type="submit" className="primary-btn" disabled={submittingReview}>
          {submittingReview ? "Sending..." : "Submit Review"}
        </button>
        {message && <p className="form-status">{message}</p>}
      </form>
    </section>
  );
}
