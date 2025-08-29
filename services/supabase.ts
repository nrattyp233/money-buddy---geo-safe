import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Hardcode credentials to bypass platform environment variable issues.
const SUPABASE_URL = "https://thdmywgjbhdtgtqnqizn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZG15d2dqYmhkdGd0cW5xaXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzY5ODYsImV4cCI6MjA2OTMxMjk4Nn0.CLUC8eFtRQBHz6-570NJWZ8QIZs3ty0QGuDmEF5eeFc";

// Use a singleton pattern to ensure the client is created only once.
let supabaseInstance: SupabaseClient | null = null;

/**
 * Creates and returns the Supabase client instance.
 */
export const getSupabase = (): SupabaseClient => {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        // This is a safeguard, but with hardcoded values, it should not be triggered.
        throw new Error('Supabase credentials are not set in services/supabase.ts');
    }

    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseInstance;
};
