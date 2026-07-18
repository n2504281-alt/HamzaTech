"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AudioLines,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Product", href: "/admin/product", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Failed to log out";
      toast.error(errorMsg);
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-[#0B0B0B] border-r border-border/40 flex flex-col z-40 select-none shadow-xl"
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-border/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-white shrink-0">
            <AudioLines className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-heading font-black text-white tracking-wider text-base"
            >
              HamzaTech
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComp = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} className="block">
              <div
                className={`relative flex items-center gap-3.5 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? "text-white font-bold bg-accent/10 border border-accent/25"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-accent rounded-r-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <IconComp className={`h-5 w-5 shrink-0 ${isActive ? "text-accent" : "group-hover:text-white transition-colors"}`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs tracking-wide"
                  >
                    {item.name}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle & Logout */}
      <div className="p-4 border-t border-border/10 flex flex-col gap-2.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-3 py-3 rounded-2xl cursor-pointer hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all border border-transparent w-full"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold tracking-wide"
            >
              Logout
            </motion.span>
          )}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-8 w-8 rounded-full border border-border/20 bg-[#171717] items-center justify-center text-muted-foreground hover:text-white self-center transition-all"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
