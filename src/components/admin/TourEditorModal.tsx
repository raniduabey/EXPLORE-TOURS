"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Info,
  DollarSign,
  Clock,
  Sparkles,
  Award,
  Calendar,
  CheckCircle,
  ImageIcon,
  Ticket,
  Globe,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  MoveLeft,
  MoveRight,
  Camera,
  FolderOpen,
  Loader2,
  Save,
  XCircle,
  Star,
  Upload,
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { DynamicIcon, AVAILABLE_TOUR_ICONS } from "@/components/common/DynamicIcon";

interface TourEditorModalProps {
  editingTour: any;
  setEditingTour: (tour: any) => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  destinations: any[];
  handleFileUpload: (file: File, cb: (url: string) => void) => Promise<any>;
  handleMultipleTourFiles: (files: FileList, cb: (urls: string[]) => void) => Promise<any>;
  uploading: boolean;
  tourGalleryUploadProgress: { current: number; total: number } | null;
  isDraggingTourGallery: boolean;
  setIsDraggingTourGallery: (dragging: boolean) => void;
  setMediaPickerTarget: (target: "tourPrimary" | "tourGallery" | "destCover" | "destBanner" | null) => void;
}

export function TourEditorModal({
  editingTour,
  setEditingTour,
  onSave,
  onClose,
  destinations,
  handleFileUpload,
  handleMultipleTourFiles,
  uploading,
  tourGalleryUploadProgress,
  isDraggingTourGallery,
  setIsDraggingTourGallery,
  setMediaPickerTarget,
}: TourEditorModalProps) {
  const [activeTab, setActiveTab] = useState<
    "basic" | "pricing" | "icons" | "curator" | "signature" | "itinerary" | "inclusions" | "media" | "booking" | "seo"
  >("basic");
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState("");

  const tabs = [
    { id: "basic", label: "1. Basic Info", icon: Info },
    { id: "pricing", label: "2. Pricing & Capacity", icon: DollarSign },
    { id: "icons", label: "3. Info Bar & Icons", icon: Clock },
    { id: "curator", label: "4. Curator Highlights", icon: Sparkles },
    { id: "signature", label: "5. Signature Experiences", icon: Award },
    { id: "itinerary", label: "6. Itinerary Builder", icon: Calendar },
    { id: "inclusions", label: "7. Included & Excluded", icon: CheckCircle },
    { id: "media", label: "8. Media & Gallery", icon: ImageIcon },
    { id: "booking", label: "9. Booking Settings", icon: Ticket },
    { id: "seo", label: "10. SEO Settings", icon: Globe },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-luxury-forest text-luxury-gold text-[10px] font-mono font-bold uppercase tracking-wider">
                Tour Package CMS
              </span>
              {editingTour.status && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    editingTour.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {editingTour.status}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-ceylon-navy">
              {editingTour.id ? `Edit Tour: ${editingTour.title || "Untitled"}` : "Create New Tour Package"}
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

        {/* 10 Structured Tabs Navigation Bar */}
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
                  1. Core Journey Information
                </h4>
                <span className="text-[11px] text-slate-400">Essential public catalog attributes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Tour Title *
                  </label>
                  <input
                    type="text"
                    value={editingTour.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const autoSlug = !editingTour.id && !editingTour.slug
                        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                        : editingTour.slug;
                      setEditingTour({ ...editingTour, title, slug: autoSlug });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                    placeholder="e.g. Sigiriya Rock Citadel & Minneriya Safari Tour"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    URL Slug (Identifier)
                  </label>
                  <input
                    type="text"
                    value={editingTour.slug || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    placeholder="sigiriya-rock-citadel-tour"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Location / Region
                  </label>
                  <input
                    type="text"
                    value={editingTour.location || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    placeholder="e.g. Cultural Triangle, Sri Lanka"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                  >
                    <option value="">Select Destination...</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Duration Display (e.g. 8 Hours, 2 Days)
                  </label>
                  <input
                    type="text"
                    value={editingTour.duration || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Duration in Hours (Numeric)
                  </label>
                  <input
                    type="number"
                    value={editingTour.durationHours || 8}
                    onChange={(e) => setEditingTour({ ...editingTour, durationHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Journey Type
                  </label>
                  <input
                    type="text"
                    value={editingTour.tourType || "Private Tour"}
                    onChange={(e) => setEditingTour({ ...editingTour, tourType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    placeholder="e.g. Private Tour, Bespoke Safari"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Tour Overview & Full Description
                  </label>
                  <RichTextEditor
                    value={editingTour.description || ""}
                    onChange={(val) => setEditingTour({ ...editingTour, description: val })}
                    placeholder="Provide a luxurious and engaging overview of this tour experience..."
                    minHeight="180px"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Publication Status</label>
                  <select
                    value={editingTour.status || "PUBLISHED"}
                    onChange={(e) => setEditingTour({ ...editingTour, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-ceylon-navy"
                  >
                    <option value="PUBLISHED">Published (Live on Website)</option>
                    <option value="DRAFT">Save as Draft (Admin Only)</option>
                    <option value="ARCHIVED">Archived (Retired)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={Boolean(editingTour.featured)}
                    onChange={(e) => setEditingTour({ ...editingTour, featured: e.target.checked })}
                    className="w-4 h-4 accent-ceylon-blue rounded"
                  />
                  <label htmlFor="featuredToggle" className="text-xs font-bold text-ceylon-navy cursor-pointer">
                    Feature this journey on Homepage & Highlights
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & CAPACITY */}
          {activeTab === "pricing" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  2. Pricing Tiers & Group Capacity
                </h4>
                <span className="text-[11px] text-slate-400">All prices in USD ($)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Base Price ($ USD) *</label>
                  <input
                    type="number"
                    value={editingTour.price ?? 85}
                    onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-ceylon-navy focus:outline-none focus:border-ceylon-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Adult Price ($ USD)</label>
                  <input
                    type="number"
                    value={editingTour.adultPrice ?? editingTour.price ?? 85}
                    onChange={(e) => setEditingTour({ ...editingTour, adultPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Child Price ($ USD)</label>
                  <input
                    type="number"
                    value={editingTour.childPrice ?? ""}
                    onChange={(e) => setEditingTour({ ...editingTour, childPrice: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Original Price (Discount Strikethrough)</label>
                  <input
                    type="number"
                    value={editingTour.previousPrice ?? ""}
                    onChange={(e) => setEditingTour({ ...editingTour, previousPrice: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                    placeholder="e.g. 110"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Minimum Travellers</label>
                  <input
                    type="number"
                    value={editingTour.minTravellers || 1}
                    onChange={(e) => setEditingTour({ ...editingTour, minTravellers: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">Maximum Travellers (Group Limit)</label>
                  <input
                    type="number"
                    value={editingTour.maxTravellers || 12}
                    onChange={(e) => setEditingTour({ ...editingTour, maxTravellers: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOUR INFORMATION & HIGHLIGHTS ICONS */}
          {activeTab === "icons" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                    3. Tour Information & Highlights Bar
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Edit the key information items displayed in the prominent horizontal bar beneath the tour photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(editingTour.badge) ? [...editingTour.badge] : [];
                    current.push({
                      id: `info-${Date.now()}`,
                      label: "Custom Highlight",
                      value: "Private Journey",
                      icon: "Sparkles",
                      enabled: true,
                    });
                    setEditingTour({ ...editingTour, badge: current });
                  }}
                  className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Information Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {(Array.isArray(editingTour.badge) ? editingTour.badge : []).map((item: any, idx: number) => (
                  <div
                    key={item.id || idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      item.enabled !== false
                        ? "bg-slate-50/80 border-slate-200"
                        : "bg-slate-100/50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {/* Reorder and preview icon */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx > 0) {
                                const arr = [...editingTour.badge];
                                const temp = arr[idx];
                                arr[idx] = arr[idx - 1];
                                arr[idx - 1] = temp;
                                setEditingTour({ ...editingTour, badge: arr });
                              }
                            }}
                            className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-ceylon-blue disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === editingTour.badge.length - 1}
                            onClick={() => {
                              if (idx < editingTour.badge.length - 1) {
                                const arr = [...editingTour.badge];
                                const temp = arr[idx];
                                arr[idx] = arr[idx + 1];
                                arr[idx + 1] = temp;
                                setEditingTour({ ...editingTour, badge: arr });
                              }
                            }}
                            className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-ceylon-blue disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                          <DynamicIcon icon={item.icon} className="w-5 h-5 text-luxury-gold" />
                        </div>
                      </div>

                      {/* Icon Dropdown */}
                      <div className="w-full sm:w-44 shrink-0">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                          Lucide Icon
                        </label>
                        <select
                          value={item.icon || "Sparkles"}
                          onChange={(e) => {
                            const arr = [...editingTour.badge];
                            arr[idx].icon = e.target.value;
                            setEditingTour({ ...editingTour, badge: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-ceylon-navy"
                        >
                          {AVAILABLE_TOUR_ICONS.map((ic) => (
                            <option key={ic.id} value={ic.id}>
                              {ic.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Label input */}
                      <div className="flex-1 w-full sm:w-auto">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                          Label (Title)
                        </label>
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.badge];
                            arr[idx].label = e.target.value;
                            setEditingTour({ ...editingTour, badge: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-ceylon-navy font-bold"
                          placeholder="e.g. Duration"
                        />
                      </div>

                      {/* Value input */}
                      <div className="flex-1 w-full sm:w-auto">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-0.5">
                          Display Value
                        </label>
                        <input
                          type="text"
                          value={item.value || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.badge];
                            arr[idx].value = e.target.value;
                            setEditingTour({ ...editingTour, badge: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
                          placeholder="e.g. 10 Hours"
                        />
                      </div>

                      {/* Visibility Toggle and Remove */}
                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pt-2 sm:pt-4">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.enabled !== false}
                            onChange={(e) => {
                              const arr = [...editingTour.badge];
                              arr[idx].enabled = e.target.checked;
                              setEditingTour({ ...editingTour, badge: arr });
                            }}
                            className="w-4 h-4 accent-ceylon-blue rounded"
                          />
                          <span>Show</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            const arr = editingTour.badge.filter((_: any, i: number) => i !== idx);
                            setEditingTour({ ...editingTour, badge: arr });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CURATOR'S HIGHLIGHTS */}
          {activeTab === "curator" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                    4. Curator&apos;s Highlights Section
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hand-selected tour moments showcased in the dark-green luxury card.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-ceylon-navy cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTour.highlights?.enabled !== false}
                      onChange={(e) => {
                        setEditingTour({
                          ...editingTour,
                          highlights: {
                            ...(editingTour.highlights || {}),
                            enabled: e.target.checked,
                          },
                        });
                      }}
                      className="w-4 h-4 accent-ceylon-blue rounded"
                    />
                    <span>Enable Section</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingTour.highlights || { title: "Curator's Highlights", subtitle: "", items: [] };
                      const items = Array.isArray(cur.items) ? [...cur.items] : [];
                      items.push({
                        id: `h-${Date.now()}`,
                        text: "Exclusive moment handpicked for guests",
                        icon: "Sparkles",
                      });
                      setEditingTour({
                        ...editingTour,
                        highlights: { ...cur, items },
                      });
                    }}
                    className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Highlight</span>
                  </button>
                </div>
              </div>

              {/* Header controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={editingTour.highlights?.title || "Curator's Highlights"}
                    onChange={(e) => {
                      setEditingTour({
                        ...editingTour,
                        highlights: {
                          ...(editingTour.highlights || {}),
                          title: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-ceylon-navy font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Subtitle / Introductory Text
                  </label>
                  <input
                    type="text"
                    value={editingTour.highlights?.subtitle || ""}
                    onChange={(e) => {
                      setEditingTour({
                        ...editingTour,
                        highlights: {
                          ...(editingTour.highlights || {}),
                          subtitle: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                    placeholder="e.g. Signature moments hand-selected by our private travel curators"
                  />
                </div>
              </div>

              {/* Highlights Items */}
              <div className="space-y-2.5">
                {((editingTour.highlights?.items) || []).map((h: any, idx: number) => (
                  <div
                    key={h.id || idx}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx > 0) {
                            const items = [...editingTour.highlights.items];
                            const temp = items[idx];
                            items[idx] = items[idx - 1];
                            items[idx - 1] = temp;
                            setEditingTour({
                              ...editingTour,
                              highlights: { ...editingTour.highlights, items },
                            });
                          }
                        }}
                        className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === editingTour.highlights.items.length - 1}
                        onClick={() => {
                          if (idx < editingTour.highlights.items.length - 1) {
                            const items = [...editingTour.highlights.items];
                            const temp = items[idx];
                            items[idx] = items[idx + 1];
                            items[idx + 1] = temp;
                            setEditingTour({
                              ...editingTour,
                              highlights: { ...editingTour.highlights, items },
                            });
                          }
                        }}
                        className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <select
                      value={h.icon || "Sparkles"}
                      onChange={(e) => {
                        const items = [...editingTour.highlights.items];
                        items[idx].icon = e.target.value;
                        setEditingTour({
                          ...editingTour,
                          highlights: { ...editingTour.highlights, items },
                        });
                      }}
                      className="w-36 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-ceylon-navy shrink-0"
                    >
                      {AVAILABLE_TOUR_ICONS.map((ic) => (
                        <option key={ic.id} value={ic.id}>
                          {ic.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={h.text || ""}
                      onChange={(e) => {
                        const items = [...editingTour.highlights.items];
                        items[idx].text = e.target.value;
                        setEditingTour({
                          ...editingTour,
                          highlights: { ...editingTour.highlights, items },
                        });
                      }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
                      placeholder="Describe this highlight moment..."
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const items = editingTour.highlights.items.filter((_: any, i: number) => i !== idx);
                        setEditingTour({
                          ...editingTour,
                          highlights: { ...editingTour.highlights, items },
                        });
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SIGNATURE EXPERIENCES */}
          {activeTab === "signature" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                    5. Signature Experiences Included
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Rich cards detailing bespoke moments included in this package.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-ceylon-navy cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTour.whatToBring?.enabled !== false}
                      onChange={(e) => {
                        setEditingTour({
                          ...editingTour,
                          whatToBring: {
                            ...(editingTour.whatToBring || {}),
                            enabled: e.target.checked,
                          },
                        });
                      }}
                      className="w-4 h-4 accent-ceylon-blue rounded"
                    />
                    <span>Enable Section</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingTour.whatToBring || { heading: "Signature Experiences Included", subtitle: "", experiences: [] };
                      const experiences = Array.isArray(cur.experiences) ? [...cur.experiences] : [];
                      experiences.push({
                        id: `exp-${Date.now()}`,
                        title: "Private Wildlife Tracking",
                        description: "Track leopards and elephants alongside a senior national park ranger in an open 4x4 safari vehicle.",
                        icon: "Binoculars",
                        tag: "VIP Experience",
                      });
                      setEditingTour({
                        ...editingTour,
                        whatToBring: { ...cur, experiences },
                      });
                    }}
                    className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience Card</span>
                  </button>
                </div>
              </div>

              {/* Header controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={editingTour.whatToBring?.heading || "Signature Experiences Included"}
                    onChange={(e) => {
                      setEditingTour({
                        ...editingTour,
                        whatToBring: {
                          ...(editingTour.whatToBring || {}),
                          heading: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-ceylon-navy font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingTour.whatToBring?.subtitle || ""}
                    onChange={(e) => {
                      setEditingTour({
                        ...editingTour,
                        whatToBring: {
                          ...(editingTour.whatToBring || {}),
                          subtitle: e.target.value,
                        },
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700"
                    placeholder="e.g. Exclusive moments reserved for private Ceylon journeys"
                  />
                </div>
              </div>

              {/* Experience Cards List */}
              <div className="space-y-3">
                {((editingTour.whatToBring?.experiences) || []).map((exp: any, idx: number) => (
                  <div
                    key={exp.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-extrabold text-xs text-ceylon-navy">
                        Experience #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx > 0) {
                              const arr = [...editingTour.whatToBring.experiences];
                              const temp = arr[idx];
                              arr[idx] = arr[idx - 1];
                              arr[idx - 1] = temp;
                              setEditingTour({
                                ...editingTour,
                                whatToBring: { ...editingTour.whatToBring, experiences: arr },
                              });
                            }
                          }}
                          className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === editingTour.whatToBring.experiences.length - 1}
                          onClick={() => {
                            if (idx < editingTour.whatToBring.experiences.length - 1) {
                              const arr = [...editingTour.whatToBring.experiences];
                              const temp = arr[idx];
                              arr[idx] = arr[idx + 1];
                              arr[idx + 1] = temp;
                              setEditingTour({
                                ...editingTour,
                                whatToBring: { ...editingTour.whatToBring, experiences: arr },
                              });
                            }
                          }}
                          className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const arr = editingTour.whatToBring.experiences.filter((_: any, i: number) => i !== idx);
                            setEditingTour({
                              ...editingTour,
                              whatToBring: { ...editingTour.whatToBring, experiences: arr },
                            });
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">Title</label>
                        <input
                          type="text"
                          value={exp.title || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.whatToBring.experiences];
                            arr[idx].title = e.target.value;
                            setEditingTour({
                              ...editingTour,
                              whatToBring: { ...editingTour.whatToBring, experiences: arr },
                            });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-ceylon-navy"
                          placeholder="Experience Title"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">Tag / Badge</label>
                        <input
                          type="text"
                          value={exp.tag || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.whatToBring.experiences];
                            arr[idx].tag = e.target.value;
                            setEditingTour({
                              ...editingTour,
                              whatToBring: { ...editingTour.whatToBring, experiences: arr },
                            });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                          placeholder="e.g. VIP Access, Bespoke"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">Icon</label>
                        <select
                          value={exp.icon || "Sparkles"}
                          onChange={(e) => {
                            const arr = [...editingTour.whatToBring.experiences];
                            arr[idx].icon = e.target.value;
                            setEditingTour({
                              ...editingTour,
                              whatToBring: { ...editingTour.whatToBring, experiences: arr },
                            });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-ceylon-navy"
                        >
                          {AVAILABLE_TOUR_ICONS.map((ic) => (
                            <option key={ic.id} value={ic.id}>
                              {ic.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">Description</label>
                      <textarea
                        rows={2}
                        value={exp.description || ""}
                        onChange={(e) => {
                          const arr = [...editingTour.whatToBring.experiences];
                          arr[idx].description = e.target.value;
                          setEditingTour({
                            ...editingTour,
                            whatToBring: { ...editingTour.whatToBring, experiences: arr },
                          });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                        placeholder="Describe the exclusive nature of this experience..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DETAILED TOUR ITINERARY BUILDER */}
          {activeTab === "itinerary" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                    6. Detailed Itinerary Builder
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Build day-by-day journeys or time-based single day schedules with rich text formatting.
                  </p>
                </div>

                <div className="flex items-center gap-2">
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
                            title: `Day ${steps.length + 1}: Landmark Discovery`,
                            description: "Rich description of activities and experiences for this part of the journey.",
                            location: "",
                            duration: "Full Day",
                            accommodation: "",
                            meals: "",
                          },
                        ],
                      });
                    }}
                    className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Multi-Day Step</span>
                  </button>

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
                            title: "07:00 AM - Chauffeur Pickup",
                            description: "Private air-conditioned pickup from your hotel lobby.",
                            location: "Hotel Pickup",
                            duration: "30 Mins",
                            accommodation: "",
                            meals: "",
                          },
                        ],
                      });
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Add Day-Tour Time Slot</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(editingTour.itinerary || []).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-ceylon-navy text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-extrabold text-xs text-ceylon-navy">
                          Step / Day #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx > 0) {
                              const arr = [...editingTour.itinerary];
                              const temp = arr[idx];
                              arr[idx] = arr[idx - 1];
                              arr[idx - 1] = temp;
                              arr.forEach((it: any, i: number) => (it.stepNumber = i + 1));
                              setEditingTour({ ...editingTour, itinerary: arr });
                            }
                          }}
                          className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === editingTour.itinerary.length - 1}
                          onClick={() => {
                            if (idx < editingTour.itinerary.length - 1) {
                              const arr = [...editingTour.itinerary];
                              const temp = arr[idx];
                              arr[idx] = arr[idx + 1];
                              arr[idx + 1] = temp;
                              arr.forEach((it: any, i: number) => (it.stepNumber = i + 1));
                              setEditingTour({ ...editingTour, itinerary: arr });
                            }
                          }}
                          className="p-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const arr = editingTour.itinerary.filter((_: any, i: number) => i !== idx);
                            arr.forEach((it: any, i: number) => (it.stepNumber = i + 1));
                            setEditingTour({ ...editingTour, itinerary: arr });
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                          Title (e.g. Day 1: Sigiriya Citadel or 07:00 AM Pickup) *
                        </label>
                        <input
                          type="text"
                          value={step.title || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.itinerary];
                            arr[idx].title = e.target.value;
                            setEditingTour({ ...editingTour, itinerary: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-ceylon-navy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                          Duration (e.g. 4 Hours / Full Day)
                        </label>
                        <input
                          type="text"
                          value={step.duration || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.itinerary];
                            arr[idx].duration = e.target.value;
                            setEditingTour({ ...editingTour, itinerary: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          placeholder="e.g. 4 Hours"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                          Location / Destination
                        </label>
                        <input
                          type="text"
                          value={step.location || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.itinerary];
                            arr[idx].location = e.target.value;
                            setEditingTour({ ...editingTour, itinerary: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          placeholder="e.g. Central Province"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                          Accommodation (Multi-Day Only)
                        </label>
                        <input
                          type="text"
                          value={step.accommodation || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.itinerary];
                            arr[idx].accommodation = e.target.value;
                            setEditingTour({ ...editingTour, itinerary: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          placeholder="e.g. Heritance Kandalama (5-Star)"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                          Meals Included
                        </label>
                        <input
                          type="text"
                          value={step.meals || ""}
                          onChange={(e) => {
                            const arr = [...editingTour.itinerary];
                            arr[idx].meals = e.target.value;
                            setEditingTour({ ...editingTour, itinerary: arr });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          placeholder="e.g. Breakfast & Dinner Included"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                        Detailed Activities Description (Rich Text)
                      </label>
                      <RichTextEditor
                        value={step.description || ""}
                        onChange={(val) => {
                          const arr = [...editingTour.itinerary];
                          arr[idx].description = val;
                          setEditingTour({ ...editingTour, itinerary: arr });
                        }}
                        placeholder="Describe the day's itinerary, activities, historical stops, and transfer notes..."
                        minHeight="110px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INCLUSIONS & EXCLUSIONS */}
          {activeTab === "inclusions" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  7. What&apos;s Included & What&apos;s Excluded
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Manage the luxury inclusion and exclusion lists with live checkmark and cancellation previews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What's Included Column */}
                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>What&apos;s Included</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {(editingTour.includes || []).length} items
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(editingTour.includes || []).map((inc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-100 shadow-2xl/5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={inc}
                          onChange={(e) => {
                            const arr = [...editingTour.includes];
                            arr[idx] = e.target.value;
                            setEditingTour({ ...editingTour, includes: arr });
                          }}
                          className="flex-1 bg-transparent text-xs text-slate-700 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const arr = editingTour.includes.filter((_: any, i: number) => i !== idx);
                            setEditingTour({ ...editingTour, includes: arr });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Type item and press Enter..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          if (target.value.trim()) {
                            const arr = editingTour.includes || [];
                            setEditingTour({
                              ...editingTour,
                              includes: [...arr, target.value.trim()],
                            });
                            target.value = "";
                          }
                        }
                      }}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-emerald-700/70 block mt-1">
                      Press Enter to add new inclusion item.
                    </span>
                  </div>
                </div>

                {/* What's Excluded Column */}
                <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-rose-900 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>What&apos;s Excluded</span>
                    </span>
                    <span className="text-[11px] font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      {(editingTour.excludes || []).length} items
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(editingTour.excludes || []).map((exc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-rose-100 shadow-2xl/5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <input
                          type="text"
                          value={exc}
                          onChange={(e) => {
                            const arr = [...editingTour.excludes];
                            arr[idx] = e.target.value;
                            setEditingTour({ ...editingTour, excludes: arr });
                          }}
                          className="flex-1 bg-transparent text-xs text-slate-700 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const arr = editingTour.excludes.filter((_: any, i: number) => i !== idx);
                            setEditingTour({ ...editingTour, excludes: arr });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Type item and press Enter..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          if (target.value.trim()) {
                            const arr = editingTour.excludes || [];
                            setEditingTour({
                              ...editingTour,
                              excludes: [...arr, target.value.trim()],
                            });
                            target.value = "";
                          }
                        }
                      }}
                      className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-[10px] text-rose-700/70 block mt-1">
                      Press Enter to add new exclusion item.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MEDIA & PHOTO GALLERY */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>8. Media & Photographs (Primary + Tour Gallery)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage the prominent hero photograph and the rich interactive gallery collection for this journey.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
                  Total Photos: <strong className="text-ceylon-navy font-bold">{1 + (editingTour.galleryImages || []).length}</strong>
                </span>
              </div>

              {/* Primary Featured Image Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ceylon-navy flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Primary Featured / Cover Image *</span>
                  </label>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Used on Tour Cards & Public Hero
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-inner">
                    {editingTour.primaryImage ? (
                      <Image
                        src={editingTour.primaryImage}
                        alt="Featured tour cover"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                        No Cover Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Enter image URL or upload below..."
                      value={editingTour.primaryImage || ""}
                      onChange={(e) => setEditingTour({ ...editingTour, primaryImage: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-ceylon-blue"
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 bg-ceylon-navy hover:bg-ceylon-blue text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow transition-colors">
                        {uploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploading ? "Uploading..." : "Upload New Cover"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileUpload(file, (url) => {
                                setEditingTour({ ...editingTour, primaryImage: url });
                              });
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget("tourPrimary")}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Select from Media Library</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Gallery Collection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ceylon-navy flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-ceylon-blue" />
                    <span>Tour Photo Gallery Collection</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget("tourGallery")}
                    className="text-xs text-ceylon-blue hover:underline font-bold flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Pick Existing from Library</span>
                  </button>
                </div>

                {/* Multiple File Drag & Drop Upload Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingTourGallery(true);
                  }}
                  onDragLeave={() => setIsDraggingTourGallery(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDraggingTourGallery(false);
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      await handleMultipleTourFiles(files, (newUrls) => {
                        const existing = editingTour.galleryImages || [];
                        setEditingTour({
                          ...editingTour,
                          galleryImages: [...existing, ...newUrls],
                        });
                      });
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-colors ${
                    isDraggingTourGallery
                      ? "border-ceylon-blue bg-ceylon-softblue/30"
                      : "border-slate-300 bg-white hover:border-ceylon-blue/60"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-ceylon-blue mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ceylon-navy">
                      Drag & Drop Multiple Photographs Here or Browse
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Strict 8 MB max per image • JPEG, PNG, WebP, AVIF • Select multiple files at once
                    </p>
                  </div>

                  <label className="px-4 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow cursor-pointer transition-colors inline-flex items-center gap-1.5">
                    {uploading && tourGalleryUploadProgress ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {uploading && tourGalleryUploadProgress
                        ? `Uploading (${tourGalleryUploadProgress.current}/${tourGalleryUploadProgress.total})...`
                        : "Browse & Upload Multiple Photos"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={uploading}
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          await handleMultipleTourFiles(files, (newUrls) => {
                            const existing = editingTour.galleryImages || [];
                            setEditingTour({
                              ...editingTour,
                              galleryImages: [...existing, ...newUrls],
                            });
                          });
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL input bar */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste an image URL to add directly..."
                    value={newGalleryUrlInput}
                    onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newGalleryUrlInput.trim()) {
                          const existing = editingTour.galleryImages || [];
                          setEditingTour({
                            ...editingTour,
                            galleryImages: [...existing, newGalleryUrlInput.trim()],
                          });
                          setNewGalleryUrlInput("");
                        }
                      }
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newGalleryUrlInput.trim()) {
                        const existing = editingTour.galleryImages || [];
                        setEditingTour({
                          ...editingTour,
                          galleryImages: [...existing, newGalleryUrlInput.trim()],
                        });
                        setNewGalleryUrlInput("");
                      }
                    }}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    Add URL
                  </button>
                </div>

                {/* Thumbnails Grid */}
                {(editingTour.galleryImages || []).length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Current Gallery Collection ({editingTour.galleryImages.length} photos):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {editingTour.galleryImages.map((imgUrl: string, idx: number) => (
                        <div
                          key={`${imgUrl}-${idx}`}
                          className="relative group rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm aspect-[4/3] flex flex-col justify-between"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-black/70 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            #{idx + 1}
                          </div>

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const oldPrimary = editingTour.primaryImage;
                                  const newGallery = [...editingTour.galleryImages];
                                  newGallery.splice(idx, 1);
                                  if (oldPrimary) newGallery.unshift(oldPrimary);
                                  setEditingTour({
                                    ...editingTour,
                                    primaryImage: imgUrl,
                                    galleryImages: newGallery,
                                  });
                                }}
                                className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-extrabold rounded shadow flex items-center gap-0.5"
                                title="Set as featured cover"
                              >
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Feature</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx > 0) {
                                      const arr = [...editingTour.galleryImages];
                                      const temp = arr[idx];
                                      arr[idx] = arr[idx - 1];
                                      arr[idx - 1] = temp;
                                      setEditingTour({ ...editingTour, galleryImages: arr });
                                    }
                                  }}
                                  className="p-1 bg-white/90 hover:bg-white text-slate-800 rounded disabled:opacity-30"
                                >
                                  <MoveLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === editingTour.galleryImages.length - 1}
                                  onClick={() => {
                                    if (idx < editingTour.galleryImages.length - 1) {
                                      const arr = [...editingTour.galleryImages];
                                      const temp = arr[idx];
                                      arr[idx] = arr[idx + 1];
                                      arr[idx + 1] = temp;
                                      setEditingTour({ ...editingTour, galleryImages: arr });
                                    }
                                  }}
                                  className="p-1 bg-white/90 hover:bg-white text-slate-800 rounded disabled:opacity-30"
                                >
                                  <MoveRight className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const arr = editingTour.galleryImages.filter((_: any, i: number) => i !== idx);
                                  setEditingTour({ ...editingTour, galleryImages: arr });
                                }}
                                className="p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs">
                    No additional gallery photos added yet. Upload or browse multiple photos above to build an immersive tour gallery.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: BOOKING SETTINGS */}
          {activeTab === "booking" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  9. Booking, Chauffeur & Cancellation Settings
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure customer checkout features, guide options, and guest policies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-extrabold text-xs text-ceylon-navy block">Checkout Options</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-ceylon-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTour.instantBook !== false}
                        onChange={(e) => setEditingTour({ ...editingTour, instantBook: e.target.checked })}
                        className="w-4 h-4 accent-ceylon-blue rounded"
                      />
                      <span>Instant Booking Confirmation</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-ceylon-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTour.freeCancellation !== false}
                        onChange={(e) => setEditingTour({ ...editingTour, freeCancellation: e.target.checked })}
                        className="w-4 h-4 accent-ceylon-blue rounded"
                      />
                      <span>Free Cancellation Policy</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-ceylon-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTour.pickupAvailable !== false}
                        onChange={(e) => setEditingTour({ ...editingTour, pickupAvailable: e.target.checked })}
                        className="w-4 h-4 accent-ceylon-blue rounded"
                      />
                      <span>Hotel Pickup & Dropoff Included</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-extrabold text-xs text-ceylon-navy block">Guide & Chauffeur Services</span>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-ceylon-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTour.guideIncluded !== false}
                        onChange={(e) => setEditingTour({ ...editingTour, guideIncluded: e.target.checked })}
                        className="w-4 h-4 accent-ceylon-blue rounded"
                      />
                      <span>Licensed Chauffeur Guide Included</span>
                    </label>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                        Languages Spoken
                      </label>
                      <input
                        type="text"
                        value={editingTour.languages || "English"}
                        onChange={(e) => setEditingTour({ ...editingTour, languages: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
                        placeholder="e.g. English, German, French"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Cancellation Policy Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingTour.cancellationPolicy || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, cancellationPolicy: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700"
                    placeholder="e.g. Full refund if cancelled up to 24 hours prior to journey departure."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1">
                    Important Information & Guest Preparation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editingTour.importantInfo || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, importantInfo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700"
                    placeholder="e.g. Modest dress required for sacred sites (shoulders and knees covered). Comfortable walking shoes recommended."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SEO SETTINGS */}
          {activeTab === "seo" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                  10. Search Engine Optimization (SEO)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Optimize meta tags for higher ranking on Google and travel search engines.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-ceylon-navy">
                      SEO Meta Title
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(editingTour.seoTitle || editingTour.title || "").length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingTour.seoTitle || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, seoTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-ceylon-navy"
                    placeholder={`${editingTour.title || "Tour Title"} | Ceylon Explore Tours`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-ceylon-navy">
                      SEO Meta Description
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(editingTour.seoDescription || "").length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editingTour.seoDescription || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, seoDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700"
                    placeholder="Compelling 150-160 character description shown on Google search result pages..."
                  />
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Google Search Result Preview
                  </span>
                  <div className="font-sans text-[#1a0dab] hover:underline cursor-pointer text-sm font-medium line-clamp-1">
                    {editingTour.seoTitle || editingTour.title || "Tour Package | Ceylon Explore Tours"}
                  </div>
                  <div className="text-[#006621] text-xs font-sans line-clamp-1">
                    https://ceylonexploretours.com/tours/{editingTour.slug || "tour-slug"}
                  </div>
                  <div className="text-[#545454] text-xs font-sans line-clamp-2">
                    {editingTour.seoDescription || editingTour.description?.slice(0, 150) || "Explore Sri Lanka in luxury with private chauffeur guides and curated experiences."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Bottom Action Bar */}
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
                <span>Save Package Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
