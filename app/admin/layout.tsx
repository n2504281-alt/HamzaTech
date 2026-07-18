"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr || !user) {
          toast.error("Authentication required. Redirecting to login...");
          router.push("/login?redirect=/admin");
          return;
        }

        const { data: profile, error: profErr } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profErr || !profile || profile.role !== "admin") {
          toast.error("Unauthorized access. Admin role required.");
          router.push("/");
          return;
        }

        setAuthorized(true);
      } catch {
        toast.error("Security check failed.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center font-sans gap-4 select-none">
        <div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
          Authorizing Credentials...
        </span>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex transition-colors duration-300">
      {/* Sidebar Panel */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Layout */}
      <motion.div
        animate={{ paddingLeft: isCollapsed ? 76 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-w-0"
      >
        <Topbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
