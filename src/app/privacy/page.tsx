import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Ceylon Explore Guide",
  description: "Privacy policy detailing data protection, SSL security, and user information handling at Ceylon Explore Guide.",
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
            When you reserve a tour or submit a trip planning inquiry on <strong>Ceylon Explore Guide</strong>, we collect necessary personal details to fulfill your reservation:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Full Name, Email Address, Phone/WhatsApp Number, and Country of Residence.</li>
            <li>Hotel Name and Pickup Address for chauffeur pickup coordination.</li>
            <li>Special requests (such as dietary needs or infant car seat requirements).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            2. Payment Security & Card Data Policy
          </h2>
          <p>
            <strong>We NEVER store unencrypted or raw credit/debit card numbers on our servers.</strong>
          </p>
          <p>
            All online transactions are tokenized and processed securely by PCIDSS-compliant payment gateways (PayHere Sri Lanka, Stripe, PayPal). Payment data transmission is encrypted using standard 256-bit SSL (Secure Sockets Layer) technology.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            3. How We Use Your Information
          </h2>
          <p>Your personal information is strictly used to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Generate official digital QR booking vouchers and confirmation emails.</li>
            <li>Coordinate driver/guide pickup logistics in Sri Lanka.</li>
            <li>Provide 24/7 customer support via email or WhatsApp.</li>
            <li>Send travel inspiration newsletters (only if explicitly opted-in).</li>
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
            <strong>Email:</strong> privacy@ceylonexploreguide.com
          </p>
        </section>
      </div>
    </div>
  );
}
