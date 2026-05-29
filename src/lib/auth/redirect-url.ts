/**
 * URL users return to after email confirmation or OAuth.
 * On the live site this must be https://miris-first-app.vercel.app/auth/callback
 * (also whitelisted in Supabase → Authentication → URL Configuration).
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}
