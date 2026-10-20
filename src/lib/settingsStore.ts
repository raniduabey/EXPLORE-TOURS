import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";

export interface StoredBusinessSettings {
  id: string;
  companyName: string;
  address: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsapp: string;
  mapsUrl: string;
  operatingHours: string;
  updatedAt?: string;
}

const DEFAULT_SETTINGS: StoredBusinessSettings = {
  id: "default",
  companyName: siteConfig.name || "Ceylon Explore Tours",
  address: `${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
  email: siteConfig.contact.email || "info@ceylonexploretours.com",
  primaryPhone: siteConfig.contact.phone || "+94 77 123 4567",
  secondaryPhone: "+94 11 234 5678",
  whatsapp: siteConfig.contact.whatsapp || "+94 77 123 4567",
  mapsUrl: "https://maps.google.com/?q=No.+45+Temple+Road+Colombo+03+Sri+Lanka",
  operatingHours: siteConfig.contact.operatingHours || "Mon - Sun: 06:00 AM - 10:00 PM (24/7 Hotline)",
};

declare global {
  var __ceylonSettingsCache: StoredBusinessSettings | undefined;
}

if (!global.__ceylonSettingsCache) {
  global.__ceylonSettingsCache = DEFAULT_SETTINGS;
}

function getBackupPaths(): string[] {
  return [
    path.join("/tmp", "ceylon-settings-backup.json"),
    path.join(process.cwd(), "prisma", "settings-backup.json"),
    path.join(process.cwd(), "settings-backup.json"),
    path.join(__dirname, "..", "..", "prisma", "settings-backup.json"),
    path.join(__dirname, "settings-backup.json"),
  ];
}

export function readBackupFile(): StoredBusinessSettings {
  for (const filePath of getBackupPaths()) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.companyName) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return DEFAULT_SETTINGS;
}

export function writeBackupFile(settings: StoredBusinessSettings): void {
  for (const filePath of getBackupPaths()) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
    } catch (e) {
      // ignore
    }
  }
}

export async function getStoredSettings(): Promise<StoredBusinessSettings> {
  if (!global.__ceylonSettingsCache || global.__ceylonSettingsCache === DEFAULT_SETTINGS) {
    const disk = readBackupFile();
    global.__ceylonSettingsCache = disk;
  }
  return global.__ceylonSettingsCache;
}

export async function saveSettingsToStore(settings: Partial<StoredBusinessSettings>): Promise<void> {
  const current = await getStoredSettings();
  const updated: StoredBusinessSettings = {
    ...current,
    ...settings,
    id: "default",
    updatedAt: new Date().toISOString(),
  };

  global.__ceylonSettingsCache = updated;
  writeBackupFile(updated);
}

export async function syncSettingsWithDb(prisma: any): Promise<void> {
  try {
    const dbSettings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (dbSettings) {
      global.__ceylonSettingsCache = dbSettings;
      writeBackupFile(dbSettings);
    } else {
      const disk = readBackupFile();
      await prisma.businessSettings.upsert({
        where: { id: "default" },
        create: disk,
        update: disk,
      });
      global.__ceylonSettingsCache = disk;
    }
  } catch (err) {
    console.warn("syncSettingsWithDb error:", err);
  }
}
