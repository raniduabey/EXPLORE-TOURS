"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Compass,
  MapPin,
  Ticket,
  Tag,
  DollarSign,
  TrendingUp,
  Plus,
  Upload,
  Save,
  Trash2,
  Edit2
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export default function AdminPage() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({
    totalRevenue: 14850,
    totalBookings: 84,
    totalTours: 10,
    totalLeads: 18,
  });
  const [slides, setSlides] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [editingDest, setEditingDest] = useState<any>(null);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    try {
      const sRes = await fetch("/api/hero-slides");
      if (sRes.ok) setSlides(await sRes.json());

      const dRes = await fetch("/api/admin/destinations");
      if (dRes.ok) setDestinations(await dRes.json());

      const tRes = await fetch("/api/tours");
      if (tRes.ok) setTours(await tRes.json());

      const bRes = await fetch("/api/user/bookings");
      if (bRes.ok) setBookings(await bRes.json());
    } catch (e) {
      console.error("Admin data fetch error", e);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const formatLKR = (amt: number) => formatCurrency(amt, "LKR");

  const handleFileUpload = async (file: File, target: "slide" | "dest" | "tour") => {
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
        if (target === "slide" && editingSlide) {
          setEditingSlide({ ...editingSlide, image: data.url });
        } else if (target === "dest" && editingDest) {
          setEditingDest({ ...editingDest, image: data.url });
        } else if (target === "tour" && editingTour) {
          setEditingTour({ ...editingTour, primaryImage: data.url });
        }
        setStatusMsg("Image uploaded successfully!");
      } else {
        alert("File upload failed.");
      }
    } catch (e) {
      console.error(e);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const saveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    try {
      const method = editingSlide.id ? "PUT" : "POST";
      const res = await fetch("/api/hero-slides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide),
      });
      if (res.ok) {
        setStatusMsg("Hero slide saved successfully!");
        setEditingSlide(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSlide = async (id: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      try {
        const res = await fetch(`/api/hero-slides?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          setStatusMsg("Slide deleted!");
          loadData();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const saveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDest),
      });
      if (res.ok) {
        setStatusMsg(`Destination "${editingDest.name}" updated!`);
        setEditingDest(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    try {
      const res = await fetch("/api/admin/tours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTour),
      });
      if (res.ok) {
        setStatusMsg(`Tour "${editingTour.title}" updated!`);
        setEditingTour(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-ceylon-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Enterprise Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Ceylon Explore Guide Admin Suite</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-ceylon-green text-white px-3 py-1 rounded-full font-bold">
            Currency: LKR (Rs.)
          </span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full font-mono font-bold">
            Online
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-sm">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg("")} className="text-emerald-900 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "overview", label: "Overview Analytics", icon: LayoutDashboard },
          { id: "slides", label: "Hero Slideshow Manager", icon: ImageIcon },
          { id: "destinations", label: "Destination Photos", icon: MapPin },
          { id: "tours", label: "Tour Catalog & Photos", icon: Compass },
          { id: "bookings", label: "Booking Orders", icon: Ticket },
          { id: "coupons", label: "Coupons & Deals", icon: Tag }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                isActive
                  ? "bg-ceylon-blue text-white shadow"
                  : "bg-white text-ceylon-text border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Total Revenue (LKR)</span>
                <DollarSign className="w-5 h-5 text-ceylon-green" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-ceylon-navy">
                {formatLKR(stats.totalRevenue)}
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Total Bookings</span>
                <Ticket className="w-5 h-5 text-ceylon-blue" />
              </div>
              <div className="text-3xl font-extrabold text-ceylon-navy">
                {bookings.length || stats.totalBookings}
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Verified orders
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Hero Slides</span>
                <ImageIcon className="w-5 h-5 text-ceylon-navy" />
              </div>
              <div className="text-3xl font-extrabold text-ceylon-navy">
                {slides.length} Slides
              </div>
              <span className="text-[11px] text-ceylon-muted">Active Homepage Carousel</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ceylon-muted uppercase">Destinations</span>
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-ceylon-navy">
                {destinations.length} Hubs
              </div>
              <span className="text-[11px] text-ceylon-muted">SEO Landing Pages</span>
            </div>
          </div>
        </div>
      )}

      {tab === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-ceylon-navy">
              Homepage Hero Slideshow Manager ({slides.length})
            </h3>
            <button
              onClick={() =>
                setEditingSlide({
                  tagline: "Explore. Connect. Remember.",
                  headlineLine1: "Discover Sri Lanka",
                  headlineHighlight: "Your Way",
                  subtitle: "Unforgettable island experiences.",
                  image:
                    "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1600&auto=format&fit=crop",
                  destination: "Sigiriya",
                  ctaText: "Explore Tours",
                  ctaLink: "/tours",
                })
              }
              className="px-4 py-2 bg-ceylon-green text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hero Slide</span>
            </button>
          </div>

          {editingSlide && (
            <form
              onSubmit={saveSlide}
              className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-800"
            >
              <h4 className="font-extrabold text-sm text-emerald-400">
                {editingSlide.id ? "Edit Hero Slide" : "Add New Hero Slide"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.tagline || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, tagline: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.destination || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, destination: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Headline Line 1</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.headlineLine1 || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, headlineLine1: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Headline Highlight (Italic/Green)</label>
                  <input
                    type="text"
                    required
                    value={editingSlide.headlineHighlight || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, headlineHighlight: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs text-slate-300 font-bold">
                  Background Image (URL or Upload File from PC)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <input
                    type="text"
                    required
                    value={editingSlide.image || ""}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, image: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <label className="px-4 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload from PC"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], "slide");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitle || ""}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ceylon-green text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> Save Slide
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-100">
                  <Image src={s.image} alt={s.destination} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">{s.tagline}</span>
                    <h4 className="font-extrabold text-sm">
                      {s.headlineLine1} {s.headlineHighlight}
                    </h4>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <p className="text-slate-600 line-clamp-2">{s.subtitle}</p>
                  <p className="font-mono text-[10px] text-slate-400 truncate">
                    Image Path: {s.image}
                  </p>
                </div>
                <div className="px-4 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                    ACTIVE SLIDE
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSlide(s)}
                      className="p-2 bg-slate-100 text-ceylon-blue font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => deleteSlide(s.id)}
                      className="p-2 bg-rose-50 text-rose-600 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "destinations" && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg text-ceylon-navy">
            Destination Cover Image Manager
          </h3>
          {editingDest && (
            <form
              onSubmit={saveDest}
              className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 border border-slate-800"
            >
              <h4 className="font-bold text-sm text-emerald-400">
                Edit Destination: {editingDest.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Destination Name</label>
                  <input
                    type="text"
                    value={editingDest.name}
                    onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Starting Price (USD)</label>
                  <input
                    type="number"
                    value={editingDest.startingPrice}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, startingPrice: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-300 font-bold">
                  Cover Image (URL or Upload File from PC)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={editingDest.image}
                    onChange={(e) => setEditingDest({ ...editingDest, image: e.target.value })}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                  <label className="px-4 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], "dest");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDest(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ceylon-green text-white text-xs font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
              >
                <div className="relative h-40 w-full bg-slate-100">
                  <Image src={d.image} alt={d.name} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-sm text-ceylon-navy">{d.name}</h4>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-ceylon-blue">
                      From ${d.startingPrice}
                    </span>
                    <button
                      onClick={() => setEditingDest(d)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-ceylon-navy text-xs font-bold rounded-lg"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "tours" && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg text-ceylon-navy">
            Tour Catalog & Cover Photos ({tours.length})
          </h3>
          {editingTour && (
            <form
              onSubmit={saveTour}
              className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 border border-slate-800"
            >
              <h4 className="font-bold text-sm text-emerald-400">
                Edit Tour: {editingTour.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tour Title</label>
                  <input
                    type="text"
                    value={editingTour.title}
                    onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={editingTour.price}
                    onChange={(e) => setEditingTour({ ...editingTour, price: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-300 font-bold">
                  Primary Image (URL or Upload File from PC)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={editingTour.primaryImage}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, primaryImage: e.target.value })
                    }
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                  <label className="px-4 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], "tour");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTour(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-ceylon-green text-white text-xs font-bold rounded-xl"
                >
                  Save Tour
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-100">
                  <Image src={t.primaryImage} alt={t.title} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-xs text-ceylon-navy line-clamp-2">
                    {t.title}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-extrabold text-ceylon-blue">
                      ${t.price} USD
                    </span>
                    <button
                      onClick={() => setEditingTour(t)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-ceylon-navy text-xs font-bold rounded-lg"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-ceylon-navy">
            Recent Customer Bookings ({bookings.length})
          </h3>
          {bookings.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
              No orders registered yet. New customer reservations will show up here.
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-ceylon-blue">
                      {b.bookingRef}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {b.paymentStatus}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-ceylon-navy mt-1">
                    {b.guestName} ({b.guestEmail})
                  </h4>
                  <p className="text-xs text-slate-500">
                    {b.tour?.title} • {b.tourDate} at {b.tourTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-ceylon-navy block">
                    ${b.totalAmount} {b.currency}
                  </span>
                  <span className="text-xs text-slate-400">Paid with {b.paymentMethod}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "coupons" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-base text-ceylon-navy">Active Promotional Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                EXPLORE15
              </span>
              <p className="text-xs font-bold text-ceylon-navy pt-1">15% Discount on All Bookings</p>
              <p className="text-[11px] text-slate-400">Available across all experiences</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                CEYLON20
              </span>
              <p className="text-xs font-bold text-ceylon-navy pt-1">$20 USD Instant Discount</p>
              <p className="text-[11px] text-slate-400">Minimum spend $100</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
