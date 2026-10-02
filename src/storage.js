import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function signInWithProvider(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
}

export function getAuthSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signOutAuth() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadShared(key, fallback) {
  const { data, error } = await supabase
    .from("kv_store")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return fallback;
  return data.value;
}

export async function saveShared(key, value) {
  const { error } = await supabase
    .from("kv_store")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) console.error("Supabase save error:", error);
}
export async function checkConnection() {
  const { error } = await supabase.from("kv_store").select("key").limit(1);
  return !error;
}
