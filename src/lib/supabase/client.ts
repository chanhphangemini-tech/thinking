import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Use the provided Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjlhipvcecziktophjki.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbGhpcHZjZWN6aWt0b3BoamtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MjI3ODMsImV4cCI6MjA5MDk5ODc4M30.aXIUPSObotqmAPM_S6GsMMEMTHcV6JyOe5MO7vuSiPI'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return _supabase
}

// Lazy singleton for client components - returns null if not configured
export function tryGetSupabase(): SupabaseClient | null {
  try {
    return getSupabase()
  } catch {
    return null
  }
}
