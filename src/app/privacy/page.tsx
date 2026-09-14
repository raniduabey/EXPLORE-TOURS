import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Ceylon Explore Tours",
  description: "Privacy policy detailing data protection, SSL security, and user information handling at Ceylon Explore Tours.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-ceylon-blue hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-ceylon-navy rounded-3xl p-8 sm:p-10 text-white space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Data Security & Trust</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-300">
          Last updated: August 28, 2026 • 256-bit SSL Protection
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-sm text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            1. Information We Collect
          </h2>
          <p>
            When you reserve a tour or submit a trip planning inquiry on <strong>Ceylon Explore Tours</strong>, we collect necessary personal details to fulfill your reservation:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full Name, Email Address, and Phone Number (for WhatsApp coordination).</li>
            <li>Travel dates, guest counts, and special dietary or accessibility requests.</li>
            <li>Hotel pickup address or arrival flight details.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            2. Payment Security & Processing
          </h2>
          <p>
            We process payments through Tier-1 PCI-DSS compliant gateways (PayHere, Stripe, and direct bank transfers). We never store your raw credit card numbers or security CVV codes on our servers. All web traffic is strictly encrypted using 256-bit TLS/SSL protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            3. How We Use Your Data
          </h2>
          <p>Your details are used solely to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Generate your official digital tour voucher and QR verification code.</li>
            <li>Coordinate pickup logistics with your licensed chauffeur-guide.</li>
            <li>Send time-sensitive weather or itinerary updates.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            4. Third-Party Sharing
          </h2>
          <p>
            We do not sell, rent, or trade your personal data to third parties. Necessary booking details (name and hotel location) are shared exclusively with certified local tour guides and transport partners assigned to your specific itinerary.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            5. Contact Our Privacy Officer
          </h2>
          <p>
            For privacy inquiries or to request data removal, please contact:<br />
            <strong>Email:</strong> privacy@ceylonexploretours.com / info@ceylonexploretours.com
          </p>
        </section>
      </div>
    </div>
  );
}
