import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-ceylon-softblue mx-auto flex items-center justify-center text-ceylon-blue shadow-inner">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "12s" }} />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-ceylon-green uppercase tracking-widest block">
          404 - Page Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-ceylon-navy">
          Looks Like You\'ve Gone Off the Beaten Track
        </h1>
        <p className="text-xs text-ceylon-muted">
          The page or tour destination you are searching for does not exist or has been moved.
        </p>
      </div>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ceylon-navy hover:bg-ceylon-blue text-white font-bold text-xs rounded-xl shadow transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
