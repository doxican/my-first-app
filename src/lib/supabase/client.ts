import { createBrowserClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";
import {
  applyRememberMeToCookieOptions,
  getRememberMeFromStorage,
} from "@/lib/auth/session-persistence";
import { getSupabaseKey, getSupabaseUrl } from "./env";

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseKey(), {
    cookies: {
      getAll() {
        // Client components are pre-rendered on the server — no `document` there
        if (typeof document === "undefined") {
          return [];
        }
        const parsed = parse(document.cookie);
        return Object.keys(parsed).map((name) => ({
          name,
          value: parsed[name] ?? "",
        }));
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") {
          return;
        }
        const rememberMe = getRememberMeFromStorage();
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = serialize(
            name,
            value,
            applyRememberMeToCookieOptions(options ?? {}, rememberMe)
          );
        });
      },
    },
  });
}
