import { fallbackTestimonials } from "../data/siteContent";
import { getClient, isSupabaseConfigured } from "./supabaseClient";
import { getDemoRecords, pushDemoRecord } from "./storage";

export { isSupabaseConfigured } from "./supabaseClient";

async function insertOrFallback(table, payload) {
  if (!isSupabaseConfigured) {
    return pushDemoRecord(table, payload);
  }

  const client = getClient();
  const { data, error } = await client.from(table).insert(payload).select().single();
  if (error) {
    throw error;
  }

  return data;
}

export async function saveContactSubmission(payload) {
  return insertOrFallback("contact_submissions", payload);
}

export async function saveNewsletterSubscription(payload) {
  return insertOrFallback("newsletter_subscribers", payload);
}

export async function savePricingSelection(payload) {
  return insertOrFallback("pricing_selections", payload);
}

export async function createTestimonial(payload) {
  return insertOrFallback("testimonials", payload);
}

export async function fetchTestimonials() {
  if (!isSupabaseConfigured) {
    return [...getDemoRecords("testimonials"), ...fallbackTestimonials];
  }

  const client = getClient();
  const { data, error } = await client
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return fallbackTestimonials;
  }

  return data.length > 0 ? data : fallbackTestimonials;
}
