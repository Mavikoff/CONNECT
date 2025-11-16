import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://ljvxzoxjjldsosammrwz.supabase.co';
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqdnh6b3hqamxkc29zYW1tcnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODY3ODMsImV4cCI6MjA3ODg2Mjc4M30.JNV1K1xeV3u9gQcz1-MNa7QyxtjoWi0nWEl9KeBRQmQ';

export const supabase = createClient(url, anon, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
});


