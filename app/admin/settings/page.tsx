"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Save, Globe, Palette, Share2, Upload } from "lucide-react";

export default function StoreSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "HamzaTech",
    storeEmail: "office@hamzatech.com",
    supportEmail: "support@hamzatech.com",
    phoneNumber: "+1 (555) 901-AURA",
    facebookLink: "https://facebook.com/hamzatech",
    twitterLink: "https://twitter.com/hamzatech",
    instagramLink: "https://instagram.com/hamzatech",
    logoUrl: "",
    faviconUrl: "",
    accentColor: "#F97316",
    defaultTheme: "dark",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "store_config")
        .single();

      if (!error && data) {
        setSettings((prev) => ({
          ...prev,
          ...data.value,
        }));
      }
    } catch {
      console.log("No store config found in database, loading default values.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `assets/${fileName}`;

      // Upload attempt
      const { error: uploadErr } = await supabase.storage
        .from("assets")
        .upload(filePath, file);

      let bucket = "assets";
      if (uploadErr) {
        // Fallback upload attempt
        const { error: fallbackErr } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (fallbackErr) {
          throw new Error("Ensure a 'assets' or 'images' storage bucket is created in Supabase.");
        }
        bucket = "images";
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      handleFieldChange("logoUrl", publicUrl);
      toast.success("Logo uploaded successfully.");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to upload logo.";
      toast.error(errMsg);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from("settings")
        .upsert({
          key: "store_config",
          value: settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Store settings updated successfully in database!");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to save settings";
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse text-left">
        <div className="h-8 w-64 bg-muted/20 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[300px] bg-muted/15 rounded-3xl" />
          <div className="h-[300px] bg-muted/15 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none">
      
      {/* Title Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
            Store Settings
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Configure contact addresses, support routes, social tags, and core branding attributes.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="h-11 px-6 rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-black transition flex items-center gap-2 self-start sm:self-center shadow-lg disabled:opacity-50"
        >
          <Save className="h-4.5 w-4.5" />
          {saving ? "Saving Configuration..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Contact and Metadata */}
        <div className="flex flex-col gap-6">
          
          {/* General settings */}
          <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
            <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" /> Store Metadata & Brand Identity
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleFieldChange("storeName", e.target.value)}
                className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Admin Store Email</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleFieldChange("storeEmail", e.target.value)}
                  className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Customer Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleFieldChange("supportEmail", e.target.value)}
                  className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Store Phone Number</label>
              <input
                type="text"
                value={settings.phoneNumber}
                onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
            <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-accent" /> Social Media Platforms
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Facebook Link</label>
              <input
                type="text"
                value={settings.facebookLink}
                onChange={(e) => handleFieldChange("facebookLink", e.target.value)}
                className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Twitter Link</label>
              <input
                type="text"
                value={settings.twitterLink}
                onChange={(e) => handleFieldChange("twitterLink", e.target.value)}
                className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-muted-foreground">Instagram Link</label>
              <input
                type="text"
                value={settings.instagramLink}
                onChange={(e) => handleFieldChange("instagramLink", e.target.value)}
                className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>
          </div>

        </div>

        {/* Themes and Branding uploads */}
        <div className="flex flex-col gap-6">
          
          {/* Theme custom colors */}
          <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
            <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-accent" /> Preset Style & Accent Presets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Accent Hex Code</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                    className="h-11 w-12 bg-transparent border-0 cursor-pointer rounded-xl shrink-0"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                    className="flex-1 bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Default Interface Theme</label>
                <select
                  value={settings.defaultTheme}
                  onChange={(e) => handleFieldChange("defaultTheme", e.target.value)}
                  className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 cursor-pointer"
                >
                  <option value="dark" className="bg-card text-foreground">Aura Dark Presets (Default)</option>
                  <option value="light" className="bg-card text-foreground">Aura Light Presets</option>
                </select>
              </div>
            </div>
          </div>

          {/* Branding assets */}
          <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
            <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3 flex items-center gap-2">
              Settings Branding Assets
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Store Logo (Public Asset)</label>
                
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-muted/10 border border-border/40 flex items-center justify-center overflow-hidden shrink-0">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Globe className="h-6 w-6 text-muted-foreground/30" />
                    )}
                  </div>

                  <div className="relative border border-dashed border-border hover:border-accent/40 rounded-2xl p-4 flex-1 text-center transition cursor-pointer flex flex-col items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadLogo}
                      disabled={uploadingLogo}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      aria-label="Upload logo image"
                    />
                    <Upload className="h-4.5 w-4.5 text-accent/80 mb-1" />
                    <span className="text-[10px] font-bold text-foreground">
                      {uploadingLogo ? "Uploading Logo..." : "Upload Logo Asset"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Manual Favicon URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/favicon.ico"
                  value={settings.faviconUrl}
                  onChange={(e) => handleFieldChange("faviconUrl", e.target.value)}
                  className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
