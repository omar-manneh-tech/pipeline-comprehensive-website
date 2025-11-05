/**
 * Site Settings Admin UI
 * Admin interface for managing global site settings
 */

"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Palette,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api/client";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description?: string;
  updatedAt: string;
}

const SETTING_CATEGORIES = [
  {
    id: "general",
    title: "General Settings",
    icon: Globe,
    description: "Site name, logo, and basic information",
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Mail,
    description: "Email, phone, and address",
  },
  {
    id: "social",
    title: "Social Media Links",
    icon: Facebook,
    description: "Social media profiles and links",
  },
  {
    id: "theme",
    title: "Theme & Appearance",
    icon: Palette,
    description: "Colors, fonts, and styling",
  },
  {
    id: "links",
    title: "Other Links",
    icon: LinkIcon,
    description: "Portal URL and external links",
  },
];

const DEFAULT_SETTINGS = {
  general: [
    { key: "site_name", label: "Site Name", type: "text", description: "Full name of the school" },
    { key: "site_short_name", label: "Short Name", type: "text", description: "Abbreviated name" },
    { key: "site_description", label: "Description", type: "text", description: "Site description" },
    { key: "site_url", label: "Site URL", type: "url", description: "Website URL" },
    { key: "logo_url", label: "Logo URL", type: "image", description: "Logo image URL" },
    { key: "favicon_url", label: "Favicon URL", type: "image", description: "Favicon image URL" },
  ],
  contact: [
    { key: "contact_email", label: "Email Address", type: "email", description: "Contact email" },
    { key: "contact_phone", label: "Phone Number", type: "text", description: "Contact phone" },
    { key: "contact_address", label: "Address", type: "text", description: "Physical address" },
    { key: "map_coordinates", label: "Map Coordinates", type: "text", description: "Lat, Lng for maps" },
  ],
  social: [
    { key: "facebook_url", label: "Facebook URL", type: "url", description: "Facebook page URL" },
    { key: "twitter_url", label: "Twitter URL", type: "url", description: "Twitter profile URL" },
    { key: "instagram_url", label: "Instagram URL", type: "url", description: "Instagram profile URL" },
    { key: "linkedin_url", label: "LinkedIn URL", type: "url", description: "LinkedIn profile URL" },
    { key: "youtube_url", label: "YouTube URL", type: "url", description: "YouTube channel URL" },
  ],
  theme: [
    { key: "primary_color", label: "Primary Color", type: "text", description: "Primary brand color" },
    { key: "secondary_color", label: "Secondary Color", type: "text", description: "Secondary brand color" },
    { key: "font_family", label: "Font Family", type: "text", description: "Main font family" },
  ],
  links: [
    { key: "portal_url", label: "Portal URL", type: "url", description: "Student portal URL" },
    { key: "external_links", label: "External Links", type: "json", description: "Additional external links" },
  ],
};

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: SiteSetting[] }>(
        "/admin/settings"
      );

      if (response.success) {
        const settingsMap: Record<string, SiteSetting> = {};
        response.data.forEach((setting) => {
          settingsMap[setting.key] = setting;
        });
        setSettings(settingsMap);

        // Initialize form data
        const initialFormData: Record<string, string> = {};
        Object.values(DEFAULT_SETTINGS).flat().forEach((defaultSetting) => {
          initialFormData[defaultSetting.key] =
            settingsMap[defaultSetting.key]?.value || "";
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("[Site Settings Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category?: string) => {
    try {
      setSaving(true);

      if (category) {
        // Save specific category
        const categorySettings = DEFAULT_SETTINGS[category as keyof typeof DEFAULT_SETTINGS] || [];
        const updates = categorySettings
          .filter((setting) => formData[setting.key] !== undefined)
          .map((setting) => ({
            key: setting.key,
            value: formData[setting.key] || "",
          }));

        await apiClient.put("/admin/settings", updates);
      } else {
        // Save all settings
        const updates = Object.keys(formData).map((key) => ({
          key,
          value: formData[key] || "",
        }));

        await apiClient.put("/admin/settings", updates);
      }

      await fetchSettings();
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("[Save Error]", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Site Settings</h1>
          <p className="text-gray-600">Manage global site configuration</p>
        </div>
        <Button onClick={() => handleSave()} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {SETTING_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const categorySettings = DEFAULT_SETTINGS[category.id as keyof typeof DEFAULT_SETTINGS] || [];

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(category.id)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save {category.title}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySettings.map((setting) => {
                  const currentSetting = settings[setting.key];

                  return (
                    <div key={setting.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.label}
                      </label>
                      {setting.type === "text" || setting.type === "url" || setting.type === "email" ? (
                        <Input
                          type={setting.type === "email" ? "email" : "text"}
                          value={formData[setting.key] || ""}
                          onChange={(e) => handleInputChange(setting.key, e.target.value)}
                          placeholder={setting.description}
                        />
                      ) : setting.type === "json" ? (
                        <textarea
                          value={formData[setting.key] || ""}
                          onChange={(e) => handleInputChange(setting.key, e.target.value)}
                          placeholder={setting.description}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={formData[setting.key] || ""}
                          onChange={(e) => handleInputChange(setting.key, e.target.value)}
                          placeholder={setting.description}
                        />
                      )}
                      {setting.description && (
                        <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                      )}
                      {currentSetting && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last updated: {new Date(currentSetting.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

