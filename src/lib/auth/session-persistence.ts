import type { SerializeOptions } from "cookie";

export const REMEMBER_ME_STORAGE_KEY = "auth-remember-me";
export const REMEMBER_ME_HINT_COOKIE = "auth-remember-me";

const PERSISTENT_MAX_AGE = 400 * 24 * 60 * 60; // matches Supabase SSR default

/** Read preference in the browser (default: remember). */
export function getRememberMeFromStorage(): boolean {
  if (typeof window === "undefined") return true;
  const value = localStorage.getItem(REMEMBER_ME_STORAGE_KEY);
  if (value === null) return true;
  return value === "1";
}

/** Save preference for client cookies + OAuth callback (server reads hint cookie). */
export function setRememberMePreference(rememberMe: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMEMBER_ME_STORAGE_KEY, rememberMe ? "1" : "0");
  document.cookie = `${REMEMBER_ME_HINT_COOKIE}=${rememberMe ? "1" : "0"}; path=/; max-age=600; samesite=lax`;
}

export function parseRememberMeHint(cookieValue: string | undefined): boolean {
  return cookieValue !== "0";
}

/** Long-lived cookie when remembered; session cookie when not (clears on browser close). */
export function applyRememberMeToCookieOptions(
  options: SerializeOptions,
  rememberMe: boolean
): SerializeOptions {
  const base: SerializeOptions = {
    path: "/",
    sameSite: "lax",
    ...options,
  };

  if (rememberMe) {
    return {
      ...base,
      maxAge: base.maxAge ?? PERSISTENT_MAX_AGE,
    };
  }

  return {
    path: base.path,
    sameSite: base.sameSite,
    httpOnly: base.httpOnly,
    secure: base.secure,
    domain: base.domain,
    partitioned: base.partitioned,
    priority: base.priority,
  };
}
