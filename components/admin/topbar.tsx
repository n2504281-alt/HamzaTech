"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, Sparkles, User, LogOut, ChevronDown, Settings, RefreshCw, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import { useAdminStore } from "@/store/adminStore";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery, notifications, markAllNotificationsRead, clearNotifications } = useAdminStore();
  const [mounted, setMounted] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAdminName(user.user_metadata?.full_name || user.email || "Admin User");
        supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              if (data.full_name) setAdminName(data.full_name);
              if (data.avatar_url) setAdminAvatar(data.avatar_url);
            }
          });
      }
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRefreshData = () => {
    toast.success("Synchronizing dashboard analytics...");
    router.refresh();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully.");
    router.push("/");
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <header className="h-20 border-b border-border/40 bg-background/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 select-none">
      {/* Search Input Bar */}
      <div className="relative w-72 max-w-xs hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Global dashboard search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-muted/10 border border-border/60 rounded-full h-10 pl-9 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/45"
        />
      </div>
      <div className="sm:hidden" />

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowQuickActions(!showQuickActions);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="h-10 px-4 rounded-full border border-border/80 bg-muted/5 hover:bg-muted/10 text-xs font-bold text-foreground transition flex items-center gap-1.5"
            aria-label="Quick Actions"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            Quick Actions
            <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
          </button>
          
          {showQuickActions && (
            <div className="absolute right-0 mt-2.5 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl flex flex-col gap-1 text-left">
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  handleRefreshData();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/15 transition-all text-left w-full"
              >
                <RefreshCw className="h-4 w-4 text-accent" />
                Sync Analytics
              </button>
              <button
                onClick={() => {
                  setShowQuickActions(false);
                  router.push("/");
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/15 transition-all text-left w-full"
              >
                <ExternalLink className="h-4 w-4 text-accent" />
                Go to Storefront
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-full border border-border/80 bg-muted/5 hover:bg-muted/10 flex items-center justify-center text-foreground transition"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-accent" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickActions(false);
              setShowProfileMenu(false);
            }}
            className="h-10 w-10 rounded-full border border-border/80 bg-muted/5 hover:bg-muted/10 flex items-center justify-center text-foreground transition relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[9px] font-black text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-3xl border border-border bg-card shadow-2xl overflow-hidden z-50 text-left">
              <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between bg-muted/5">
                <span className="text-xs font-black uppercase tracking-wider text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-accent hover:underline font-bold"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-border/10">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">No recent notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 flex flex-col gap-1 transition ${n.read ? "bg-transparent" : "bg-accent/5"}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-foreground">{n.title}</span>
                        <span className="text-[9px] text-muted-foreground shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-light leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-5 py-3 border-t border-border/20 bg-muted/5 text-center">
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] text-muted-foreground hover:text-foreground font-bold transition"
                  >
                    Clear All History
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowQuickActions(false);
            }}
            className="flex items-center gap-2.5 focus:outline-none"
            aria-label="Profile options"
          >
            {adminAvatar ? (
              <img
                src={adminAvatar}
                alt="Avatar"
                className="h-9 w-9 rounded-full object-cover border border-accent/30"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                <User className="h-4.5 w-4.5" />
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left shrink-0">
              <span className="text-xs font-bold text-foreground leading-none">{adminName}</span>
              <span className="text-[9px] text-muted-foreground font-semibold mt-1">Platform Admin</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-52 rounded-2xl border border-border bg-card p-2 shadow-xl flex flex-col gap-1 text-left z-50">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/admin/profile");
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/15 transition-all text-left w-full"
              >
                <User className="h-4 w-4 text-accent" />
                My Profile
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/admin/settings");
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/15 transition-all text-left w-full"
              >
                <Settings className="h-4 w-4 text-accent" />
                Store Settings
              </button>
              <div className="border-t border-border/10 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-all text-left w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
