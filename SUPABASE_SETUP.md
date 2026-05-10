# Supabase Setup

Use these values in a local `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://hbsbyryogghqtitwbzzx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

Do not use the direct Postgres connection string in the Expo app. The app is installed on user devices, so anything bundled into it can be inspected.

## Where to Find the Anon Key

1. Open your Supabase project.
2. Go to `Project Settings` -> `API`.
3. Copy `Project URL` and `anon public` key.
4. Create `.env` in this project root and paste them there.

## Database Schema

Run [supabase/schema.sql](D:/Money_Expence_Tracker_MobileApplication/supabase/schema.sql) in the Supabase SQL Editor.

## Disable Email Verification for Immediate Signup

If you want the app to create users and sign them in immediately:

1. Open your Supabase project.
2. Go to `Authentication` -> `Sign In / Providers`.
3. Open `Email`.
4. Turn on the Email provider and allow new users to sign up.
5. Turn off `Confirm email`.
6. Save changes.

Because a database password was shared, rotate the database password in Supabase before using the project seriously:

`Project Settings` -> `Database` -> `Reset database password`
