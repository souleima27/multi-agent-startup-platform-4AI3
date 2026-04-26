import { useEffect, useState } from "react";
import { fallbackTestimonials } from "../data/siteContent";
import { createTestimonial, fetchTestimonials } from "../lib/supabaseService";

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const rows = await fetchTestimonials();
      if (active && rows.length > 0) {
        setTestimonials(rows);
      }
      if (active) {
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const submitReview = async (payload) => {
    setSubmittingReview(true);
    try {
      const review = await createTestimonial(payload);
      setTestimonials((current) => [review, ...current].slice(0, 6));
      return review;
    } finally {
      setSubmittingReview(false);
    }
  };

  return { testimonials, loading, submittingReview, submitReview };
}
