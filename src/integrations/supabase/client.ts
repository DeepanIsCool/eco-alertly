// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zpilaobaxtrpljuqqcyl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwaWxhb2JheHRycGxqdXFxY3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzg0NTEsImV4cCI6MjA1NzkxNDQ1MX0.xN0NI2c0QUqBOurlZfbcVC-8P5qIclUBTpUX3M7L82w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);