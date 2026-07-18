"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User, Mail, Key, Camera, Save, Lock } from "lucide-react";

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    avatarUrl: "",
    email: "",
    role: "admin",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfile((prev) => ({
        ...prev,
        email: user.email || "",
      }));

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile((prev) => ({
          ...prev,
          fullName: data.full_name || "",
          avatarUrl: data.avatar_url || "",
          role: data.role || "admin",
        }));
      }
    } catch (err) {
      console.error("Failed to load profile details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.fullName,
          avatar_url: profile.avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile details updated successfully!");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update profile details";
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to avatars bucket
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      let bucket = "avatars";
      if (uploadErr) {
        // Fallback upload attempt
        const { error: fallbackErr } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (fallbackErr) {
          throw new Error("Ensure an 'avatars' or 'images' storage bucket is created in Supabase.");
        }
        bucket = "images";
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProfile((prev) => ({
        ...prev,
        avatarUrl: publicUrl,
      }));
      toast.success("Avatar image uploaded successfully.");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to upload avatar";
      toast.error(errMsg);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setChangingPass(true);
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });

      if (error) throw error;
      toast.success("Password updated successfully!");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update password";
      toast.error(errMsg);
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse text-left">
        <div className="h-8 w-64 bg-muted/20 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-[250px] bg-muted/15 rounded-3xl" />
          <div className="md:col-span-2 h-[250px] bg-muted/15 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none">
      
      {/* Title Panel */}
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
          Admin Profile Settings
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-0.5">
          Update your administrative details, upload avatars, and reset access passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Profile Avatar Card - 1 Column */}
        <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col items-center gap-4 text-center">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full border border-accent/30 overflow-hidden flex items-center justify-center bg-accent/5">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-accent" />
              )}
            </div>

            <label className="absolute bottom-0 right-0 h-9 w-9 bg-accent hover:bg-accent/90 rounded-full border border-card flex items-center justify-center text-white cursor-pointer shadow-lg transition-transform hover:scale-105">
              <Camera className="h-4.5 w-4.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                disabled={uploadingAvatar}
                className="hidden"
                aria-label="Upload profile image"
              />
            </label>
          </div>

          <div className="flex flex-col gap-0.5 mt-2">
            <h3 className="font-heading font-black text-base text-foreground leading-none">
              {profile.fullName || "Admin User"}
            </h3>
            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider mt-1 block">
              {profile.email}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-accent/15 text-accent border border-accent/20">
            {profile.role} account
          </span>
        </div>

        {/* Profile Info & Password reset - 2 Columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* General info form */}
          <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border/20 pb-3">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <User className="h-4 w-4 text-accent" /> Administrator Information
              </h3>
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="h-9 px-4 rounded-full bg-accent hover:bg-accent/90 text-white text-[10px] font-black transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Updating..." : "Save Details"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Linked Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="bg-muted/5 border border-border/30 rounded-2xl h-11 pl-10 pr-4 text-xs font-semibold text-muted-foreground/60 w-full cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reset password form */}
          <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
            <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3 flex items-center gap-2">
              <Key className="h-4 w-4 text-accent" /> Reset Password Settings
            </h3>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">New Access Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="h-11 px-6 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/15 text-accent text-xs font-black transition flex items-center gap-1.5 self-start shadow-sm disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                {changingPass ? "Changing Password..." : "Update Security Password"}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
