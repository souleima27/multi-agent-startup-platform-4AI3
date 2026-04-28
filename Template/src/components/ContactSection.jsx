import { useState } from "react";
import { saveContactSubmission } from "../lib/supabaseService";

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setSubmitting(true);

    try {
      await saveContactSubmission(form);
      setForm({
        name: "",
        email: "",
        subject: "",
        company: "",
        message: "",
      });
      setStatus("Message sent successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-copy reveal">
        <p className="eyebrow">Contact</p>
        <h2>Tell us where you are in your startup journey.</h2>
        <p>
          Tell us about your startup, your idea, or what you want to launch next. We would love to hear where you are
          now and where you want to go.
        </p>
      </div>

      <form className="contact-form reveal delay-1" onSubmit={handleSubmit}>
        <div className="form-row">
          <input value={form.name} onChange={handleChange("name")} type="text" placeholder="Your name" required />
          <input value={form.email} onChange={handleChange("email")} type="email" placeholder="Email address" required />
        </div>
        <div className="form-row">
          <input value={form.company} onChange={handleChange("company")} type="text" placeholder="Startup or project name" />
          <input value={form.subject} onChange={handleChange("subject")} type="text" placeholder="What do you need help with?" required />
        </div>
        <textarea
          value={form.message}
          onChange={handleChange("message")}
          placeholder="Tell us about your idea or your current stage..."
          rows="6"
          required
        />
        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}
