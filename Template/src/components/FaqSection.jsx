import { useState } from "react";

export function FaqSection({ faqs }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="section content-section faq-section">
      <div className="section-heading reveal">
        <p className="eyebrow">FAQ</p>
        <h2>Questions founders and teams often ask.</h2>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openFaq === index;
          return (
            <article key={item.question} className={`faq-item reveal delay-${(index % 3) + 1}${isOpen ? " open" : ""}`}>
              <button type="button" className="faq-question" onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                <span>{item.question}</span>
                <strong>{isOpen ? "-" : "+"}</strong>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
