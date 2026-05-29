"use client";

import AuthDivider from "@/components/auth/auth-divider";
import GoogleSignInButton from "@/components/auth/google-sign-in-button";
import { signInWithGoogle } from "@/lib/auth/oauth";
import { getAuthCallbackUrl } from "@/lib/auth/redirect-url";
import {
  getRememberMeFromStorage,
  setRememberMePreference,
} from "@/lib/auth/session-persistence";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRememberMe(getRememberMeFromStorage());
  }, []);

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    setRememberMePreference(checked);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const error = await signInWithGoogle(rememberMe);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRememberMePreference(rememberMe);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-slate-300">
            We sent a confirmation link to <span className="text-purple-400 font-medium">{email}</span>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create an account
        </h1>
        <p className="text-slate-300 text-center mb-8">
          Get started for free
        </p>

        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          disabled={loading}
          label="Sign up with Google"
        />

        <AuthDivider text="or sign up with email" />

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="••••••••  (min. 6 characters)"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => handleRememberMeChange(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span className="text-sm text-slate-300">Remember me</span>
          </label>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-lg transition duration-200 ease-in-out"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
