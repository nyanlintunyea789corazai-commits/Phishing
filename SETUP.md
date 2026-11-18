# Set up your login for free (Supabase)

Your pages already contain the sign-in, sign-up, forgot-password and members pages.
Supabase stores the accounts and passwords for you. You only need to connect the two.

**What's in this folder**

| File | What it does |
|---|---|
| `index.html` | Sign-in page (your front page) |
| `signup.html` | Create-account page |
| `forgot-password.html` | Sends a reset-password email |
| `update-password.html` | Where the reset email link lands |
| `dashboard.html` | Example members-only page with a Sign out button |
| `supabase-config.js` | **The only file you edit** (two values) |
| `styles.css`, `ui.js` | Shared design and helpers. No need to edit |

Until you finish Step 2, every page runs in demo mode: the forms work but nothing is saved.

---

## Step 1: Create a free Supabase project

1. Go to https://supabase.com and sign up (the Free plan needs no payment card at the time of writing, but check on their pricing page).
2. Click **New project**, give it a name, and choose a region close to your visitors.
3. Wait a minute or two while it sets up.

## Step 2: Connect your pages

1. In your project, click **Connect** at the top (or open **Settings → API Keys**).
2. Copy the **Project URL** and the **Publishable key** (it starts with `sb_publishable_`).
   Older projects call this the "anon" key, which also works.
3. Open `supabase-config.js` and paste them in place of the two `PASTE_...` values.

The publishable key is made to sit in a web page, so it's fine that visitors can see it.
**Never paste a secret key (`sb_secret_...`) or a `service_role` key into these files.**

## Step 3: Tell Supabase your website address

In the dashboard open **Authentication → URL Configuration** (menu names shift a little over time):

- **Site URL**: your website address, for example `https://yourname.pages.dev`.
- **Redirect URLs**: add the addresses of `dashboard.html` and `update-password.html` on your site,
  for example `https://yourname.pages.dev/dashboard.html` and `https://yourname.pages.dev/update-password.html`.
  While testing on your own computer also add `http://localhost:8000/dashboard.html`
  and `http://localhost:8000/update-password.html`.

Without this, the links in confirmation and reset emails won't bring people back to your site.

## Step 4: Email setup (read this, it's the main catch)

Sign-up confirmation and password-reset both send emails. Supabase's built-in email sender is for testing only:

- It only delivers to addresses that belong to members of your Supabase organization.
  Anyone else gets an "Email address not authorized" error.
- It is limited to about 2 emails per hour (Supabase says this can change).

So you have two choices:

**While testing**
- Sign up with your own email (the one on your Supabase account), or
- Turn off **Confirm email** under **Authentication → Sign In / Providers → Email**.
  Then new accounts can sign in straight away. Password reset will still need email.

**For real visitors**
- Connect your own email service under **Authentication → SMTP Settings** ("custom SMTP").
  Supabase's docs list Resend, AWS SES, Postmark, SendGrid, ZeptoMail and Brevo.
  Several of these have a free plan, so check their current limits.

## Step 5: Try it on your computer

Browsers can be strict with files opened by double-clicking, so run a tiny local server.
In this folder, run:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Create an account, sign in, and you should land on the dashboard page.
You can see the new account in Supabase under **Authentication → Users**.

## Step 6: Put it online for free

Upload this whole folder to a free static host. Cloudflare Pages, Netlify and GitHub Pages
all have free plans for simple sites. After it's live, go back to Step 3 and use your real address.

---

## Storing more information (optional)

Accounts are stored automatically. To store extra details per person (a display name, preferences),
open **SQL Editor** in Supabase and run:

```sql
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Update own profile" on public.profiles for update using (auth.uid() = id);
```

The three policies mean each person can only read and change their own row.
From a signed-in page you can then save and read data like this:

```js
const { data: { user } } = await sb.auth.getUser();
await sb.from("profiles").upsert({ id: user.id, display_name: "Nyan" });
const { data } = await sb.from("profiles").select("display_name").single();
```

## Good to know

- **Free plan limits:** 50,000 monthly active users, a 500 MB database, 1 GB file storage, and up to
  2 active projects. Projects pause after 1 week of inactivity; open the dashboard and restore the project
  to wake it up. Check https://supabase.com/pricing for current numbers.
- **Login uses email, not a separate username.** Supabase signs people in with email and password.
  A separate username is possible, but needs the `profiles` table above plus extra code.
- **The dashboard page check is only a convenience.** Someone technical could still open the page's files.
  Your private data is protected by the database rules (row level security) shown above, not by hiding pages.
  Turn row level security on for every table you create.
