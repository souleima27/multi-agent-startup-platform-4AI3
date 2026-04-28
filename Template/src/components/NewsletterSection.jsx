import { useState } from "react";
import { saveNewsletterSubscription } from "../lib/supabaseService";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setSubmitting(true);

    try {
      await saveNewsletterSubscription({ email });
      setEmail("");
      setStatus("Subscribed successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="section content-section newsletter-section">
      <div className="newsletter-card reveal">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h2>Get simple founder tips, launch ideas, and encouragement in your inbox.</h2>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            required
          />
          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "Joining..." : "Subscribe"}
          </button>
        </form>
        {status && <p className="form-status">{status}</p>}
      </div>
    </section>
  );
}
