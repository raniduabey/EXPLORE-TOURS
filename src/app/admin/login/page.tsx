"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Hard redirect to ensure browser carries session cookie immediately
        window.location.href = returnUrl;
      } else {
        setError(data.error || "Authentication failed. Check your credentials.");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = () => {
    setEmail("admin@ceylonexploretours.com");
    setPassword("Admin@CeylonTours2026!");
    setError("");
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-ceylon-navy tracking-tight">
              Administrative Portal
            </h1>
            <p className="text-xs text-ceylon-muted mt-1">
              Secure internal access for {siteConfig.name} operations.
            </p>
          </div>
        </div>

        {/* Credentials Quick Guide */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-ceylon-navy">Admin Access Credentials:</span>
            <button
              type="button"
              onClick={fillQuickCredentials}
              className="text-[11px] font-bold text-ceylon-blue hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
            >
              Auto-Fill
            </button>
          </div>
          <div className="font-mono text-[11px] bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
            <div><span className="text-slate-400">Username/Email:</span> <span className="text-ceylon-navy font-bold">admin@ceylonexploretours.com</span> (or <span className="text-ceylon-blue">admin</span>)</div>
            <div><span className="text-slate-400">Password:</span> <span className="text-ceylon-navy font-bold">Admin@CeylonTours2026!</span> (or <span className="text-ceylon-blue">admin123</span>)</div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ceylon-navy mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-ceylon-blue" />
              <span>Admin Username / Email</span>
            </label>
            <input
              type="text"
              required
              placeholder="admin@ceylonexploretours.com or admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-text focus:outline-none focus:border-ceylon-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ceylon-navy mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-ceylon-blue" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-text focus:outline-none focus:border-ceylon-blue"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-ceylon-navy hover:bg-ceylon-blue text-white text-xs font-extrabold rounded-xl transition-colors shadow flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying authorization...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-ceylon-navy font-semibold transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center text-xs text-slate-400">
          Loading login portal...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
