// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://giyrafcdluftiebzefux.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeXJhZmNkbHVmdGllYnplZnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTM1NTAsImV4cCI6MjA1NDg2OTU1MH0.q-W641GF3BFknXB-K4ZAIbEwDFVJ06MxPLj9RmUuOQU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);