"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Check, X, Globe, MapPin } from "lucide-react";
import {
  Country,
  COUNTRIES,
  findCountry,
  normalizeSearchText,
} from "@/data/countriesData";

export interface CountrySelectProps {
  value?: string;
  onChange: (value: string, country: Country) => void;
  valueType?: "name" | "code";
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
  helperText?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value = "",
  onChange,
  valueType = "name",
  label,
  placeholder = "Select your country...",
  required = false,
  disabled = false,
  error,
  className = "",
  id,
  name,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Position coordinates for portal floating menu
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "bottom" | "top";
  }>({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine currently selected Country object
  const selectedCountry = useMemo(() => {
    return findCountry(value);
  }, [value]);

  // Compute position relative to viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 340; // Estimated max height of dropdown
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const placement: "bottom" | "top" =
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "top" : "bottom";

    const top =
      placement === "bottom"
        ? rect.bottom + window.scrollY + 6
        : rect.top + window.scrollY - dropdownHeight - 6;

    // Constrain horizontal position within screen padding
    const screenWidth = window.innerWidth;
    const targetWidth = Math.max(rect.width, Math.min(320, screenWidth - 32));
    let left = rect.left + window.scrollX;

    if (left + targetWidth > screenWidth - 16) {
      left = screenWidth - targetWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }

    setCoords({
      top,
      left,
      width: Math.min(targetWidth, screenWidth - 32),
      placement,
    });
  }, []);

  // Recalculate on open, resize, or scroll
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = (e: Event) => {
        // If scrolling inside the dropdown itself, don't update
        if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
          return;
        }
        updatePosition();
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Outside click to close
  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Real-time filtered countries with smart prioritization
  const filteredCountries = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    if (!query) return COUNTRIES;

    const exactMatches: Country[] = [];
    const startsWithMatches: Country[] = [];
    const containsMatches: Country[] = [];
    const aliasMatches: Country[] = [];

    for (const c of COUNTRIES) {
      const normName = normalizeSearchText(c.name);
      const normCode = c.code.toLowerCase();
      const normDial = c.dialCode.replace("+", "");

      // 1. Exact code, dialCode, or exact name
      if (normCode === query || normName === query || normDial === query) {
        exactMatches.push(c);
        continue;
      }

      // 2. Starts with query
      if (normName.startsWith(query) || normCode.startsWith(query)) {
        startsWithMatches.push(c);
        continue;
      }

      // 3. Name contains query
      if (normName.includes(query)) {
        containsMatches.push(c);
        continue;
      }

      // 4. Dial code or aliases match
      if (
        c.dialCode.includes(query) ||
        c.aliases.some((a) => normalizeSearchText(a).includes(query))
      ) {
        aliasMatches.push(c);
      }
    }

    return [
      ...exactMatches,
      ...startsWithMatches,
      ...containsMatches,
      ...aliasMatches,
    ];
  }, [searchQuery]);

  // Keep highlighted item in view
  useEffect(() => {
    if (listRef.current && filteredCountries.length > 0) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, filteredCountries.length]);

  const handleSelectCountry = (country: Country) => {
    const outputValue = valueType === "code" ? country.code : country.name;
    onChange(outputValue, country);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCountries[highlightedIndex]) {
        handleSelectCountry(filteredCountries[highlightedIndex]);
      }
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-ceylon-navy mb-1"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-left flex items-center justify-between gap-2 transition-all duration-200 outline-none ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-slate-100 border-slate-200"
            : error
            ? "border-rose-300 focus:border-rose-500 bg-rose-50/20"
            : isOpen
            ? "border-luxury-forest ring-1 ring-luxury-forest/20 shadow-sm bg-white"
            : "border-slate-200 hover:border-slate-300 focus:border-luxury-forest focus:ring-1 focus:ring-luxury-forest/20"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedCountry ? (
            <>
              <span className="text-base leading-none shrink-0 drop-shadow-sm">
                {selectedCountry.flag}
              </span>
              <span className="font-semibold text-ceylon-navy truncate">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400 font-normal truncate">
                {placeholder}
              </span>
            </>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-luxury-forest" : ""
          }`}
        />
      </button>

      {/* Helper text or Error message */}
      {error ? (
        <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[10px] text-slate-400 mt-1">{helperText}</p>
      ) : null}

      {/* Floating Dropdown Portal */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999,
            }}
            className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(16,45,36,0.18)] border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-label="Country Selection"
          >
            {/* Search Box Header */}
            <div className="p-2.5 border-b border-slate-100 bg-[#FAF8F5] flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for your country..."
                className="w-full bg-transparent text-xs text-ceylon-navy placeholder-slate-400 focus:outline-none py-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Country Listbox */}
            <ul
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              className="max-h-[280px] overflow-y-auto py-1.5 focus:outline-none divide-y divide-slate-50"
            >
              {filteredCountries.length === 0 ? (
                <li className="px-4 py-8 text-center text-slate-400">
                  <Globe className="w-6 h-6 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-600">
                    No countries found
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    No matches for &ldquo;{searchQuery}&rdquo;
                  </p>
                </li>
              ) : (
                filteredCountries.map((country, index) => {
                  const isSelected = selectedCountry?.code === country.code;
                  const isHighlighted = highlightedIndex === index;

                  return (
                    <li
                      key={country.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectCountry(country)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`px-3.5 py-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors duration-100 ${
                        isSelected
                          ? "bg-luxury-forest text-luxury-ivory font-semibold"
                          : isHighlighted
                          ? "bg-luxury-forest/5 text-luxury-forest font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="text-base leading-none shrink-0 drop-shadow-sm">
                          {country.flag}
                        </span>
                        <span className="truncate">{country.name}</span>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-luxury-gold shrink-0 ml-2" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};
