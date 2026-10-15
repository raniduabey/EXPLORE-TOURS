"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { siteConfig } from "@/config/site";

export interface BusinessSettingsData {
  companyName: string;
  address: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsapp: string;
  mapsUrl: string;
  operatingHours: string;
}

const DEFAULT_SETTINGS: BusinessSettingsData = {
  companyName: siteConfig.name || "Ceylon Explore Tours",
  address: `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
  email: siteConfig.contact.email || "info@ceylonexploretours.com",
  primaryPhone: siteConfig.contact.phone || "+94 77 123 4567",
  secondaryPhone: "+94 11 234 5678",
  whatsapp: siteConfig.contact.whatsapp || "+94 77 123 4567",
  mapsUrl: "https://maps.google.com/?q=No.+45+Temple+Road+Colombo+03+Sri+Lanka",
  operatingHours: siteConfig.contact.operatingHours || "Mon - Sun: 06:00 AM - 10:00 PM (24/7 Hotline)",
};

interface BusinessContextType {
  settings: BusinessSettingsData;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType>({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/business-settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          companyName: data.companyName || DEFAULT_SETTINGS.companyName,
          address: data.address || DEFAULT_SETTINGS.address,
          email: data.email || DEFAULT_SETTINGS.email,
          primaryPhone: data.primaryPhone || DEFAULT_SETTINGS.primaryPhone,
          secondaryPhone: data.secondaryPhone || DEFAULT_SETTINGS.secondaryPhone,
          whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
          mapsUrl: data.mapsUrl || DEFAULT_SETTINGS.mapsUrl,
          operatingHours: data.operatingHours || DEFAULT_SETTINGS.operatingHours,
        });
      }
    } catch (err) {
      console.warn("Could not fetch business settings, using fallback", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <BusinessContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessSettings = () => useContext(BusinessContext);
