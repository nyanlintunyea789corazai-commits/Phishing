/* ---------------------------------------------------------------
   The only file you need to edit.

   1. Create a free project at https://supabase.com
   2. In the dashboard, open the "Connect" dialog (or Settings > API Keys)
   3. Paste your Project URL and your Publishable key below.

   The publishable key (starts with sb_publishable_) is designed to sit in a
   web page. NEVER paste a secret key (sb_secret_...) or a service_role key here.
   --------------------------------------------------------------- */
const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";   // e.g. https://abcdefgh.supabase.co
const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE"; // e.g. sb_publishable_...

/* Page names, change them if you rename a file */
const SITE = {
  loginPage:      "index.html",
  signupPage:     "signup.html",
  forgotPage:     "forgot-password.html",
  updatePage:     "update-password.html",
  afterLogin:     "dashboard.html",
};

/* ---- Nothing below here needs editing ---- */
const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_KEY.includes("PASTE_") &&
  SUPABASE_KEY.length > 20;

const sb = isConfigured && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;
