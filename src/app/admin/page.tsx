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
  ArrowRight,
  Building2,
  PhoneCall,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Check,
  RefreshCw,
  MoveLeft,
  MoveRight,
  Loader2,
  Sparkles,
  FolderOpen,
  Hotel,
  Utensils,
  Languages,
  Tag,
  ChevronUp,
  Info,
  ListOrdered,
  FileText,
  Award,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { DynamicIcon, AVAILABLE_TOUR_ICONS } from "@/components/common/DynamicIcon";
import { TourEditorModal } from "@/components/admin/TourEditorModal";
import { DestinationEditorModal } from "@/components/admin/DestinationEditorModal";
import { AdminTabErrorBoundary } from "@/components/admin/AdminTabErrorBoundary";
import { getBadgeLabel } from "@/components/tours/TourCard";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<
    "overview" | "tours" | "bookings" | "reviews" | "destinations" | "blog" | "inquiries" | "content" | "media" | "contact-settings"
  >("overview");

  // Business / Contact Settings
  const [businessSettings, setBusinessSettings] = useState({
    companyName: "Ceylon Explore Tours",
    address: "No. 45, Temple Road, Colombo 03, Sri Lanka",
    email: "info@ceylonexploretours.com",
    primaryPhone: "+94 77 123 4567",
    secondaryPhone: "+94 11 234 5678",
    whatsapp: "+94 77 123 4567",
    mapsUrl: "https://maps.google.com/?q=Colombo+Sri+Lanka",
    operatingHours: "Mon - Sun: 06:00 AM - 10:00 PM (24/7 Hotline)",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

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

  // Tour Package Modal Sub-tab State (10 structured tabs)
  const [tourModalTab, setTourModalTab] = useState<
    "basic" | "pricing" | "icons" | "curator" | "signature" | "itinerary" | "inclusions" | "media" | "booking" | "seo"
  >("basic");

  // Destination Modal Sub-tab State (7 structured tabs)
  const [destModalTab, setDestModalTab] = useState<
    "basic" | "about" | "media" | "attractions" | "overview" | "tours" | "seo"
  >("basic");

  // Media Management Sub-tabs & States
  const [mediaSubTab, setMediaSubTab] = useState<"banners" | "tours" | "destinations" | "library">("banners");
  const [selectedTourForMedia, setSelectedTourForMedia] = useState<string>("");
  const [selectedDestForMedia, setSelectedDestForMedia] = useState<string>("");
  const [mediaSearch, setMediaSearch] = useState<string>("");
  const [mediaFilter, setMediaFilter] = useState<"ALL" | "IN_USE" | "UNUSED">("ALL");
  const [previewSlide, setPreviewSlide] = useState<any | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [editingAltValue, setEditingAltValue] = useState<string>("");

  // Staged Upload State (Drag & Drop + Preview before publish)
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string>("");
  const [stagedAltText, setStagedAltText] = useState<string>("");
  const [stagedTitle, setStagedTitle] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Tour Gallery & Multi-Photo Upload State
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"tourPrimary" | "tourGallery" | "destCover" | "destBanner" | null>(null);
  const [tourGalleryUploadProgress, setTourGalleryUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDraggingTourGallery, setIsDraggingTourGallery] = useState(false);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState("");

  // Load all admin data
  async function loadAllData() {
    try {
      const [sRes, tRes, bRes, rRes, dRes, blRes, inqRes, slRes, fRes, mRes, bsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/tours"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/reviews"),
        fetch("/api/admin/destinations"),
        fetch("/api/admin/blog"),
        fetch("/api/admin/inquiries"),
        fetch("/api/hero-slides?all=true"),
        fetch("/api/admin/content?type=faqs"),
        fetch("/api/admin/upload"),
        fetch("/api/business-settings")
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
      if (bsRes.ok) {
        const bsData = await bsRes.json();
        setBusinessSettings({
          companyName: bsData.companyName || "Ceylon Explore Tours",
          address: bsData.address || "",
          email: bsData.email || "",
          primaryPhone: bsData.primaryPhone || "",
          secondaryPhone: bsData.secondaryPhone || "",
          whatsapp: bsData.whatsapp || "",
          mapsUrl: bsData.mapsUrl || "",
          operatingHours: bsData.operatingHours || "",
        });
      }
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

  // Image upload helper with strict 8MB limit and timeout protection
  const handleFileUpload = async (
    file: File,
    callback?: (url: string, asset?: any) => void,
    meta?: { altText?: string; title?: string }
  ) => {
    const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB in exact bytes
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `Image must be smaller than 8 MB. Selected file is ${sizeMB} MB.`;
      setUploadError(msg);
      alert(msg);
      return null;
    }

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/pjpeg",
      "image/x-png",
    ];
    const fileExt = file.name ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

    if (file.type && !allowed.includes(file.type.toLowerCase()) && !allowedExts.includes(fileExt)) {
      const msg = `Unsupported format '${file.type || fileExt}'. Please upload JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), or AVIF (.avif).`;
      setUploadError(msg);
      alert(msg);
      return null;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    setUploadProgress(20);

    try {
      const fd = new FormData();
      fd.append("file", file);
      if (meta?.altText) fd.append("altText", meta.altText);
      if (meta?.title) fd.append("title", meta.title);

      setUploadProgress(50);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setUploadProgress(80);
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.url) {
        setUploadProgress(100);
        setUploadSuccess("Photograph uploaded and published successfully.");
        setStatusMsg("Photograph uploaded successfully.");
        if (callback) {
          await callback(data.url, data);
        }

        // Refresh media library
        const mRes = await fetch("/api/admin/upload");
        if (mRes.ok) setMediaAssets(await mRes.json());
        return data.url;
      } else {
        const errorMsg = data.error || `Upload failed with HTTP ${res.status}. Please check your connection.`;
        setUploadError(errorMsg);
        alert(errorMsg);
        return null;
      }
    } catch (e: any) {
      const isTimeout = e?.name === "AbortError";
      const netMsg = isTimeout
        ? "Upload timed out after 35 seconds. Please check your network connection or try a smaller image."
        : `Upload failed: ${e?.message || "Check your internet connection."}`;
      setUploadError(netMsg);
      alert(netMsg);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Multiple Tour Photo Uploader (Multi-file select & Drag & Drop)
  const handleMultipleTourFiles = async (
    files: FileList | File[],
    onComplete: (newUrls: string[]) => void
  ) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const MAX_FILE_SIZE = 8 * 1024 * 1024;
    const uploadedUrls: string[] = [];

    setUploading(true);
    setTourGalleryUploadProgress({ current: 0, total: fileArray.length });

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setTourGalleryUploadProgress({ current: i + 1, total: fileArray.length });

      if (file.size > MAX_FILE_SIZE) {
        alert(`Photograph "${file.name}" exceeds the 8 MB upload limit and was skipped.`);
        continue;
      }

      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", file.name);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.warn(`Upload failed for ${file.name}:`, data?.error);
        }
      } catch (err) {
        console.warn(`Network error uploading ${file.name}:`, err);
      }
    }

    setUploading(false);
    setTourGalleryUploadProgress(null);

    if (uploadedUrls.length > 0) {
      onComplete(uploadedUrls);
      setStatusMsg(`Successfully added ${uploadedUrls.length} photograph(s) to tour package!`);
      fetch("/api/admin/upload")
        .then((r) => r.json())
        .then((assets) => Array.isArray(assets) && setMediaAssets(assets))
        .catch(() => {});
    }
  };

  // Hero Slides Helpers
  const handleSaveSlide = async (slideData: any) => {
    try {
      setUploading(true);
      const isNew = !slideData.id;
      const res = await fetch("/api/hero-slides", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slideData),
      });
      if (res.ok) {
        setStatusMsg(isNew ? "Hero banner slide created!" : "Hero banner slide updated!");
        setEditingSlide(null);
        const slRes = await fetch("/api/hero-slides?all=true");
        if (slRes.ok) setSlides(await slRes.json());
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Failed to save hero slide.");
      }
    } catch (e) {
      alert("Error saving hero slide.");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleSlideActive = async (slide: any) => {
    try {
      const res = await fetch("/api/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, active: !slide.active }),
      });
      if (res.ok) {
        const slRes = await fetch("/api/hero-slides?all=true");
        if (slRes.ok) setSlides(await slRes.json());
      }
    } catch (e) {}
  };

  const handleMoveSlide = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    setSlides(newSlides);

    try {
      await fetch("/api/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlides.map((s, idx) => ({ id: s.id, orderIndex: idx }))),
      });
      const slRes = await fetch("/api/hero-slides?all=true");
      if (slRes.ok) setSlides(await slRes.json());
    } catch (e) {}
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner slide?")) return;
    try {
      const res = await fetch(`/api/hero-slides?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMsg("Hero slide deleted.");
        const slRes = await fetch("/api/hero-slides?all=true");
        if (slRes.ok) setSlides(await slRes.json());
      }
    } catch (e) {
      alert("Error deleting hero slide.");
    }
  };

  // Tour Media Helpers
  const handleSaveTourMedia = async (tourId: string, primaryImg: string, gallery: string[]) => {
    try {
      setUploading(true);
      setStatusMsg("Saving photographs to tour package...");
      const res = await fetch("/api/admin/tours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tourId,
          primaryImage: primaryImg,
          galleryImages: gallery,
        }),
      });
      if (res.ok) {
        setStatusMsg("Synchronizing tour catalog and galleries...");
        const tRes = await fetch("/api/admin/tours");
        if (tRes.ok) {
          const freshTours = await tRes.json();
          setTours(freshTours);
        }
        setStatusMsg("Tour photographs and gallery updated successfully!");
        setUploadSuccess("Photograph saved to tour package successfully.");
        return true;
      } else {
        const d = await res.json().catch(() => ({}));
        const errMsg = d.error || "Failed to update tour images.";
        setStatusMsg(`Failed: ${errMsg}`);
        alert(errMsg);
        return false;
      }
    } catch (e: any) {
      alert(`Error saving tour photographs: ${e?.message || e}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Destination Media Helpers
  const handleSaveDestMedia = async (destId: string, image: string, thumbnail?: string) => {
    try {
      setUploading(true);
      const res = await fetch("/api/admin/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: destId,
          image,
          thumbnail,
        }),
      });
      if (res.ok) {
        setStatusMsg("Destination photographs saved successfully!");
        const dRes = await fetch("/api/admin/destinations");
        if (dRes.ok) setDestinations(await dRes.json());
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Failed to update destination media.");
      }
    } catch (e) {
      alert("Error saving destination photographs.");
    } finally {
      setUploading(false);
    }
  };

  // Media Library Helpers
  const handleSaveAltText = async (id: string, altText: string) => {
    try {
      const res = await fetch("/api/admin/upload", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, altText }),
      });
      if (res.ok) {
        setEditingAltId(null);
        setStatusMsg("Alt text updated for SEO.");
        const mRes = await fetch("/api/admin/upload");
        if (mRes.ok) setMediaAssets(await mRes.json());
      }
    } catch (e) {}
  };

  const handleDeleteMediaAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      const res = await fetch(`/api/admin/upload?id=${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatusMsg("Media asset deleted safely.");
        const mRes = await fetch("/api/admin/upload");
        if (mRes.ok) setMediaAssets(await mRes.json());
      } else {
        alert(data.error || "Cannot delete media asset.");
      }
    } catch (e) {
      alert("Error deleting media asset.");
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
      badge: [
        { id: "duration", label: "Duration", value: "8 Hours", icon: "Clock", enabled: true },
        { id: "journeyType", label: "Journey Type", value: "Private Tour", icon: "Compass", enabled: true },
        { id: "chauffeurGuide", label: "Chauffeur Guide", value: "English (Native)", icon: "Languages", enabled: true },
        { id: "cancellation", label: "Cancellation", value: "Free up to 24h", icon: "CheckCircle", enabled: true },
      ],
      freeCancellation: true,
      instantBook: true,
      pickupAvailable: true,
      guideIncluded: true,
      liveGuide: "English",
      languages: "English, German & French",
      minTravellers: 1,
      maxTravellers: 12,
      description: "",
      highlights: {
        title: "Curator's Highlights",
        subtitle: "Signature moments hand-selected by our private Ceylon travel curators",
        enabled: true,
        items: [
          { id: "h1", text: "Scale the iconic Sigiriya Rock Fortress with a private certified guide", icon: "Sparkles" },
          { id: "h2", text: "Luxury private air-conditioned vehicle with chilled king coconuts", icon: "Car" },
        ],
      },
      whatToBring: {
        heading: "Signature Experiences Included",
        subtitle: "Exclusive moments reserved for private Ceylon journeys",
        enabled: true,
        experiences: [
          { id: "e1", title: "Archaeological Access", description: "VIP entrance accompanied by an archaeological specialist", icon: "Award", tag: "VIP Access" },
        ],
      },
      includes: [
        "Private air-conditioned transportation",
        "Bottled mineral water & chilled king coconut",
        "Licensed English-speaking chauffeur guide",
      ],
      excludes: [
        "Site entrance tickets (unless specified)",
        "Gratuities & personal expenses",
      ],
      featured: false,
      status: "PUBLISHED",
      seoTitle: "",
      seoDescription: "",
      primaryImage: "/images/destinations/sigiriya.jpg",
      galleryImages: [],
      itinerary: [
        { stepNumber: 1, title: "Morning Departure & Guided Tour", description: "Pickup from hotel and scenic transfer.", location: "Central Province", duration: "4 Hours", accommodation: "", meals: "Refreshments Included" }
      ],
    });
    setTourModalTab("basic");
  };

  const openEditTour = (tour: any) => {
    const primary = tour.images?.find((img: any) => img.isPrimary)?.url;
    const gallery = tour.images?.filter((img: any) => !img.isPrimary).map((i: any) => i.url);

    // Normalize Tour Info & Icons (badge)
    let parsedBadge: any[] = [];
    try {
      if (tour.badge && typeof tour.badge === "string" && tour.badge.trim().startsWith("[")) {
        parsedBadge = JSON.parse(tour.badge);
      } else if (Array.isArray(tour.badge)) {
        parsedBadge = tour.badge;
      }
    } catch (e) {}

    if (!Array.isArray(parsedBadge) || parsedBadge.length === 0) {
      parsedBadge = [
        { id: "duration", label: "Duration", value: tour.duration || "8 Hours", icon: "Clock", enabled: true },
        { id: "journeyType", label: "Journey Type", value: tour.tourType || "Private Tour", icon: "Compass", enabled: true },
        { id: "chauffeurGuide", label: "Chauffeur Guide", value: tour.liveGuide || (tour.languages ? `English & ${tour.languages}` : "English (Native)"), icon: "Languages", enabled: true },
        { id: "cancellation", label: "Cancellation", value: tour.freeCancellation ? "Free up to 24h" : "Non-refundable", icon: "CheckCircle", enabled: true },
      ];
    }

    // Normalize Curator's Highlights
    let parsedHighlights: any = {
      title: "Curator's Highlights",
      subtitle: "Signature moments hand-selected by our private Ceylon travel curators",
      enabled: true,
      items: [],
    };

    try {
      if (tour.highlights) {
        if (typeof tour.highlights === "object" && !Array.isArray(tour.highlights)) {
          parsedHighlights = {
            title: tour.highlights.title || "Curator's Highlights",
            subtitle: tour.highlights.subtitle || "",
            enabled: tour.highlights.enabled !== false,
            items: Array.isArray(tour.highlights.items) ? tour.highlights.items : [],
          };
        } else if (typeof tour.highlights === "string" && tour.highlights.trim().startsWith("{")) {
          const obj = JSON.parse(tour.highlights);
          parsedHighlights = {
            title: obj.title || "Curator's Highlights",
            subtitle: obj.subtitle || "",
            enabled: obj.enabled !== false,
            items: Array.isArray(obj.items)
              ? obj.items.map((it: any, idx: number) => typeof it === "string" ? { id: `h-${idx}`, text: it, icon: "Sparkles" } : { id: it.id || `h-${idx}`, text: it.text || "", icon: it.icon || "Sparkles" })
              : [],
          };
        } else {
          const arr = typeof tour.highlights === "string" ? JSON.parse(tour.highlights) : tour.highlights;
          parsedHighlights.items = (Array.isArray(arr) ? arr : [String(tour.highlights)]).map((text: any, idx: number) => ({
            id: `h-${idx}`,
            text: typeof text === "string" ? text : (text?.text || String(text)),
            icon: "Sparkles",
          }));
        }
      }
    } catch (e) {
      if (tour.highlights) {
        parsedHighlights.items = [{ id: "h-0", text: String(tour.highlights), icon: "Sparkles" }];
      }
    }

    // Normalize Signature Experiences (whatToBring)
    let parsedSignature: any = {
      heading: "Signature Experiences Included",
      subtitle: "Exclusive moments reserved for private Ceylon journeys",
      enabled: true,
      experiences: [],
    };

    try {
      if (tour.whatToBring) {
        if (typeof tour.whatToBring === "object") {
          parsedSignature = {
            heading: tour.whatToBring.heading || "Signature Experiences Included",
            subtitle: tour.whatToBring.subtitle || "",
            enabled: tour.whatToBring.enabled !== false,
            experiences: Array.isArray(tour.whatToBring.experiences) ? tour.whatToBring.experiences : [],
          };
        } else if (typeof tour.whatToBring === "string" && tour.whatToBring.trim().startsWith("{")) {
          const obj = JSON.parse(tour.whatToBring);
          parsedSignature = {
            heading: obj.heading || "Signature Experiences Included",
            subtitle: obj.subtitle || "",
            enabled: obj.enabled !== false,
            experiences: Array.isArray(obj.experiences) ? obj.experiences : [],
          };
        } else if (tour.whatToBring.trim()) {
          parsedSignature.experiences = [
            { id: "e-0", title: "Signature Experience", description: String(tour.whatToBring), icon: "Sparkles", tag: "Included" }
          ];
        }
      }
    } catch (e) {}

    // Normalize Includes & Excludes
    let parsedIncludes: string[] = [];
    try {
      const raw = typeof tour.includes === "string" ? JSON.parse(tour.includes) : tour.includes;
      parsedIncludes = Array.isArray(raw) ? raw.map((i: any) => typeof i === "string" ? i : (i.text || String(i))) : (tour.includes ? [String(tour.includes)] : []);
    } catch (e) {
      parsedIncludes = tour.includes ? [String(tour.includes)] : [];
    }

    let parsedExcludes: string[] = [];
    try {
      const raw = typeof tour.excludes === "string" ? JSON.parse(tour.excludes) : tour.excludes;
      parsedExcludes = Array.isArray(raw) ? raw.map((i: any) => typeof i === "string" ? i : (i.text || String(i))) : (tour.excludes ? [String(tour.excludes)] : []);
    } catch (e) {
      parsedExcludes = tour.excludes ? [String(tour.excludes)] : [];
    }

    setEditingTour({
      ...tour,
      primaryImage: primary || tour.primaryImage || (tour.images?.[0]?.url || "/images/destinations/sigiriya.jpg"),
      galleryImages: gallery || [],
      badge: parsedBadge,
      highlights: parsedHighlights,
      whatToBring: parsedSignature,
      includes: parsedIncludes,
      excludes: parsedExcludes,
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
      seoTitle: tour.seoTitle || "",
      seoDescription: tour.seoDescription || "",
    });
    setTourModalTab("basic");
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
      setStatusMsg(`Updating review status to ${status}...`);
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, rejectionReason: reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatusMsg(
          status === "APPROVED"
            ? "Review approved & published successfully! Public cache revalidated."
            : `Review marked as ${status}.`
        );
        setRejectingReviewId(null);
        setRejectionReason("");
        await loadAllData();
      } else {
        alert(data.error || `Failed to update review status to ${status}.`);
        setStatusMsg(`Failed: ${data.error || "Review update error"}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Error updating review: ${e?.message || e}`);
      setStatusMsg("Error updating review.");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStatusMsg("Review permanently deleted.");
        loadAllData();
      } else {
        alert("Failed to delete review.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting review.");
    }
  };

  // ----------------------------------------------------
  // BUSINESS & CONTACT SETTINGS ACTIONS
  // ----------------------------------------------------
  const saveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    if (!businessSettings.address.trim()) {
      setSettingsError("Physical business address is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!businessSettings.email.trim() || !emailRegex.test(businessSettings.email.trim())) {
      setSettingsError("Please provide a valid business email address (e.g. info@ceylonexploretours.com).");
      return;
    }

    if (!businessSettings.primaryPhone.trim()) {
      setSettingsError("Primary contact hotline number is required.");
      return;
    }

    if (!businessSettings.whatsapp.trim()) {
      setSettingsError("WhatsApp contact number is required.");
      return;
    }

    setSavingSettings(true);
    try {
      const res = await fetch("/api/business-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessSettings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSuccess("Business information and contact settings successfully updated! Changes are now live across the website, footer, and WhatsApp chat.");
        setStatusMsg("Business information and contact settings updated successfully!");
        loadAllData();
      } else {
        setSettingsError(data.error || "Failed to update business contact information.");
      }
    } catch (err) {
      setSettingsError("Network error occurred while saving contact settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // ----------------------------------------------------
  // DESTINATIONS ACTIONS
  // ----------------------------------------------------
  const openNewDestForm = () => {
    setEditingDest({
      name: "",
      slug: "",
      shortDesc: "",
      longDesc: "",
      image: "/images/destinations/sigiriya.jpg",
      thumbnail: "/images/destinations/sigiriya.jpg",
      startingPrice: 65,
      popularAttractions: [
        { id: "a1", name: "Sigiriya Rock Citadel", description: "Ancient UNESCO 5th-century fortress", tourSlug: "", active: true },
        { id: "a2", name: "Pidurangala Viewpoint", description: "Spectacular panoramic sunrise summit", tourSlug: "", active: true },
      ],
      gallery: {
        aboutHeading: "About the Destination",
        curatedExperiencesText: "Private Day Journeys & Bespoke Safaris",
        travelTips: "Best explored in early mornings to avoid midday tropical sun. Chauffeur transport recommended.",
        customButtonText: "Plan Custom Itinerary",
      },
      bestTimeToVisit: "December to April",
      featured: true,
      status: "PUBLISHED",
      seoTitle: "",
      seoDescription: "",
    });
    setDestModalTab("basic");
  };

  const openEditDest = (dest: any) => {
    let parsedAttractions: any[] = [];
    try {
      if (dest.popularAttractions && typeof dest.popularAttractions === "string" && dest.popularAttractions.trim().startsWith("[")) {
        parsedAttractions = JSON.parse(dest.popularAttractions);
      } else if (dest.popularAttractions) {
        parsedAttractions = String(dest.popularAttractions).split(",").map((item, idx) => ({
          id: `att-${idx}`,
          name: item.trim(),
          description: "",
          tourSlug: "",
          active: true,
        })).filter((a) => a.name.length > 0);
      }
    } catch (e) {
      parsedAttractions = [];
    }

    let parsedGallery: any = {
      aboutHeading: `About ${dest.name}`,
      curatedExperiencesText: "",
      travelTips: "",
      customButtonText: `Plan Custom Itinerary for ${dest.name}`,
    };
    try {
      if (dest.gallery && typeof dest.gallery === "string" && dest.gallery.trim().startsWith("{")) {
        parsedGallery = { ...parsedGallery, ...JSON.parse(dest.gallery) };
      } else if (dest.gallery && typeof dest.gallery === "object") {
        parsedGallery = { ...parsedGallery, ...dest.gallery };
      }
    } catch (e) {}

    setEditingDest({
      ...dest,
      thumbnail: dest.thumbnail || dest.image || "/images/destinations/sigiriya.jpg",
      popularAttractions: parsedAttractions,
      gallery: parsedGallery,
      seoTitle: dest.seoTitle || "",
      seoDescription: dest.seoDescription || "",
    });
    setDestModalTab("basic");
  };

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
          <div className="relative w-16 h-16 shrink-0">
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
          { id: "contact-settings", label: "Business & Contact Settings", icon: Building2 },
          { id: "media", label: "Media Management", icon: ImageIcon },
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

      <AdminTabErrorBoundary onReset={() => setTab("overview")}>
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
                      const q = tourSearch.toLowerCase();
                      const matchSearch =
                        !tourSearch ||
                        (t.title && t.title.toLowerCase().includes(q)) ||
                        (t.location && t.location.toLowerCase().includes(q));
                      const matchStatus =
                        tourStatusFilter === "ALL" || t.status === tourStatusFilter;
                      return Boolean(matchSearch && matchStatus);
                    })
                    .map((tour) => {
                      const primaryImg =
                        tour.images?.find((img: any) => img.isPrimary)?.url ||
                        tour.primaryImage ||
                        "/images/destinations/sigiriya.jpg";
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
                                onClick={() => openEditTour(tour)}
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
            <TourEditorModal
              editingTour={editingTour}
              setEditingTour={setEditingTour}
              onSave={saveTour}
              onClose={() => setEditingTour(null)}
              destinations={destinations}
              handleFileUpload={handleFileUpload}
              handleMultipleTourFiles={handleMultipleTourFiles}
              uploading={uploading}
              tourGalleryUploadProgress={tourGalleryUploadProgress}
              isDraggingTourGallery={isDraggingTourGallery}
              setIsDraggingTourGallery={setIsDraggingTourGallery}
              setMediaPickerTarget={setMediaPickerTarget}
            />
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
                      const q = bookingSearch.toLowerCase();
                      const matchSearch =
                        !bookingSearch ||
                        (b.bookingRef && b.bookingRef.toLowerCase().includes(q)) ||
                        (b.guestName && b.guestName.toLowerCase().includes(q)) ||
                        (b.guestEmail && b.guestEmail.toLowerCase().includes(q));
                      const matchStatus =
                        bookingStatusFilter === "ALL" || b.bookingStatus === bookingStatusFilter;
                      return Boolean(matchSearch && matchStatus);
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
              .filter((r) => reviewStatusFilter === "ALL" || r.status?.toUpperCase() === reviewStatusFilter)
              .map((rev) => {
                const statusUpper = rev.status?.toUpperCase();
                return (
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
                              statusUpper === "APPROVED" || statusUpper === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : statusUpper === "PENDING"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            Status: {statusUpper === "APPROVED" ? "Approved & Published" : rev.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {rev.userEmail || "No email"} • {rev.userCountry || "International"} • Tour: {rev.tour?.title || "General Sri Lanka Journey"}
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
                        {rev.travelDate ? ` • Visited: ${rev.travelDate}` : ""}
                      </span>

                      <div className="flex items-center gap-2">
                        {statusUpper !== "APPROVED" && statusUpper !== "PUBLISHED" && (
                          <button
                            onClick={() => moderateReview(rev.id, "APPROVED")}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                        )}
                        {(statusUpper === "APPROVED" || statusUpper === "PUBLISHED") && (
                          <button
                            onClick={() => moderateReview(rev.id, "HIDDEN", "Moderator unpublished")}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold"
                            title="Unpublish this review from the public website"
                          >
                            Unpublish (Hide)
                          </button>
                        )}
                        {statusUpper !== "REJECTED" && (
                          <button
                            onClick={() => {
                              const reason = prompt("Enter rejection reason (e.g. spam, inappropriate content, promotional link):");
                              if (reason !== null && reason.trim()) moderateReview(rev.id, "REJECTED", reason.trim());
                            }}
                            className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold"
                          >
                            Reject as Spam
                          </button>
                        )}
                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Permanently delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              onClick={openNewDestForm}
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
                    <Image src={dest.image || "/images/destinations/sigiriya.jpg"} alt={dest.name || "Destination"} fill className="object-cover" />
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
                    onClick={() => openEditDest(dest)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ceylon-navy rounded-xl"
                  >
                    Edit Destination
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingDest && (
            <DestinationEditorModal
              editingDest={editingDest}
              setEditingDest={setEditingDest}
              onSave={saveDest}
              onClose={() => setEditingDest(null)}
              tours={tours}
              handleFileUpload={handleFileUpload}
              uploading={uploading}
              setMediaPickerTarget={setMediaPickerTarget}
            />
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
                  image: "/images/destinations/ella.jpg",
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
                    <Image src={post.image || "/images/destinations/sigiriya.jpg"} alt={post.title || "Article"} fill className="object-cover" />
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
      {/* ---------------------------------------------------- */}
      {/* 9. MEDIA MANAGEMENT TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "media" && (
        <div className="space-y-6">
          {/* Media Header & Sub-navigation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-ceylon-navy flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-ceylon-blue" />
                  <span>Website Media Management</span>
                </h2>
                <p className="text-xs text-ceylon-muted mt-1">
                  Full control over homepage hero slides, mountain panoramas, tour package galleries, destination photos, and asset library.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Total Assets: {mediaAssets.length}</span>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {[
                { id: "banners", label: "Homepage Banners", icon: Monitor },
                { id: "tours", label: "Tour Package Galleries", icon: Compass },
                { id: "destinations", label: "Destination Media", icon: MapPin },
                { id: "library", label: "Media Library & Upload", icon: ImageIcon },
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isCurrent = mediaSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setMediaSubTab(sub.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                      isCurrent
                        ? "bg-ceylon-navy text-white shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================================================== */}
          {/* SUB-TAB 1: HOMEPAGE BANNER MANAGEMENT */}
          {/* ==================================================== */}
          {mediaSubTab === "banners" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 border border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-ceylon-navy">Homepage Hero Banner Slider</h3>
                  <p className="text-xs text-ceylon-muted mt-0.5">
                    Manage the large background imagery, mountain panoramas, headings, and call-to-actions. Recommended dimensions: 1920 × 1080 px (16:9).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSlide({
                      tagline: "Explore. Connect. Remember.",
                      headlineLine1: "Discover Sri Lanka",
                      headlineHighlight: "Your Way",
                      subtitle: "Authentic private day tours, wildlife safaris, and highland journeys curated by local travel experts.",
                      image: "/images/destinations/sigiriya.jpg",
                      mobileImage: "",
                      destination: "Sigiriya Rock Citadel",
                      ctaText: "Explore Tours",
                      ctaLink: "/tours",
                      active: true,
                    });
                  }}
                  className="px-4 py-2.5 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Banner Slide</span>
                </button>
              </div>

              {/* Banner Slides List */}
              <div className="space-y-4">
                {slides.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center gap-6"
                  >
                    {/* Ordering Controls & Thumbnails */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, "up")}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Slide Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                        <button
                          disabled={idx === slides.length - 1}
                          onClick={() => handleMoveSlide(idx, "down")}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Slide Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Desktop Banner Thumbnail */}
                      <div className="relative w-44 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                        <Image src={s.image || "/images/destinations/sigiriya.jpg"} alt={s.destination || "Hero banner"} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setLightboxImage(s.image)}
                            className="p-1.5 bg-white/90 text-ceylon-navy rounded-lg hover:bg-white text-xs font-bold"
                            title="Zoom"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-mono">
                          Desktop
                        </span>
                      </div>

                      {/* Mobile Banner Thumbnail if configured */}
                      {s.mobileImage && (
                        <div className="relative w-16 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shrink-0 hidden sm:block">
                          <Image src={s.mobileImage} alt="Mobile banner" fill className="object-cover" />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-white font-mono">
                            Mobile
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-200">
                          {s.destination || "Sri Lanka"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            s.active
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {s.active ? "Active Slide" : "Disabled"}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-ceylon-navy truncate">
                        {s.headlineLine1} <span className="text-emerald-600">{s.headlineHighlight}</span>
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{s.subtitle}</p>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        Tagline: &quot;{s.tagline}&quot; • CTA: {s.ctaText} → {s.ctaLink}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0 w-full lg:w-auto justify-end">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewSlide(s)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-ceylon-navy rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live Preview</span>
                        </button>
                        <button
                          onClick={() => handleToggleSlideActive(s)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                            s.active
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {s.active ? "Disable" : "Enable"}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Replace Desktop Banner Image */}
                        <label className="px-3 py-1.5 bg-ceylon-blue/10 hover:bg-ceylon-blue/20 text-ceylon-blue rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleFileUpload(file, async (url) => {
                                  await handleSaveSlide({ ...s, image: url });
                                });
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => setEditingSlide(s)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSlide(s.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Slide"
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

          {/* ==================================================== */}
          {/* SUB-TAB 2: TOUR PACKAGE GALLERIES */}
          {/* ==================================================== */}
          {mediaSubTab === "tours" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-ceylon-navy">Tour Package Image Management</h3>
                  <p className="text-xs text-ceylon-muted mt-0.5">
                    Select a tour package to replace cover photographs, upload multi-image galleries, and reorder photographs.
                  </p>
                </div>

                {/* Tour Selector Dropdown */}
                <div className="max-w-md">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1.5">Select Tour Package:</label>
                  <select
                    value={selectedTourForMedia || (tours[0]?.id || "")}
                    onChange={(e) => setSelectedTourForMedia(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-ceylon-navy"
                  >
                    {tours.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.duration} • ${t.price} USD)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Tour Image Editor */}
              {(() => {
                const tour = tours.find((t) => t.id === (selectedTourForMedia || tours[0]?.id));
                if (!tour) return <div className="p-8 text-center text-xs text-slate-400">No tour package found.</div>;

                const primaryImg =
                  tour.images?.find((i: any) => i.isPrimary)?.url ||
                  tour.primaryImage ||
                  tour.images?.[0]?.url ||
                  "";
                const galleryList = (tour.images || [])
                  .filter((i: any) => !i.isPrimary && i.url !== primaryImg)
                  .map((i: any) => i.url);

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Image Controls */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Primary Cover Image Box */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                              1. Primary Cover Photograph
                            </h4>
                            <p className="text-xs text-slate-500">
                              Appears as the main thumbnail in tour search listings and card headers.
                            </p>
                          </div>
                          <label className="px-3.5 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Replace Cover</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  await handleFileUpload(file, async (url) => {
                                    await handleSaveTourMedia(tour.id, url, galleryList);
                                  });
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {primaryImg ? (
                          <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
                            <Image src={primaryImg} alt={tour.title || "Tour cover"} fill className="object-cover" />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow">
                              Primary Cover
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 p-2 bg-black/70 backdrop-blur-sm rounded-xl text-white text-xs font-mono truncate">
                              {primaryImg}
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <span>No primary photograph uploaded yet</span>
                          </div>
                        )}
                      </div>

                      {/* Photo Gallery Grid */}
                      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                              2. Tour Photo Gallery ({galleryList.length} Photos)
                            </h4>
                            <p className="text-xs text-slate-500">
                              Additional photographs displayed in the tour detail page gallery.
                            </p>
                          </div>
                          <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5 cursor-pointer">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Photo to Gallery</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  await handleFileUpload(file, async (url) => {
                                    const targetCover = primaryImg || url;
                                    const updated = primaryImg ? [...galleryList, url] : galleryList;
                                    await handleSaveTourMedia(tour.id, targetCover, updated);
                                  });
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {galleryList.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {galleryList.map((imgUrl: string, gIdx: number) => (
                              <div
                                key={gIdx}
                                className="bg-slate-50 rounded-2xl p-2 border border-slate-200 flex flex-col gap-2 group"
                              >
                                <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-200">
                                  <Image src={imgUrl} alt={`Gallery ${gIdx}`} fill className="object-cover" />
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                  <button
                                    onClick={async () => {
                                      // Promote this image to primary
                                      const newGallery = galleryList.filter((_: string, i: number) => i !== gIdx);
                                      if (primaryImg) newGallery.unshift(primaryImg);
                                      await handleSaveTourMedia(tour.id, imgUrl, newGallery);
                                    }}
                                    className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded text-[10px] font-extrabold border border-slate-200 flex-1 truncate"
                                  >
                                    Set Primary
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const updated = galleryList.filter((_: string, i: number) => i !== gIdx);
                                      await handleSaveTourMedia(tour.id, primaryImg, updated);
                                    }}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                    title="Remove photograph"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                            No additional gallery photographs added. Click &quot;Add Photo to Gallery&quot; to upload.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Col: Public Tour Card Live Preview */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 sticky top-6">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-navy flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-ceylon-blue" />
                          <span>Live Public Card Preview</span>
                        </h4>

                        {/* Public Card Mockup */}
                        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
                          <div className="relative h-44 w-full bg-slate-100">
                            {primaryImg ? (
                              <Image src={primaryImg} alt={tour.title || "Tour card"} fill className="object-cover" />
                            ) : (
                              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No Cover Image</div>
                            )}
                            {(() => {
                              const badgeLabel = getBadgeLabel(tour.badge, tour.tourType || "Private Tour");
                              if (!badgeLabel) return null;
                              return (
                                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase shadow">
                                  {badgeLabel}
                                </span>
                              );
                            })()}
                            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                              {tour.duration || "Day Tour"}
                            </div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="text-[10px] font-extrabold uppercase text-ceylon-blue tracking-wider">
                              {tour.destination?.name || tour.location || "Sri Lanka"}
                            </div>
                            <h5 className="text-sm font-extrabold text-ceylon-navy line-clamp-2">{tour.title}</h5>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <div>
                                <span className="text-[10px] text-slate-400 block">From</span>
                                <span className="text-sm font-black text-ceylon-navy">${tour.price} USD</span>
                              </div>
                              <span className="px-3 py-1.5 bg-ceylon-blue text-white rounded-xl text-xs font-bold">
                                View Tour
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] space-y-1">
                          <p className="font-bold text-ceylon-navy">Real-time Public Synchronization</p>
                          <p>Changes saved here automatically update the tour details page and public search card.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ==================================================== */}
          {/* SUB-TAB 3: DESTINATION IMAGE MANAGEMENT */}
          {/* ==================================================== */}
          {mediaSubTab === "destinations" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-ceylon-navy">Destination Photograph Management</h3>
                  <p className="text-xs text-ceylon-muted mt-0.5">
                    Update destination cover banners and thumbnail images without modifying database relations or routes.
                  </p>
                </div>

                {/* Destination Selector Dropdown */}
                <div className="max-w-md">
                  <label className="block text-xs font-bold text-ceylon-navy mb-1.5">Select Destination:</label>
                  <select
                    value={selectedDestForMedia || (destinations[0]?.id || "")}
                    onChange={(e) => setSelectedDestForMedia(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-ceylon-navy"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.tours?.length || d._count?.tours || 0} tours)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Destination Image Editor */}
              {(() => {
                const dest = destinations.find((d) => d.id === (selectedDestForMedia || destinations[0]?.id));
                if (!dest) return <div className="p-8 text-center text-xs text-slate-400">No destination found.</div>;

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Destination Cover Banner Box */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                            Hero Cover Banner
                          </h4>
                          <p className="text-xs text-slate-500">
                            Large wide background image on /{dest.slug} page.
                          </p>
                        </div>
                        <label className="px-3.5 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace Cover</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleFileUpload(file, async (url) => {
                                  await handleSaveDestMedia(dest.id, url, dest.thumbnail);
                                });
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                        {dest.image ? (
                          <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs">No Cover Image</div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/70 backdrop-blur-sm rounded-xl text-white text-[11px] font-mono truncate">
                          {dest.image}
                        </div>
                      </div>
                    </div>

                    {/* Destination Thumbnail Box */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-ceylon-blue">
                            Destination Thumbnail
                          </h4>
                          <p className="text-xs text-slate-500">
                            Square / card thumbnail used in search picker and destination catalog.
                          </p>
                        </div>
                        <label className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleFileUpload(file, async (url) => {
                                  await handleSaveDestMedia(dest.id, dest.image, url);
                                });
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                        <Image src={dest.thumbnail || dest.image} alt={dest.name} fill className="object-cover" />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                          {dest.thumbnail ? "Dedicated Thumbnail" : "Falling back to Cover"}
                        </span>
                        <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/70 backdrop-blur-sm rounded-xl text-white text-[11px] font-mono truncate">
                          {dest.thumbnail || dest.image}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ==================================================== */}
          {/* SUB-TAB 4: REUSABLE MEDIA LIBRARY & UPLOAD */}
          {/* ==================================================== */}
          {mediaSubTab === "library" && (
            <div className="space-y-6">
              {/* Professional Drag & Drop Upload Zone */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-dashed border-slate-300 hover:border-ceylon-blue transition-colors shadow-sm space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setStagedFile(file);
                      setStagedPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="flex flex-col items-center justify-center text-center py-4 space-y-3 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-ceylon-softblue flex items-center justify-center text-ceylon-blue shadow-inner">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-ceylon-navy">
                      Drag & Drop Website Image Here or Click to Browse
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Max file size: <span className="font-bold text-ceylon-navy">8 MB</span>. Supported formats: JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), AVIF (.avif).
                    </p>
                  </div>

                  <label className="px-5 py-2.5 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow cursor-pointer transition-colors">
                    <span>Browse Image Files</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setStagedFile(file);
                          setStagedPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Staged File Preview Card before publishing */}
                {stagedFile && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                          {stagedPreviewUrl && (
                            <Image src={stagedPreviewUrl} alt="Preview" fill unoptimized className="object-cover" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-ceylon-navy block truncate max-w-xs">
                            {stagedFile.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Size: {(stagedFile.size / 1024).toFixed(1)} KB ({stagedFile.type || "image"})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setStagedFile(null);
                            setStagedPreviewUrl("");
                          }}
                          className="px-3 py-1.5 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={uploading}
                          onClick={async () => {
                            if (stagedFile) {
                              await handleFileUpload(stagedFile, () => {
                                setStagedFile(null);
                                setStagedPreviewUrl("");
                                setStagedAltText("");
                                setStagedTitle("");
                              }, { altText: stagedAltText, title: stagedTitle });
                            }
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{uploading ? "Uploading..." : "Save & Publish to Library"}</span>
                        </button>
                      </div>
                    </div>

                    {/* SEO Metadata Fields for Staged Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Alt Text for SEO & Accessibility:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Scenic Sigiriya Rock Citadel in Sri Lanka"
                          value={stagedAltText}
                          onChange={(e) => setStagedAltText(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Image Title / Caption:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sigiriya Sunrise View"
                          value={stagedTitle}
                          onChange={(e) => setStagedTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Upload Progress Bar */}
                    {uploading && (
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-ceylon-blue h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Feedback Messages */}
                {uploadSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}
                {uploadError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Media Library Filters & Search */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {(["ALL", "IN_USE", "UNUSED"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setMediaFilter(mode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                        mediaFilter === mode
                          ? "bg-ceylon-navy text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {mode === "ALL" && `All Images (${mediaAssets.length})`}
                      {mode === "IN_USE" && `Active on Site (${mediaAssets.filter((a) => a.inUse).length})`}
                      {mode === "UNUSED" && `Unused (${mediaAssets.filter((a) => !a.inUse).length})`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by filename, alt text..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Media Assets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaAssets
                  .filter((a) => {
                    if (mediaFilter === "IN_USE") return a.inUse;
                    if (mediaFilter === "UNUSED") return !a.inUse;
                    return true;
                  })
                  .filter((a) => {
                    if (!mediaSearch) return true;
                    const q = mediaSearch.toLowerCase();
                    return (
                      (a.filename && a.filename.toLowerCase().includes(q)) ||
                      (a.altText && a.altText.toLowerCase().includes(q)) ||
                      (a.title && a.title.toLowerCase().includes(q))
                    );
                  })
                  .map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
                    >
                      {/* Image Thumbnail with zoom icon */}
                      <div
                        onClick={() => setLightboxImage(asset.url)}
                        className="relative h-32 w-full bg-slate-100 cursor-pointer overflow-hidden"
                      >
                        <Image src={asset.url} alt={asset.altText || asset.title || "Media"} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                        {asset.inUse ? (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600/90 text-[8px] font-extrabold text-white uppercase shadow">
                            Active
                          </span>
                        ) : (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-600/80 text-[8px] font-extrabold text-white uppercase shadow">
                            Unused
                          </span>
                        )}
                      </div>

                      {/* Info & Metadata */}
                      <div className="p-3 space-y-2">
                        <div>
                          <span className="text-[11px] font-extrabold text-ceylon-navy block truncate" title={asset.filename}>
                            {asset.filename}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {asset.fileSize ? `${(asset.fileSize / 1024).toFixed(1)} KB` : "Standard"} • {asset.mimeType?.replace("image/", "").toUpperCase() || "JPG"}
                          </span>
                        </div>

                        {/* Editable Alt Text for SEO */}
                        {editingAltId === asset.id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={editingAltValue}
                              onChange={(e) => setEditingAltValue(e.target.value)}
                              placeholder="SEO alt text..."
                              className="w-full px-2 py-1 bg-white border border-ceylon-blue rounded text-[10px]"
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleSaveAltText(asset.id, editingAltValue)}
                                className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold"
                              >
                                Save Alt
                              </button>
                              <button
                                onClick={() => setEditingAltId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingAltId(asset.id);
                              setEditingAltValue(asset.altText || "");
                            }}
                            className="text-[10px] text-slate-500 bg-slate-50 hover:bg-slate-100 p-1.5 rounded cursor-pointer border border-slate-200/60 truncate"
                            title="Click to edit alt text for SEO"
                          >
                            Alt: {asset.altText || <span className="text-slate-400 italic">Add alt text...</span>}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 pt-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(asset.url);
                              alert(`Copied URL:\n${asset.url}`);
                            }}
                            className="flex-1 py-1 bg-slate-50 hover:bg-ceylon-softblue text-[10px] font-extrabold text-ceylon-blue rounded border border-slate-200 flex items-center justify-center gap-1"
                            title="Copy URL"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>

                          {/* Replace Image Button */}
                          <label
                            className="p-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-200 cursor-pointer"
                            title="Replace photograph"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  await handleFileUpload(file, async (newUrl) => {
                                    // Update existing record
                                    await fetch("/api/admin/upload", {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: asset.id, title: file.name }),
                                    });
                                  });
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteMediaAsset(asset.id)}
                            className="p-1 bg-slate-50 hover:bg-rose-50 text-rose-500 rounded border border-slate-200"
                            title="Delete image safely"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SLIDE EDIT / CREATE MODAL */}
          {/* ==================================================== */}
          {editingSlide && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-ceylon-navy">
                    {editingSlide.id ? "Edit Homepage Banner Slide" : "Create New Banner Slide"}
                  </h3>
                  <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Desktop Banner Image */}
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">
                      Desktop Banner Image URL (1920 × 1080 px recommended) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingSlide.image || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                        required
                      />
                      <label className="px-3.5 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileUpload(file, (url) => setEditingSlide({ ...editingSlide, image: url }));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Optional Mobile Banner Image */}
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">
                      Mobile Banner Image URL (Optional vertical image: 750 × 1100 px)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Leave empty to use desktop image on mobile"
                        value={editingSlide.mobileImage || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, mobileImage: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                      <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await handleFileUpload(file, (url) => setEditingSlide({ ...editingSlide, mobileImage: url }));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Tagline & Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Tagline</label>
                      <input
                        type="text"
                        value={editingSlide.tagline || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, tagline: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Destination Name</label>
                      <input
                        type="text"
                        value={editingSlide.destination || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, destination: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Headline Line 1 & Highlight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Headline (First part)</label>
                      <input
                        type="text"
                        value={editingSlide.headlineLine1 || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, headlineLine1: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Headline Highlight (Emerald text)</label>
                      <input
                        type="text"
                        value={editingSlide.headlineHighlight || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, headlineHighlight: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-xs font-bold text-ceylon-navy mb-1">Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={editingSlide.subtitle || ""}
                      onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  {/* CTA Text & Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Button Label</label>
                      <input
                        type="text"
                        value={editingSlide.ctaText || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ceylon-navy mb-1">Button Link</label>
                      <input
                        type="text"
                        value={editingSlide.ctaLink || ""}
                        onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="slideActive"
                      checked={editingSlide.active !== false}
                      onChange={(e) => setEditingSlide({ ...editingSlide, active: e.target.checked })}
                      className="w-4 h-4 rounded text-ceylon-blue"
                    />
                    <label htmlFor="slideActive" className="text-xs font-bold text-ceylon-navy cursor-pointer">
                      Enable slide in live homepage hero slider
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSlide(editingSlide)}
                    className="px-5 py-2 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow"
                  >
                    Save & Publish Slide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* LIVE HERO BANNER PREVIEW MODAL */}
          {/* ==================================================== */}
          {previewSlide && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-ceylon-navy rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 border border-white/20">
                <div className="flex items-center justify-between p-4 bg-black/30 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      Live Hero Banner Overlay Mockup
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px]">
                      {previewDevice.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDevice("desktop")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        previewDevice === "desktop" ? "bg-white text-ceylon-navy" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice("mobile")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        previewDevice === "mobile" ? "bg-white text-ceylon-navy" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                    <button onClick={() => setPreviewSlide(null)} className="text-white/70 hover:text-white ml-2">
                      ✕
                    </button>
                  </div>
                </div>

                {/* Banner Simulation Box */}
                <div className="p-6 flex justify-center">
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all ${
                      previewDevice === "desktop" ? "w-full h-[400px]" : "w-[320px] h-[480px]"
                    }`}
                  >
                    {/* Background Image */}
                    <Image
                      src={previewDevice === "mobile" && previewSlide.mobileImage ? previewSlide.mobileImage : previewSlide.image}
                      alt={previewSlide.destination}
                      fill
                      className="object-cover"
                    />

                    {/* Dark Ceylon Navy Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ceylon-navy/95 via-ceylon-navy/75 to-ceylon-navy/40" />

                    {/* Text Overlay */}
                    <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center space-y-3 text-white">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 w-fit">
                        {previewSlide.tagline}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                        {previewSlide.headlineLine1}{" "}
                        <span className="text-emerald-400">{previewSlide.headlineHighlight}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-200 max-w-lg line-clamp-2">
                        {previewSlide.subtitle}
                      </p>
                      <div className="pt-2">
                        <span className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-lg inline-block">
                          {previewSlide.ctaText} →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* FULLSCREEN LIGHTBOX MODAL */}
          {/* ==================================================== */}
          {lightboxImage && (
            <div
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
                <Image src={lightboxImage} alt="Fullscreen preview" fill unoptimized className="object-contain" />
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-2 right-2 px-3 py-1.5 bg-white/20 hover:bg-white/40 text-white rounded-xl text-xs font-bold"
                >
                  Close (ESC)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 10. BUSINESS INFORMATION / CONTACT SETTINGS TAB */}
      {/* ---------------------------------------------------- */}
      {tab === "contact-settings" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-ceylon-blue" />
                <h2 className="text-lg font-extrabold text-ceylon-navy">
                  Business Information & Contact Settings
                </h2>
              </div>
              <p className="text-xs text-ceylon-muted mt-1">
                Manage official company address, support hotlines, WhatsApp numbers, Google Maps location, and operating hours. Updates immediately reflect across the website footer, contact page, and WhatsApp contact buttons.
              </p>
            </div>
          </div>

          {settingsSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
              <button
                onClick={() => setSettingsSuccess("")}
                className="text-emerald-900 font-extrabold text-sm ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {settingsError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{settingsError}</span>
              </div>
              <button
                onClick={() => setSettingsError("")}
                className="text-rose-900 font-extrabold text-sm ml-4"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Edit Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={saveBusinessSettings}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.companyName}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, companyName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. Ceylon Explore Tours"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Physical Head Office Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.address}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, address: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. No. 45, Temple Road, Colombo 03, Sri Lanka"
                    />
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Displayed on the website footer and contact us page.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Support Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={businessSettings.email}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, email: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. info@ceylonexploretours.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Primary Contact Hotline *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.primaryPhone}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, primaryPhone: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. +94 77 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Secondary Contact Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={businessSettings.secondaryPhone}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, secondaryPhone: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. +94 11 234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.whatsapp}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, whatsapp: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. +94 77 123 4567"
                    />
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Powers the floating WhatsApp chat button and instant inquiry links.
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Google Maps Location URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={businessSettings.mapsUrl}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, mapsUrl: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. https://maps.google.com/?q=Colombo+Sri+Lanka"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-ceylon-navy mb-1.5">
                      Business Operating Hours *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.operatingHours}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, operatingHours: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-ceylon-navy font-semibold focus:outline-none focus:border-ceylon-blue"
                      placeholder="e.g. Mon - Sun: 06:00 AM - 10:00 PM (24/7 Hotline)"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Saved directly to database. Survives server restarts and refreshes.
                  </span>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 bg-ceylon-blue hover:bg-ceylon-navy text-white text-xs font-extrabold rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? "Saving Settings..." : "Save Business Settings"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-ceylon-blue block">
                  Live Public Preview
                </span>
                <div className="border-t border-slate-100 pt-3 space-y-3 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-ceylon-navy block">Company:</span>
                    <span>{businessSettings.companyName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-ceylon-navy block">Address:</span>
                    <span>{businessSettings.address}</span>
                  </div>
                  <div>
                    <span className="font-bold text-ceylon-navy block">Primary Hotline:</span>
                    <span>{businessSettings.primaryPhone}</span>
                  </div>
                  {businessSettings.secondaryPhone && (
                    <div>
                      <span className="font-bold text-ceylon-navy block">Secondary Phone:</span>
                      <span>{businessSettings.secondaryPhone}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-ceylon-navy block">WhatsApp:</span>
                    <span className="text-emerald-700 font-semibold">{businessSettings.whatsapp}</span>
                  </div>
                  <div>
                    <span className="font-bold text-ceylon-navy block">Email:</span>
                    <span>{businessSettings.email}</span>
                  </div>
                  <div>
                    <span className="font-bold text-ceylon-navy block">Hours:</span>
                    <span>{businessSettings.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-ceylon-softblue/50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-ceylon-navy block">Automatic Synchronization:</span>
                <p className="leading-relaxed text-[11px]">
                  When you click &ldquo;Save Business Settings&rdquo;, this data is saved to the SQLite database and served via <code className="bg-white px-1 py-0.5 rounded text-ceylon-blue font-mono text-[10px]">/api/business-settings</code>, automatically updating the Footer, Contact Us page, and floating WhatsApp buttons in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </AdminTabErrorBoundary>

      {/* ---------------------------------------------------- */}
      {/* REUSABLE MEDIA LIBRARY ASSET PICKER MODAL */}
      {/* ---------------------------------------------------- */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-ceylon-navy flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-luxury-gold" />
                  <span>Choose from Media Asset Library</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mediaPickerTarget === "tourPrimary"
                    ? "Click an image to set as the primary cover photo."
                    : mediaPickerTarget === "tourGallery"
                    ? "Click an image to add it to the tour gallery."
                    : mediaPickerTarget === "destCover"
                    ? "Click an image to set as the destination cover photo."
                    : "Click an image to set as the destination hero banner."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search library assets by title, filename, or alt text..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-ceylon-blue"
              />
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto min-h-[300px] pr-1">
              {mediaAssets.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No images in media library yet. Upload images in the &ldquo;Media Library&rdquo; tab or upload a new file.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {mediaAssets
                    .filter((a) => {
                      if (!mediaSearch) return true;
                      const q = mediaSearch.toLowerCase();
                      return (
                        (a.filename && a.filename.toLowerCase().includes(q)) ||
                        (a.title && a.title.toLowerCase().includes(q)) ||
                        (a.altText && a.altText.toLowerCase().includes(q))
                      );
                    })
                    .map((asset) => (
                      <button
                        type="button"
                        key={asset.id}
                        onClick={() => {
                          if (mediaPickerTarget === "tourPrimary") {
                            setEditingTour({ ...editingTour, primaryImage: asset.url });
                          } else if (mediaPickerTarget === "tourGallery") {
                            const current = editingTour.galleryImages || [];
                            if (!current.includes(asset.url)) {
                              setEditingTour({
                                ...editingTour,
                                galleryImages: [...current, asset.url],
                              });
                            }
                          } else if (mediaPickerTarget === "destCover") {
                            setEditingDest({ ...editingDest, image: asset.url });
                          } else if (mediaPickerTarget === "destBanner") {
                            setEditingDest({ ...editingDest, thumbnail: asset.url });
                          }
                          setMediaPickerTarget(null);
                        }}
                        className="group text-left rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-ceylon-blue hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-28 w-full bg-slate-200 overflow-hidden">
                          <Image
                            src={asset.url}
                            alt={asset.altText || asset.title || "Media"}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-ceylon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <span className="bg-ceylon-navy text-[10px] font-extrabold px-2 py-1 rounded shadow">
                              Select
                            </span>
                          </div>
                        </div>
                        <div className="p-2 space-y-0.5">
                          <span className="text-[11px] font-bold text-ceylon-navy block truncate" title={asset.title || asset.filename}>
                            {asset.title || asset.filename}
                          </span>
                          <span className="text-[9px] text-slate-400 block">
                            {asset.fileSize ? `${(asset.fileSize / 1024).toFixed(0)} KB` : "Asset"} • Click to use
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Picker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
