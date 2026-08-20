// Supabase completely removed from project
export const supabase = {
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  channel: () => ({
    on: function() { return this; },
    subscribe: function() { return this; }
  }),
  removeChannel: () => {}
};
