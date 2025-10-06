// Supabase Configuration
const SUPABASE_URL = 'https://upmuokpdlwnveahatqqo.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbXVva3BkbHdudmVhaGF0cXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTczNjAsImV4cCI6MjA3NTMzMzM2MH0.e6zacpPBUmEAHm5eYLisBZMMBhlj3KpCUc_v6KPdoEM'; // Replace with your Supabase anon key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make Supabase available globally
window.supabaseClient = supabase;