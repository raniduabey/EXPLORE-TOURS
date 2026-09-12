import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Ceylon Explore Guide",
  description: "Terms and conditions governing tour bookings, local guide agreements, and platform usage with Ceylon Explore Guide.",
};

export default function TermsPage() {
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
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-300">
          Last updated: August 28, 2026 • Ceylon Explore Guide (SLTDA Registered Operator)
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-sm text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            1. Introduction & Acceptance
          </h2>
          <p>
            Welcome to <strong>Ceylon Explore Guide</strong> (“we”, “our”, “us”). By accessing our website, booking tours, or utilizing our trip planning services, you agree to comply with and be bound by these Terms and Conditions. These terms apply to all visitors, registered users, and guests who book activities across Sri Lanka through our marketplace platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            2. Booking & Instant Confirmation Vouchers
          </h2>
          <p>
            All tour reservations made through Ceylon Explore Guide are subject to availability. Upon successful payment authorization via our authorized payment gateways (PayHere, Stripe, PayPal, Credit Card), an official digital QR-coded voucher will be issued to your designated email address.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>You must present your digital voucher or printed PDF voucher to your assigned local guide/chauffeur upon pickup.</li>
            <li>Pricing is guaranteed at the time of confirmed booking in your selected transaction currency.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            3. Traveller Conduct & Safety Standards
          </h2>
          <p>
            Travellers are expected to respect local customs, religious sanctuaries, and wildlife habitats in Sri Lanka.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong>Temple Etiquette:</strong> Modest attire covering shoulders and knees is strictly mandatory when visiting Buddhist and Hindu sacred sites (e.g., Dambulla Cave Temple, Kandy Tooth Temple). Shoes must be removed before entering temple compounds.
            </li>
            <li>
              <strong>Wildlife Safety:</strong> During Yala, Udawalawe, or Minneriya safaris, travellers must remain inside 4x4 safari vehicles at all times and follow safety instructions issued by certified park trackers.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            4. Pricing, Payments & Taxes
          </h2>
          <p>
            Prices displayed include all mandatory government service charges and local taxes unless explicitly specified under the “What\'s Excluded” section of an individual tour listing (such as optional personal entrance tickets or driver tips).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            5. Contact Information
          </h2>
          <p>
            If you have any questions regarding these Terms & Conditions, please contact our support team at:<br />
            <strong>Email:</strong> support@ceylonexploreguide.com<br />
            <strong>Hotline:</strong> +94 77 123 4567 (24/7 Support)
          </p>
        </section>
      </div>
    </div>
  );
}
