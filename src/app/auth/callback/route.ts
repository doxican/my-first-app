import {
  REMEMBER_ME_HINT_COOKIE,
  parseRememberMeHint,
} from "@/lib/auth/session-persistence";
import { createClientWithRememberMe } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const rememberMe = parseRememberMeHint(
    request.cookies.get(REMEMBER_ME_HINT_COOKIE)?.value
  );

  if (code) {
    const supabase = createClientWithRememberMe(rememberMe);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(origin);
      response.cookies.delete(REMEMBER_ME_HINT_COOKIE);
      return response;
    }
  }

  const response = NextResponse.redirect(`${origin}/login`);
  response.cookies.delete(REMEMBER_ME_HINT_COOKIE);
  return response;
}
