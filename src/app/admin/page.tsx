"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Ticket,
  Star,
  BookOpen,
  MessageSquare,
  Globe,
  ImageIcon,
  Plus,
  Upload,
  Save,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Copy,
  Calendar,
  Users,
  Layers,
  ArrowRight
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<
    "overview" | "tours" | "bookings" | "reviews" | "destinations" | "blog" | "inquiries" | "content" | "media"
  >("overview");

  // Overview Stats
  const [statsData, setStatsData] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  // Entities Data
  const [tours, setTours] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);

  // Search & Filter States
  const [tourSearch, setTourSearch] = useState("");
  const [tourStatusFilter, setTourStatusFilter] = useState("ALL");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("ALL");

  // Modal / Editing states
  const [editingTour, setEditingTour] = useState<any>(null);
  const [editingDest, setEditingDest] = useState<any>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [rejectingReviewId, setRejectingReviewId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<any>(null);

  // Load all admin data
  async function loadAllData() {
    try {
      const [sRes, tRes, bRes, rRes, dRes, blRes, inqRes, slRes, fRes, mRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/tours"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/reviews"),
        fetch("/api/admin/destinations"),
        fetch("/api/admin/blog"),
        fetch("/api/admin/inquiries"),
        fetch("/api/hero-slides"),
        fetch("/api/admin/content?type=faqs"),
        fetch("/api/admin/upload")
      ]);

      if (sRes.ok) setStatsData(await sRes.json());
      if (tRes.ok) setTours(await tRes.json());
      if (bRes.ok) setBookings(await bRes.json());
      if (rRes.ok) setReviews(await rRes.json());
      if (dRes.ok) setDestinations(await dRes.json());
      if (blRes.ok) setBlogPosts(await blRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (slRes.ok) setSlides(await slRes.json());
      if (fRes.ok) setFaqs(await fRes.json());
      if (mRes.ok) setMediaAssets(await mRes.json());
    } catch (e) {
      console.error("Admin data loading error", e);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (e) {
      window.location.href = "/admin/login";
    }
  };

  // Image upload helper
  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        callback(data.url);
        setStatusMsg("Photograph uploaded successfully to media storage.");
        // refresh media library
        const mRes = await fetch("/api/admin/upload");
        if (mRes.ok) setMediaAssets(await mRes.json());
      } else {
        alert("Photograph upload failed. Ensure image is under 8MB (JPEG, PNG, WebP).");
      }
    } catch (e) {
      alert("Error uploading photograph.");
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------------------------------
  // TOURS ACTIONS
  // ----------------------------------------------------
  const openNewTourForm = () => {
    setEditingTour({
      title: "",
      slug: "",
      location: "Sigiriya, Sri Lanka",
      destinationId: destinations[0]?.id || "",
      categoryId: "",
      duration: "8 Hours",
      durationHours: 8,
      price: 85,
      previousPrice: null,
      adultPrice: 85,
      childPrice: 45,
      tourType: "Private Tour",
      badge: "Popular Experience",
      freeCancellation: true,
      instantBook: true,
      pickupAvailable: true,
      guideIncluded: true,
      liveGuide: "English",
      languages: "English, German & French",
      minTravellers: 1,
      maxTravellers: 12,
      description: "",
      highlights: ["Scale ancient landmarks", "Chauffeur pickup in air-conditioned vehicle"],
      includes: ["Private transportation", "Bottled mineral water", "Certified chauffeur guide"],
      excludes: ["Site entrance tickets", "Gratuities"],
      featured: false,
      status: "PUBLISHED",
      primaryImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
      galleryImages: [],
      itinerary: [
        { stepNumber: 1, title: "Morning Departure & Guided Tour", description: "Pickup from hotel and journey to destination.", location: "Central Province", duration: "4 Hours" }
      ],
    });
  };

  const saveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    try {
      const method = editingTour.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/tours", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTour),
      });
      if (res.ok) {
        setStatusMsg(`Tour package ${editingTour.id ? "updated" : "created"} successfully!`);
        setEditingTour(null);
        loadAllData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save tour package.");
      }
    } catch (e) {
      alert("Error saving tour package.");
    }
  };

  const archiveTour = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to archive "${title}"? It will be removed from sale, but historical bookings will be safely retained.`)) return;
    try {
      const res = await fetch(`/api/admin/tours?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMsg(`Tour "${title}" has been archived.`);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // BOOKINGS ACTIONS
  // ----------------------------------------------------
  const updateBookingStatus = async (id: string, bookingStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, bookingStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (bookingStatus === "COMPLETED" && data.reviewInviteUrl) {
          setStatusMsg(`Booking marked Completed! Single-use review invitation created: ${data.reviewInviteUrl}`);
        } else {
          setStatusMsg(`Booking status updated to ${bookingStatus}`);
        }
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      if (res.ok) {
        setStatusMsg(`Payment status updated to ${paymentStatus}`);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // REVIEWS MODERATION ACTIONS
  // ----------------------------------------------------
  const moderateReview = async (id: string, status: "APPROVED" | "REJECTED" | "HIDDEN", reason?: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, rejectionReason: reason }),
      });
      if (res.ok) {
        setStatusMsg(`Review has been marked ${status}. Public tour rating recalculated.`);
        setRejectingReviewId(null);
        setRejectionReason("");
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // DESTINATIONS ACTIONS
  // ----------------------------------------------------
  const saveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    try {
      const method = editingDest.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/destinations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDest),
      });
      if (res.ok) {
        setStatusMsg("Destination saved successfully!");
        setEditingDest(null);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // BLOG POST ACTIONS
  // ----------------------------------------------------
  const saveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      const method = editingBlog.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBlog),
      });
      if (res.ok) {
        setStatusMsg("Travel guide article saved successfully!");
        setEditingBlog(null);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // INQUIRIES ACTIONS
  // ----------------------------------------------------
  const updateInquiryStatus = async (id: string, status: string, adminNotes?: string) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNotes }),
      });
      if (res.ok) {
        setStatusMsg("Inquiry status updated.");
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------------------------------------------
  // FAQ ACTIONS
  // ----------------------------------------------------
  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "faq", ...editingFaq }),
      });
      if (res.ok) {
        setStatusMsg("FAQ entry saved!");
        setEditingFaq(null);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-ceylon-navy py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Role Badge */}
      <div className="bg-ceylon-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white p-1 border border-white/20 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Ceylon Explore Tours Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Ceylon Explore Tours
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-400/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Secure Operations, Tour Catalog Management & Review Moderation Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow"
          >
            Sign Out
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg("")} className="text-emerald-900 font-extrabold text-sm ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
          { id: "tours", label: "Tour Catalog Manager", icon: Compass },
          { id: "bookings", label: "Bookings & Vouchers", icon: Ticket },
          { id: "reviews", label: "Review Moderation", icon: Star },
          { id: "destinations", label: "Destinations", icon: MapPin },
          { id: "blog", label: "Travel Guides & Blog", icon: BookOpen },
          { id: "inquiries", label: "Inquiries & Leads", icon: MessageSquare },
          { id: "content", label: "FAQs & Website Content", icon: Globe },
          { id: "media", label: "Media Storage", icon: ImageIcon },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-ceylon-blue text-white shadow-md"
                  : "bg-white text-ceylon-text border border-slate-200/90 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.id === "reviews" && (statsData?.reviews?.pending > 0) && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center ml-1">
                  {statsData.reviews.pending}
                </span>
              )}
              {item.id === "inquiries" && (statsData?.inquiries?.new > 0) && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center ml-1">
                  {statsData.inquiries.new}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. OVERVIEW & ANALYTICS TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Real Paid Revenue</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
                ${statsData?.bookings?.totalRevenue || 0} USD
              </div>
              <p className="text-[11px] text-slate-400">From verified paid reservations</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Customer Bookings</span>
                <Ticket className="w-5 h-5 text-ceylon-blue" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
                {statsData?.bookings?.total || 0}
              </div>
              <p className="text-[11px] text-slate-400">
                {statsData?.bookings?.completed || 0} completed • {statsData?.bookings?.pending || 0} pending
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Active Tour Catalog</span>
                <Compass className="w-5 h-5 text-ceylon-green" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
                {statsData?.tours?.published || 0} Published
              </div>
              <p className="text-[11px] text-slate-400">
                {statsData?.tours?.total || 0} total ({statsData?.tours?.draft || 0} draft, {statsData?.tours?.archived || 0} archived)
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Review Moderation</span>
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {statsData?.reviews?.pending || 0} Pending
              </div>
              <p className="text-[11px] text-slate-400">
                {statsData?.reviews?.approved || 0} genuine published reviews
              </p>
            </div>
          </div>

          {/* Monthly Bookings & Volume Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-ceylon-navy">
                  Monthly Booking Volume ({new Date().getFullYear()})
                </h3>
                <p className="text-xs text-ceylon-muted">
                  Strictly calculated from authentic database booking records.
                </p>
              </div>
              <span className="text-xs font-bold text-ceylon-blue bg-ceylon-softblue px-3 py-1 rounded-full">
                Database Verified
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 pt-6 items-end h-48 border-b border-slate-100 pb-2">
              {(statsData?.monthlyVolume || []).map((m: any) => {
                const maxVol = Math.max(...(statsData?.monthlyVolume || []).map((v: any) => v.bookings), 5);
                const heightPct = Math.max(10, Math.round((m.bookings / maxVol) * 100));
                return (
                  <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="text-[10px] font-extrabold text-ceylon-blue">{m.bookings > 0 ? m.bookings : ""}</div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                        m.bookings > 0 ? "bg-ceylon-blue" : "bg-slate-100"
                      }`}
                    />
                    <span className="text-[10px] font-bold text-slate-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Audit Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-ceylon-navy">
              Recent Administrative Audit Trail
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {(statsData?.recentAudit || []).length === 0 ? (
                <p className="text-slate-400 py-4">No audit logs recorded yet.</p>
              ) : (
                (statsData?.recentAudit || []).map((log: any) => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-ceylon-navy">{log.action}</span>
                      <p className="text-slate-500 text-[11px]">{log.details}</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>{log.adminEmail}</div>
                      <div>{new Date(log.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. TOUR CATALOG MANAGER TAB (HIGHEST PRIORITY) */}
      {/* ---------------------------------------------------- */}
      {tab === "tours" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Tour Catalog Management</h2>
              <p className="text-xs text-ceylon-muted">
                Create, edit, publish, or archive tour packages independently without touching source code.
              </p>
            </div>
            <button
              onClick={openNewTourForm}
              className="px-4 py-2.5 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Tour Package</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search packages by title, location, or slug..."
                value={tourSearch}
                onChange={(e) => setTourSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-ceylon-navy focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <select
                value={tourStatusFilter}
                onChange={(e) => setTourStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-ceylon-navy"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Tour Packages Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Tour Package</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tours
                    .filter((t) => {
                      const matchSearch =
                        !tourSearch ||
                        t.title.toLowerCase().includes(tourSearch.toLowerCase()) ||
                        t.location.toLowerCase().includes(tourSearch.toLowerCase());
                      const matchStatus =
                        tourStatusFilter === "ALL" || t.status === tourStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map((tour) => {
                      const primaryImg =
                        tour.images?.find((img: any) => img.isPrimary)?.url ||
                        tour.primaryImage ||
                        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=300&auto=format&fit=crop";
                      return (
                        <tr key={tour.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                <Image
                                  src={primaryImg}
                                  alt={tour.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <span className="font-extrabold text-ceylon-navy block line-clamp-1 max-w-xs">
                                  {tour.title}
                                </span>
                                <span className="text-[11px] text-slate-400 block">
                                  Slug: /{tour.slug}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-600">
                            {tour.destination?.name || tour.location}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-600">
                            {tour.duration}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-ceylon-navy">
                            ${tour.price} USD
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                tour.status === "PUBLISHED"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : tour.status === "DRAFT"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {tour.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {tour.featured ? (
                              <span className="text-emerald-600 font-bold text-xs">★ Yes</span>
                            ) : (
                              <span className="text-slate-400 text-xs">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/tours/${tour.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-ceylon-blue hover:bg-slate-100"
                                title="Preview on live site"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  const primary = tour.images?.find((img: any) => img.isPrimary)?.url;
                                  const gallery = tour.images?.filter((img: any) => !img.isPrimary).map((i: any) => i.url);
                                  let parsedHighlights = [];
                                  let parsedIncludes = [];
                                  let parsedExcludes = [];
                                  try { parsedHighlights = JSON.parse(tour.highlights); } catch (e) { parsedHighlights = [tour.highlights]; }
                                  try { parsedIncludes = JSON.parse(tour.includes); } catch (e) { parsedIncludes = [tour.includes]; }
                                  try { parsedExcludes = JSON.parse(tour.excludes); } catch (e) { parsedExcludes = [tour.excludes]; }

                                  setEditingTour({
                                    ...tour,
                                    primaryImage: primary || tour.primaryImage,
                                    galleryImages: gallery || [],
                                    highlights: parsedHighlights,
                                    includes: parsedIncludes,
                                    excludes: parsedExcludes,
                                    itinerary: tour.itinerary || [],
                                  });
                                }}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-ceylon-blue hover:bg-slate-100"
                                title="Edit Package"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {tour.status !== "ARCHIVED" && (
                                <button
                                  onClick={() => archiveTour(tour.id, tour.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Archive Package"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit / Add Tour Modal */}
          {editingTour && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-ceylon-navy">
                    {editingTour.id ? "Edit Tour Package" : "Create New Tour Package"}
                  </h3>
                  <button
                    onClick={() => setEditingTour(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={saveTour} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                      1. Basic Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">
                          Tour Title *
                        </label>
                        <input
                          type="text"
                          value={editingTour.title}
                          onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">
                          URL Slug (e.g. sigiriya-day-tour)
                        </label>
                        <input
                          type="text"
                          value={editingTour.slug}
                          onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">
                          Location / Region
                        </label>
                        <input
                          type="text"
                          value={editingTour.location}
                          onChange={(e) => setEditingTour({ ...editingTour, location: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">
                          Associated Destination
                        </label>
                        <select
                          value={editingTour.destinationId || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, destinationId: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ceylon-navy"
                        >
                          <option value="">Select Destination...</option>
                          {destinations.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">
                          Duration (e.g. 8 Hours, 2 Days)
                        </label>
                        <input
                          type="text"
                          value={editingTour.duration}
                          onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={4}
                        value={editingTour.description}
                        onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                      2. Pricing & Capacity
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">Base Price ($ USD) *</label>
                        <input
                          type="number"
                          value={editingTour.price}
                          onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-ceylon-navy"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">Adult Price ($)</label>
                        <input
                          type="number"
                          value={editingTour.adultPrice || editingTour.price}
                          onChange={(e) => setEditingTour({ ...editingTour, adultPrice: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">Child Price ($)</label>
                        <input
                          type="number"
                          value={editingTour.childPrice || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, childPrice: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">Discount/Original Price</label>
                        <input
                          type="number"
                          value={editingTour.previousPrice || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, previousPrice: e.target.value ? Number(e.target.value) : null })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                      3. Media & Photographs
                    </h4>
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Primary Featured Image URL *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingTour.primaryImage || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, primaryImage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
                          required
                        />
                        <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ceylon-navy rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, (url) => setEditingTour({ ...editingTour, primaryImage: url }));
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Itinerary Days */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                        4. Itinerary Timeline
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const steps = editingTour.itinerary || [];
                          setEditingTour({
                            ...editingTour,
                            itinerary: [
                              ...steps,
                              {
                                stepNumber: steps.length + 1,
                                title: `Day / Stop ${steps.length + 1}`,
                                description: "",
                                location: "",
                                duration: "",
                              },
                            ],
                          });
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ceylon-navy rounded-lg flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Day / Stop</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingTour.itinerary || []).map((step: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-xs text-ceylon-navy">Day #{step.stepNumber}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingTour.itinerary.filter((_: any, i: number) => i !== idx);
                                setEditingTour({ ...editingTour, itinerary: updated });
                              }}
                              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Title (e.g. Sigiriya Rock Citadel)"
                              value={step.title}
                              onChange={(e) => {
                                const arr = [...editingTour.itinerary];
                                arr[idx].title = e.target.value;
                                setEditingTour({ ...editingTour, itinerary: arr });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={step.location || ""}
                              onChange={(e) => {
                                const arr = [...editingTour.itinerary];
                                arr[idx].location = e.target.value;
                                setEditingTour({ ...editingTour, itinerary: arr });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g. 4 Hours)"
                              value={step.duration || ""}
                              onChange={(e) => {
                                const arr = [...editingTour.itinerary];
                                arr[idx].duration = e.target.value;
                                setEditingTour({ ...editingTour, itinerary: arr });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <textarea
                            placeholder="Detailed activities description for this day..."
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const arr = [...editingTour.itinerary];
                              arr[idx].description = e.target.value;
                              setEditingTour({ ...editingTour, itinerary: arr });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publication Status & Marketing */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                      5. Publication & Marketing
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-ceylon-navy mb-1">Publication Status</label>
                        <select
                          value={editingTour.status}
                          onChange={(e) => setEditingTour({ ...editingTour, status: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-ceylon-navy"
                        >
                          <option value="PUBLISHED">Published</option>
                          <option value="DRAFT">Save as Draft</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id="featuredToggle"
                          checked={editingTour.featured}
                          onChange={(e) => setEditingTour({ ...editingTour, featured: e.target.checked })}
                          className="w-4 h-4 accent-ceylon-blue"
                        />
                        <label htmlFor="featuredToggle" className="text-xs font-bold text-ceylon-navy cursor-pointer">
                          Feature on Homepage
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingTour(null)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold shadow flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Package Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. BOOKINGS & VOUCHERS TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "bookings" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Bookings & Voucher Management</h2>
              <p className="text-xs text-ceylon-muted">
                Track guest reservations, update statuses, view contact details, and issue review invitations.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by reference (CET-...), guest name, or email..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-ceylon-navy focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Booking Status:</span>
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-ceylon-navy"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Tour & Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Booking Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings
                    .filter((b) => {
                      const matchSearch =
                        !bookingSearch ||
                        b.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                        b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                        b.guestEmail.toLowerCase().includes(bookingSearch.toLowerCase());
                      const matchStatus =
                        bookingStatusFilter === "ALL" || b.bookingStatus === bookingStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map((b) => {
                      const invite = b.invitations?.[0];
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-extrabold text-ceylon-blue bg-ceylon-softblue px-2 py-1 rounded">
                              {b.bookingRef}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-ceylon-navy block">{b.guestName}</span>
                            <span className="text-slate-500 text-[11px] block">{b.guestEmail}</span>
                            <span className="text-slate-400 text-[10px] block">{b.guestPhone || "No phone"} • {b.guestCountry}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-ceylon-navy block line-clamp-1 max-w-xs">
                              {b.tour?.title || "Tour Package"}
                            </span>
                            <span className="text-slate-500 text-[11px] block">
                              Date: {b.tourDate} • {b.adults} Adults
                            </span>
                          </td>
                          <td className="py-3 px-4 font-extrabold text-ceylon-navy">
                            ${b.totalAmount} {b.currency || "USD"}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={b.bookingStatus}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border ${
                                b.bookingStatus === "CONFIRMED"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : b.bookingStatus === "COMPLETED"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : b.bookingStatus === "CANCELLED"
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={b.paymentStatus || "PENDING"}
                              onChange={(e) => updatePaymentStatus(b.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                                b.paymentStatus === "PAID" || b.paymentStatus === "CONFIRMED"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : b.paymentStatus === "REFUNDED"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              <option value="UNPAID">UNPAID</option>
                              <option value="PENDING">PENDING</option>
                              <option value="PAID">PAID</option>
                              <option value="REFUNDED">REFUNDED</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.bookingStatus === "COMPLETED" && invite?.token && (
                                <button
                                  onClick={() => {
                                    const link = `${window.location.origin}/review?token=${invite.token}`;
                                    navigator.clipboard.writeText(link);
                                    alert(`Copied single-use Review Invitation link:\n${link}`);
                                  }}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1"
                                  title="Copy single-use Review Invitation link"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Review Invite</span>
                                </button>
                              )}
                              <Link
                                href={`/booking/confirmation/${b.bookingRef}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-ceylon-blue hover:bg-slate-100"
                                title="View Customer Voucher"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. REVIEWS MODERATION TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "reviews" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Customer Review Moderation</h2>
              <p className="text-xs text-ceylon-muted">
                Inspect authentic submissions tied to completed bookings. Moderation ensures zero spam while preserving genuine traveller feedback.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Moderation Status:</span>
            <select
              value={reviewStatusFilter}
              onChange={(e) => setReviewStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-ceylon-navy"
            >
              <option value="ALL">All Reviews</option>
              <option value="PENDING">Pending Moderation ({statsData?.reviews?.pending || 0})</option>
              <option value="APPROVED">Approved & Published ({statsData?.reviews?.approved || 0})</option>
              <option value="REJECTED">Rejected Spam</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>

          <div className="space-y-4">
            {reviews
              .filter((r) => reviewStatusFilter === "ALL" || r.status === reviewStatusFilter)
              .map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-ceylon-navy">{rev.userName}</span>
                        {rev.booking && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Verified Booking: {rev.booking.bookingRef}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            rev.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : rev.status === "PENDING"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          Status: {rev.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {rev.userEmail || "No email"} • {rev.userCountry} • Tour: {rev.tour?.title || "Tour"}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rev.rating) ? "fill-current text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold text-ceylon-navy">{rev.rating} Stars</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {rev.photoUrl && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                        <Image src={rev.photoUrl} alt="Review attachment" fill className="object-cover" />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Customer photo submitted with review</span>
                    </div>
                  )}

                  {rev.rejectionReason && (
                    <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                      <strong>Rejection Reason:</strong> {rev.rejectionReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Submitted on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {rev.status !== "APPROVED" && (
                        <button
                          onClick={() => moderateReview(rev.id, "APPROVED")}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow"
                        >
                          Approve & Publish
                        </button>
                      )}
                      {rev.status !== "REJECTED" && (
                        <button
                          onClick={() => {
                            const reason = prompt("Enter rejection reason (e.g. spam, inappropriate content, promotional link):");
                            if (reason) moderateReview(rev.id, "REJECTED", reason);
                          }}
                          className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold"
                        >
                          Reject as Spam
                        </button>
                      )}
                      {rev.status === "APPROVED" && (
                        <button
                          onClick={() => moderateReview(rev.id, "HIDDEN", "Moderator suppressed")}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                        >
                          Hide
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. DESTINATIONS TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "destinations" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Destination Management</h2>
              <p className="text-xs text-ceylon-muted">
                Configure destinations, accurate location photography, and travel seasons.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingDest({
                  name: "",
                  slug: "",
                  shortDesc: "",
                  longDesc: "",
                  image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
                  startingPrice: 65,
                  popularAttractions: "",
                  bestTimeToVisit: "December to April",
                  featured: true,
                  status: "PUBLISHED",
                })
              }
              className="px-4 py-2 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-base text-ceylon-navy">{dest.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{dest.shortDesc}</p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Best Time: {dest.bestTimeToVisit}
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-xs font-bold text-ceylon-blue">From ${dest.startingPrice} USD</span>
                  <button
                    onClick={() => setEditingDest(dest)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ceylon-navy rounded-xl"
                  >
                    Edit Destination
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingDest && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-ceylon-navy">
                    {editingDest.id ? "Edit Destination" : "Create Destination"}
                  </h3>
                  <button onClick={() => setEditingDest(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <form onSubmit={saveDest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Name *</label>
                    <input
                      type="text"
                      value={editingDest.name}
                      onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Image URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingDest.image}
                        onChange={(e) => setEditingDest({ ...editingDest, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                        required
                      />
                      <label className="px-3 py-2 bg-slate-100 text-xs font-bold rounded-xl cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setEditingDest({ ...editingDest, image: url }));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingDest.shortDesc}
                      onChange={(e) => setEditingDest({ ...editingDest, shortDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Starting Price ($)</label>
                      <input
                        type="number"
                        value={editingDest.startingPrice}
                        onChange={(e) => setEditingDest({ ...editingDest, startingPrice: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Best Travel Season</label>
                      <input
                        type="text"
                        value={editingDest.bestTimeToVisit}
                        onChange={(e) => setEditingDest({ ...editingDest, bestTimeToVisit: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setEditingDest(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-ceylon-blue text-white rounded-xl text-xs font-bold">Save Destination</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. TRAVEL GUIDES & BLOG TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "blog" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Travel Guides & Blog Articles</h2>
              <p className="text-xs text-ceylon-muted">Manage articles with authentic Sri Lankan photographs and travel advice.</p>
            </div>
            <button
              onClick={() =>
                setEditingBlog({
                  title: "",
                  slug: "",
                  excerpt: "",
                  content: "",
                  image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
                  category: "Travel Guides",
                  author: "Ceylon Explore Tours",
                  readTime: "5 min read",
                  featured: true,
                  status: "PUBLISHED",
                })
              }
              className="px-4 py-2 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-ceylon-softblue text-ceylon-blue">
                      {post.category}
                    </span>
                    <h3 className="font-extrabold text-base text-ceylon-navy line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-[11px] text-slate-400">{post.readTime}</span>
                  <button
                    onClick={() => setEditingBlog(post)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ceylon-navy rounded-xl"
                  >
                    Edit Article
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingBlog && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-ceylon-navy">
                    {editingBlog.id ? "Edit Article" : "Create Travel Article"}
                  </h3>
                  <button onClick={() => setEditingBlog(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <form onSubmit={saveBlogPost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Title *</label>
                    <input
                      type="text"
                      value={editingBlog.title}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Cover Image URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingBlog.image}
                        onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                        required
                      />
                      <label className="px-3 py-2 bg-slate-100 text-xs font-bold rounded-xl cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, (url) => setEditingBlog({ ...editingBlog, image: url }));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Excerpt</label>
                    <textarea
                      rows={2}
                      value={editingBlog.excerpt}
                      onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-ceylon-blue text-white rounded-xl text-xs font-bold">Save Article</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. CUSTOMER INQUIRIES TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "inquiries" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Customer Inquiries & Trip Requests</h2>
              <p className="text-xs text-ceylon-muted">Messages received through Contact Form and Custom Trip Planner.</p>
            </div>
          </div>

          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-slate-400">
                No inquiries submitted yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-ceylon-navy">{inq.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800">
                          {inq.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {inq.email} • {inq.phone || "No phone"} • {inq.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-ceylon-navy"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {inq.specialNotes || "General trip inquiry"}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Travel Dates: {inq.travelDates || "Flexible"} • Travelers: {inq.travelers || "1"}</span>
                    <span>Received on {new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 8. FAQS & WEBSITE CONTENT TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "content" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Frequently Asked Questions (FAQ)</h2>
              <p className="text-xs text-ceylon-muted">Edit website FAQs without modifying code.</p>
            </div>
            <button
              onClick={() =>
                setEditingFaq({
                  question: "",
                  answer: "",
                  category: "Booking & Cancellation",
                  orderIndex: faqs.length + 1,
                  active: true,
                })
              }
              className="px-4 py-2 bg-ceylon-green hover:bg-ceylon-darkgreen text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {faq.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-lg"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <h4 className="font-extrabold text-sm text-ceylon-navy">{faq.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {editingFaq && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-ceylon-navy">
                    {editingFaq.id ? "Edit FAQ" : "Create FAQ"}
                  </h3>
                  <button onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <form onSubmit={saveFaq} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Question *</label>
                    <input
                      type="text"
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Answer *</label>
                    <textarea
                      rows={4}
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Category</label>
                    <select
                      value={editingFaq.category}
                      onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="Booking & Payment">Booking & Payment</option>
                      <option value="Cancellation & Refunds">Cancellation & Refunds</option>
                      <option value="Travel & Logistics">Travel & Logistics</option>
                      <option value="Guides & Vehicles">Guides & Vehicles</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setEditingFaq(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-ceylon-blue text-white rounded-xl text-xs font-bold">Save FAQ</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 9. MEDIA STORAGE TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "media" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-ceylon-navy">Media Asset Library</h2>
              <p className="text-xs text-ceylon-muted">Upload and retrieve optimized photographs for tour packages and destinations.</p>
            </div>
            <label className="px-4 py-2.5 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading..." : "Upload New Asset"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, () => {});
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group">
                <div className="relative h-28 w-full bg-slate-100">
                  <Image src={asset.url} alt={asset.title || "Media asset"} fill className="object-cover" />
                </div>
                <div className="p-2.5 space-y-1">
                  <span className="text-[10px] font-bold text-ceylon-navy block truncate" title={asset.filename}>
                    {asset.filename}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(asset.url);
                      alert(`Copied URL:\n${asset.url}`);
                    }}
                    className="w-full py-1 bg-slate-50 hover:bg-ceylon-softblue text-[10px] font-extrabold text-ceylon-blue rounded border border-slate-200 flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
