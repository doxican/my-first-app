import { createClient } from "@/lib/supabase/client";
import { setRememberMePreference } from "./session-persistence";

export async function signInWithGoogle(rememberMe: boolean) {
  setRememberMePreference(rememberMe);

  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  return error;
}
