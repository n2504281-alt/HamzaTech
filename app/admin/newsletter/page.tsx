"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import { Download, Mail, Calendar, Check, X } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  active: boolean;
  created_at: string;
}

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load subscribers list";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Subscriber status updated.`);
      fetchSubscribers();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update subscriber state";
      toast.error(errMsg);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error("No subscribers to export.");
      return;
    }

    try {
      // 1. Build CSV header and lines
      const headers = ["ID", "Email", "Status", "Joined Date"];
      const rows = subscribers.map((s) => [
        s.id,
        s.email,
        s.active ? "Active" : "Inactive",
        new Date(s.created_at).toISOString(),
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

      // 2. Trigger browser download trigger
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `hamzatech_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV file downloaded successfully!");
    } catch {
      toast.error("Failed to generate CSV export.");
    }
  };

  const columns = [
    {
      key: "email",
      label: "Subscriber Email",
      sortable: true,
      render: (item: Subscriber) => (
        <div className="flex items-center gap-2.5">
          <Mail className="h-4.5 w-4.5 text-accent shrink-0" />
          <span className="font-bold text-foreground">{item.email}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Subscription Date",
      sortable: true,
      render: (item: Subscriber) => (
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(item.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "active",
      label: "Subscription Status",
      sortable: true,
      render: (item: Subscriber) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
          item.active
            ? "bg-green-500/10 text-green-500 border border-green-500/20"
            : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {item.active ? "Active" : "Opted Out"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Subscriber) => (
        <button
          onClick={() => handleToggleStatus(item.id, item.active)}
          className={`h-8 px-4 rounded-full border text-[10px] font-bold transition flex items-center gap-1 ${
            item.active
              ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-500"
              : "border-green-500/20 bg-green-500/5 hover:bg-green-500/15 text-green-500"
          }`}
          aria-label="Toggle subscriber active status"
        >
          {item.active ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          {item.active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse text-left">
        <div className="h-8 w-64 bg-muted/20 rounded-full" />
        <div className="h-[400px] bg-muted/15 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none relative">
      
      {/* Title Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Monitor registered active user subscriptions and sync database emails with newsletter tools.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="h-11 px-6 rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-black transition flex items-center gap-2 self-start sm:self-center shadow-lg"
          aria-label="Export subscribers list to CSV file"
        >
          <Download className="h-4.5 w-4.5" />
          Export to CSV
        </button>
      </div>

      {/* Table grid */}
      <DataTable
        columns={columns}
        data={subscribers}
        searchPlaceholder="Search subscriber email..."
        searchKeys={["email"]}
        filterKey="active"
        filterOptions={[
          { label: "Active Subscriptions", value: "true" },
          { label: "Opted Out", value: "false" },
        ]}
      />

    </div>
  );
}
