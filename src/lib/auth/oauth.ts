import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "./redirect-url";
import { setRememberMePreference } from "./session-persistence";

export async function signInWithGoogle(rememberMe: boolean) {
  setRememberMePreference(rememberMe);

  const supabase = createClient();
  const redirectTo = getAuthCallbackUrl();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  return error;
}
