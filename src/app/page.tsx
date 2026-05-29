import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg px-8 py-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            👋
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            You&apos;re in!
          </h1>
          <p className="text-slate-300 mb-6">
            This is your protected homepage — only logged-in users can see it.
          </p>

          <div className="bg-white/5 rounded-lg p-4 mb-8 border border-white/10 text-left">
            <p className="text-sm text-slate-400 mb-1">Logged in as</p>
            <p className="text-lg text-purple-300 font-medium break-all">
              {user.email}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
