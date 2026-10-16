"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Info,
  BookOpen,
  ImageIcon,
  Sparkles,
  Calendar,
  Compass,
  Globe,
  Upload,
  FolderOpen,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface DestinationEditorModalProps {
  editingDest: any;
  setEditingDest: (dest: any) => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  tours: any[];
  handleFileUpload: (file: File, cb: (url: string) => void) => Promise<any>;
  uploading: boolean;
  setMediaPickerTarget: (target: "tourPrimary" | "tourGallery" | "destCover" | "destBanner" | null) => void;
}

export function DestinationEditorModal({
  editingDest,
  setEditingDest,
  onSave,
  onClose,
  tours,
  handleFileUpload,
  uploading,
  setMediaPickerTarget,
}: DestinationEditorModalProps) {
  const [activeTab, setActiveTab] = useState<
    "basic" | "about" | "media" | "attractions" | "overview" | "tours" | "seo"
  >("basic");

  const tabs = [
    { id: "basic", label: "1. Basic Info", icon: Info },
    { id: "about", label: "2. About Destination", icon: BookOpen },
    { id: "media", label: "3. Banner & Media", icon: ImageIcon },
    { id: "attractions", label: "4. Top Attractions", icon: Sparkles },
    { id: "overview", label: "5. Travel Overview", icon: Calendar },
    { id: "tours", label: "6. Related Tours", icon: Compass },
    { id: "seo", label: "7. SEO Settings", icon: Globe },
  ] as const;

  const relatedTours = tours.filter((t) => t.destinationId === editingDest.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-luxury-forest text-luxury-gold text-[10px] font-mono font-bold uppercase tracking-wider">
                Destination CMS
              </span>
              {editingDest.status && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    editingDest.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {editingDest.status}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-ceylon-navy">
              {editingDest.id ? `Edit Destination: ${editingDest.name || "Untitled"}` : "Create New Destination"}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* 7 Structured Tabs Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
          {tabs.map((tabItem) => {
            const IconComp = tabItem.icon;
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setActiveTab(tabItem.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? "bg-ceylon-navy text-white shadow-sm ring-1 ring-ceylon-navy"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-ceylon-navy border border-slate-200/80"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={onSave} className="space-y-6">
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  1. Core Destination Profile
                </h4>
                <span className="text-[11px] text-slate-400">Public regional parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    value={editingDest.name || ""}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoSlug = !editingDest.id && !editingDest.slug
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                        : editingDest.slug;
                      setEditingDest({ ...editingDest, name, slug: autoSlug });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                    placeholder="e.g. Sigiriya & Cultural Triangle"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={editingDest.slug || ""}
                    onChange={(e) => setEditingDest({ ...editingDest, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    placeholder="e.g. sigiriya"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Starting Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editingDest.startingPrice ?? 65}
                    onChange={(e) => setEditingDest({ ...editingDest, startingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-ceylon-navy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Short Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={editingDest.shortDesc || ""}
                    onChange={(e) => setEditingDest({ ...editingDest, shortDesc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700"
                    placeholder="e.g. Ancient 5th-century UNESCO palace in the sky surrounded by water gardens."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Publication Status</label>
                  <select
                    value={editingDest.status || "PUBLISHED"}
                    onChange={(e) => setEditingDest({ ...editingDest, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-ceylon-navy"
                  >
                    <option value="PUBLISHED">Published (Visible on site)</option>
                    <option value="DRAFT">Save as Draft (Admin only)</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="destFeaturedToggle"
                    checked={Boolean(editingDest.featured)}
                    onChange={(e) => setEditingDest({ ...editingDest, featured: e.target.checked })}
                    className="w-4 h-4 accent-ceylon-blue rounded"
                  />
                  <label htmlFor="destFeaturedToggle" className="text-xs font-bold text-ceylon-navy cursor-pointer">
                    Feature on Homepage destination slider
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT DESTINATION */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  2. About Destination Story & Rich Guide
                </h4>
                <span className="text-[11px] text-slate-400">Full editorial destination content</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  About Section Heading
                </label>
                <input
                  type="text"
                  value={editingDest.gallery?.aboutHeading || `About ${editingDest.name || "the Destination"}`}
                  onChange={(e) => {
                    setEditingDest({
                      ...editingDest,
                      gallery: {
                        ...(editingDest.gallery || {}),
                        aboutHeading: e.target.value,
                      },
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-ceylon-navy"
                  placeholder="e.g. About Sigiriya & The Royal Rock Citadel"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  Full Destination Narrative & Historical Guide (Rich Text)
                </label>
                <RichTextEditor
                  value={editingDest.longDesc || editingDest.shortDesc || ""}
                  onChange={(val) => setEditingDest({ ...editingDest, longDesc: val })}
                  placeholder="Write the in-depth story, cultural heritage, and travel highlights of this destination..."
                  minHeight="220px"
                />
              </div>
            </div>
          )}

          {/* TAB 3: BANNER & MEDIA */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  3. Destination Photography & Banners
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set the primary destination card photo and the immersive wide panoramic hero banner.
                </p>
              </div>

              {/* Cover Card Photo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ceylon-navy">
                    Featured Cover Photo (Catalog Cards) *
                  </label>
                  <span className="text-[10px] text-slate-400">Used on destination grid</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-inner">
                    {editingDest.image ? (
                      <Image
                        src={editingDest.image}
                        alt="Destination cover"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={editingDest.image || ""}
                      onChange={(e) => setEditingDest({ ...editingDest, image: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
                      placeholder="Image URL..."
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow transition-colors">
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload Cover</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileUpload(file, (url) => setEditingDest({ ...editingDest, image: url }));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("destCover")}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Banner Photo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ceylon-navy">
                    Destination Wide Hero Banner
                  </label>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Recommended: 1920 × 1080 px
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-inner">
                    {editingDest.thumbnail || editingDest.image ? (
                      <Image
                        src={editingDest.thumbnail || editingDest.image}
                        alt="Destination banner"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No Banner
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={editingDest.thumbnail || ""}
                      onChange={(e) => setEditingDest({ ...editingDest, thumbnail: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
                      placeholder="Banner image URL (defaults to cover if empty)..."
                    />
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow transition-colors">
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileUpload(file, (url) => setEditingDest({ ...editingDest, thumbnail: url }));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("destBanner")}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Media Library</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOP HIGHLIGHTS & ATTRACTIONS */}
          {activeTab === "attractions" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                    4. Top Highlights & Attractions
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage key attractions, historical monuments, and optional links to tour packages.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(editingDest.popularAttractions)
                      ? [...editingDest.popularAttractions]
                      : [];
                    current.push({
                      id: `attr-${Date.now()}`,
                      name: "New Landmark",
                      description: "Brief overview of this iconic landmark or sanctuary.",
                      tourSlug: "",
                      active: true,
                    });
                    setEditingDest({ ...editingDest, popularAttractions: current });
                  }}
                  className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Attraction Tag</span>
                </button>
              </div>

              <div className="space-y-3">
                {(Array.isArray(editingDest.popularAttractions) ? editingDest.popularAttractions : []).map(
                  (attr: any, idx: number) => (
                    <div
                      key={attr.id || idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        attr.active !== false
                          ? "bg-slate-50/80 border-slate-200"
                          : "bg-slate-100/50 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-extrabold text-xs text-ceylon-navy">
                          Attraction #{idx + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx > 0) {
                                const arr = [...editingDest.popularAttractions];
                                const temp = arr[idx];
                                arr[idx] = arr[idx - 1];
                                arr[idx - 1] = temp;
                                setEditingDest({ ...editingDest, popularAttractions: arr });
                              }
                            }}
                            className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === editingDest.popularAttractions.length - 1}
                            onClick={() => {
                              if (idx < editingDest.popularAttractions.length - 1) {
                                const arr = [...editingDest.popularAttractions];
                                const temp = arr[idx];
                                arr[idx] = arr[idx + 1];
                                arr[idx + 1] = temp;
                                setEditingDest({ ...editingDest, popularAttractions: arr });
                              }
                            }}
                            className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const arr = editingDest.popularAttractions.filter((_: any, i: number) => i !== idx);
                              setEditingDest({ ...editingDest, popularAttractions: arr });
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                            Attraction Name *
                          </label>
                          <input
                            type="text"
                            value={attr.name || ""}
                            onChange={(e) => {
                              const arr = [...editingDest.popularAttractions];
                              arr[idx].name = e.target.value;
                              setEditingDest({ ...editingDest, popularAttractions: arr });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-ceylon-navy"
                            placeholder="e.g. Sigiriya Rock Fortress"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                            Link to Tour Slug (Optional)
                          </label>
                          <input
                            type="text"
                            value={attr.tourSlug || ""}
                            onChange={(e) => {
                              const arr = [...editingDest.popularAttractions];
                              arr[idx].tourSlug = e.target.value;
                              setEditingDest({ ...editingDest, popularAttractions: arr });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
                            placeholder="e.g. sigiriya-day-tour"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                            Attraction Description / Key Highlight
                          </label>
                          <input
                            type="text"
                            value={attr.description || ""}
                            onChange={(e) => {
                              const arr = [...editingDest.popularAttractions];
                              arr[idx].description = e.target.value;
                              setEditingDest({ ...editingDest, popularAttractions: arr });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
                            placeholder="e.g. 5th-century UNESCO palace citadel with preserved frescoes and mirror wall."
                          />
                        </div>

                        <div className="sm:col-span-2 pt-1">
                          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={attr.active !== false}
                              onChange={(e) => {
                                const arr = [...editingDest.popularAttractions];
                                arr[idx].active = e.target.checked;
                                setEditingDest({ ...editingDest, popularAttractions: arr });
                              }}
                              className="w-4 h-4 accent-ceylon-blue rounded"
                            />
                            <span>Show this attraction tag on public destination page</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* TAB 5: TRAVEL OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  5. Travel Overview & Tips
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure seasonal travel notes, verified experiences count text, and custom CTA button.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={editingDest.bestTimeToVisit || "December to April"}
                    onChange={(e) => setEditingDest({ ...editingDest, bestTimeToVisit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-ceylon-navy font-semibold"
                    placeholder="e.g. December to April (Dry Season)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Curated Experiences Subtitle Note
                  </label>
                  <input
                    type="text"
                    value={editingDest.gallery?.curatedExperiencesText || ""}
                    onChange={(e) => {
                      setEditingDest({
                        ...editingDest,
                        gallery: {
                          ...(editingDest.gallery || {}),
                          curatedExperiencesText: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700"
                    placeholder="e.g. 5 Verified Private Day Tours & Safaris"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Curator Tips & Climate Recommendations
                  </label>
                  <textarea
                    rows={3}
                    value={editingDest.gallery?.travelTips || ""}
                    onChange={(e) => {
                      setEditingDest({
                        ...editingDest,
                        gallery: {
                          ...(editingDest.gallery || {}),
                          travelTips: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700"
                    placeholder="e.g. Best climbed at sunrise (06:30 AM) to experience cooler breezes and golden photography lighting. Chauffeur pickup included."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Custom Itinerary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={editingDest.gallery?.customButtonText || `Plan Custom Itinerary for ${editingDest.name || "Destination"}`}
                    onChange={(e) => {
                      setEditingDest({
                        ...editingDest,
                        gallery: {
                          ...(editingDest.gallery || {}),
                          customButtonText: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ceylon-navy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RELATED TOUR PACKAGES */}
          {activeTab === "tours" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                    6. Associated Tour Packages
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tour packages in your catalog associated with this destination.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-ceylon-blue bg-ceylon-softblue px-2.5 py-1 rounded-full">
                  {relatedTours.length} Attached Tours
                </span>
              </div>

              {relatedTours.length > 0 ? (
                <div className="space-y-2.5">
                  {relatedTours.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                          <Image
                            src={t.images?.[0]?.url || t.primaryImage || "/images/destinations/sigiriya.jpg"}
                            alt={t.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-ceylon-navy block">{t.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /{t.slug} • ${t.price} USD • {t.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            t.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {t.status}
                        </span>
                        <Link
                          href={`/tours/${t.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-ceylon-blue hover:bg-white"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                  No tours currently associated with this destination. You can assign this destination when editing any tour in the Tour Catalog.
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SEO SETTINGS */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  7. Destination Search Engine Optimization (SEO)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure search engine title, meta description, and social preview cards.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={editingDest.seoTitle || ""}
                  onChange={(e) => setEditingDest({ ...editingDest, seoTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ceylon-navy"
                  placeholder={`${editingDest.name || "Destination"} Tours & Travel Guide | Ceylon Explore Tours`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ceylon-navy mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={editingDest.seoDescription || ""}
                  onChange={(e) => setEditingDest({ ...editingDest, seoDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700"
                  placeholder="Summary of this Sri Lanka destination shown on search engine result pages..."
                />
              </div>

              {/* SERP Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Google Search Snippet Preview
                </span>
                <div className="font-sans text-[#1a0dab] text-sm font-medium line-clamp-1">
                  {editingDest.seoTitle || `${editingDest.name || "Destination"} Tours & Travel Guide | Ceylon Explore Tours`}
                </div>
                <div className="text-[#006621] text-xs font-sans line-clamp-1">
                  https://ceylonexploretours.com/destinations/{editingDest.slug || "destination-slug"}
                </div>
                <div className="text-[#545454] text-xs font-sans line-clamp-2">
                  {editingDest.seoDescription || editingDest.shortDesc || "Explore Sri Lanka destinations with private chauffeur guides and luxury tailor-made itineraries."}
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const tabKeys = tabs.map((t) => t.id);
                  const curIdx = tabKeys.indexOf(activeTab);
                  if (curIdx > 0) setActiveTab(tabKeys[curIdx - 1]);
                }}
                disabled={activeTab === "basic"}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                ← Previous Tab
              </button>
              <button
                type="button"
                onClick={() => {
                  const tabKeys = tabs.map((t) => t.id);
                  const curIdx = tabKeys.indexOf(activeTab);
                  if (curIdx < tabKeys.length - 1) setActiveTab(tabKeys[curIdx + 1]);
                }}
                disabled={activeTab === "seo"}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                Next Tab →
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold shadow flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Destination</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
