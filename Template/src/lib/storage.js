const DEMO_STORAGE_KEY = "venture-path-site-demo-db";

function getStore() {
  const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw);
  }

  return {
    contacts: [],
    subscribers: [],
    pricingSelections: [],
    testimonials: [],
  };
}

function setStore(nextStore) {
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextStore));
}

export function pushDemoRecord(table, row) {
  const store = getStore();
  const record = {
    id: `${table}-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...row,
  };

  store[table] = [record, ...(store[table] ?? [])];
  setStore(store);
  return record;
}

export function getDemoRecords(table) {
  const store = getStore();
  return store[table] ?? [];
}
