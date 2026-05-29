import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { applyRememberMeToCookieOptions } from "@/lib/auth/session-persistence";
import { getSupabaseKey, getSupabaseUrl } from "./env";

function createServerSupabaseClient(rememberMe = true) {
  const cookieStore = cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(
              name,
              value,
              applyRememberMeToCookieOptions(options ?? {}, rememberMe)
            )
          );
        } catch {
          // setAll called from Server Component — safe to ignore
        }
      },
    },
  });
}

export function createClient() {
  return createServerSupabaseClient(true);
}

/** Used after OAuth redirect so session length matches "Remember me". */
export function createClientWithRememberMe(rememberMe: boolean) {
  return createServerSupabaseClient(rememberMe);
}
