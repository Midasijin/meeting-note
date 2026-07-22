import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) return { url: envUrl, key: envKey };
  return {
    url: localStorage.getItem('supabase_url') || '',
    key: localStorage.getItem('supabase_anon_key') || '',
  };
};

// ponytail: singleton to avoid multiple GoTrueClient instances per browser context
let _client = null;
let _clientConfig = '';

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  const configKey = `${url}::${key}`;
  if (_client && _clientConfig === configKey) return _client;

  try {
    _client = createClient(url, key);
    _clientConfig = configKey;
    return _client;
  } catch (e) {
    console.error('Supabase client initialization failed:', e);
    return null;
  }
};
