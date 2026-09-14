import Link from "next/link";
import { ArrowLeft, RotateCcw, CircleCheck, Clock, TriangleAlert } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Refund & Cancellation Policy | Ceylon Explore Tours",
  description: "Free 24-hour cancellation policy, 100% refund terms, weather guarantee, and refund processing procedures.",
};

export default function CancellationPolicyPage() {
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
          <RotateCcw className="w-4 h-4" />
          <span>Frictionless Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-300">
          100% Money-Back Guarantee up to 24 Hours Before Tour Departure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-ceylon-green flex items-center justify-center font-bold">
            <CircleCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-ceylon-navy">Free 24h Cancellation</h3>
          <p className="text-xs text-ceylon-muted">
            Full 100% refund if cancelled at least 24 hours prior to starting time. No questions asked.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-ceylon-blue flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-ceylon-navy">Fast Processing</h3>
          <p className="text-xs text-ceylon-muted">
            Approved refunds are credited back to your original payment method within 3–5 banking business days.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <TriangleAlert className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-sm text-ceylon-navy">Weather Guarantee</h3>
          <p className="text-xs text-ceylon-muted">
            If severe weather shuts down safaris or boat tours, reschedule freely or receive a 100% refund.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-sm text-slate-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            1. Standard Cancellation Policy Timeline
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>24+ Hours Before Tour Departure:</strong> Eligible for a full <strong>100% refund</strong> with no cancellation fees deducted.
            </li>
            <li>
              <strong>Less than 24 Hours Before Tour Departure:</strong> Due to vehicle reservations, dedicated private guide allocations, and advance national park permit purchases, cancellations made within 24 hours are non-refundable.
            </li>
            <li>
              <strong>No-Shows:</strong> If travellers do not arrive at the agreed pickup hotel lobby or meeting point within 30 minutes of the scheduled time without notifying our support team, the tour will be marked as a no-show and is non-refundable.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            2. How to Request a Cancellation or Refund
          </h2>
          <p>You can request a cancellation effortlessly using any of the following methods:</p>
          <ol className="list-decimal pl-5 space-y-1 text-xs font-medium">
            <li>
              Log into your account at{" "}
              <Link href="/account" className="text-ceylon-blue font-bold hover:underline">
                My Bookings
              </Link>{" "}
              and click “Cancel Reservation”.
            </li>
            <li>
              Email our support team at{" "}
              <strong className="text-ceylon-navy">{siteConfig.contact.email}</strong> with your Booking Reference ID (e.g. CET-2026-XXXXX).
            </li>
            <li>
              Message our 24/7 WhatsApp Hotline at{" "}
              <strong className="text-ceylon-green">{siteConfig.contact.phone}</strong>.
            </li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            3. Weather & Safety Cancellations
          </h2>
          <p>
            For marine activities (such as Mirissa Blue Whale Watching) or high-altitude mountain excursions, safety is our top priority. If an activity is cancelled by park authorities or coast guard due to severe weather or unsafe sea conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>You will be offered an immediate alternative date or an alternative activity of equal value.</li>
            <li>
              If no alternative fits your itinerary, you will receive a <strong>100% Full Refund</strong>.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-extrabold text-lg text-ceylon-navy">
            4. Refund Method & Processing Time
          </h2>
          <p>
            Approved refunds are credited back directly to the original payment method used during checkout (PayHere, Stripe, PayPal, Visa, or Mastercard). Processing typically takes between 3 to 5 business days depending on your issuing bank.
          </p>
        </section>
      </div>
    </div>
  );
}
