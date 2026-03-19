"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/useAuth";
import { Dumbbell, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@gym.com");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setError(msg.replace("Firebase: ", "").replace(/ \(.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#c8f65d]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#c8f65d]/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-16 h-16 bg-[#c8f65d] rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Dumbbell className="w-8 h-8 text-black" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to GymPro Dashboard</p>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c8f65d]/50 focus:ring-1 focus:ring-[#c8f65d]/20 transition-all"
                placeholder="admin@gym.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c8f65d]/50 focus:ring-1 focus:ring-[#c8f65d]/20 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8f65d] text-black font-semibold py-3 rounded-xl hover:bg-[#d4ff6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-xs text-white/30 text-center">
              Demo credentials pre-filled. Create a Firebase user at{" "}
              <span className="text-[#c8f65d]/60">Firebase Console → Authentication</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
