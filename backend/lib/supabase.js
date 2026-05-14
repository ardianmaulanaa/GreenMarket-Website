const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di .env"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;