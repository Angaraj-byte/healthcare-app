import { createClient } from '@supabase/supabase-js';

// During Next.js pre-rendering or Vercel builds, env variables might not be loaded.
// Falling back to validly formatted placeholder URLs prevents build-time compilation crashes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eodhlhjpupqhbfjbagru.supabase.co/rest/v1/';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGhsaGpwdXBxaGJmamJhZ3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDk5MzgsImV4cCI6MjA5NTUyNTkzOH0.eRtk6Ac00C386cs4qWUEJrDJj4xh4Oi7asiVEPmszBwy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);