"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile, Order } from "@/types/database";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import { Eye, Mail, Phone, Calendar, ShoppingBag, DollarSign, XCircle } from "lucide-react";

interface CustomerProfile extends Profile {
  total_orders: number;
  total_spent: number;
}

export default function CustomersList() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected customer details state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // 1. Fetch profiles
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profErr) throw profErr;

      // 2. Fetch orders to sum orders count/spent
      const { data: orders, error: ordersErr } = await supabase
        .from("orders")
        .select("profile_id, grand_total");

      if (ordersErr) throw ordersErr;

      // 3. Map details
      const mapped: CustomerProfile[] = (profiles || []).map((p) => {
        const matchingOrders = orders?.filter((o) => o.profile_id === p.id) || [];
        const total_orders = matchingOrders.length;
        const total_spent = matchingOrders.reduce((sum, o) => sum + o.grand_total, 0);

        return {
          ...p,
          total_orders,
          total_spent,
        };
      });

      setCustomers(mapped);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load customers data";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (customer: CustomerProfile) => {
    setSelectedCustomer(customer);
    setLoadingOrders(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("profile_id", customer.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomerOrders(data || []);
    } catch {
      toast.error("Failed to load customer order logs");
    } finally {
      setLoadingOrders(false);
    }
  };

  const columns = [
    {
      key: "full_name",
      label: "Customer Name",
      sortable: true,
      render: (item: CustomerProfile) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold uppercase">
            {item.full_name?.charAt(0) || "U"}
          </div>
          <span className="font-bold text-foreground">{item.full_name || "New Account"}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email Address",
      sortable: true,
      render: (item: CustomerProfile) => (
        <span className="text-muted-foreground font-medium">{item.id.substring(0, 8)}... (Linked Account)</span>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      render: (item: CustomerProfile) => (
        <span className="text-muted-foreground">{item.phone || "—"}</span>
      ),
    },
    {
      key: "created_at",
      label: "Registered",
      sortable: true,
      render: (item: CustomerProfile) => (
        <span className="text-muted-foreground">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total_orders",
      label: "Orders Count",
      sortable: true,
      render: (item: CustomerProfile) => (
        <span className="font-heading font-black text-foreground">{item.total_orders} Orders</span>
      ),
    },
    {
      key: "total_spent",
      label: "Total Spent",
      sortable: true,
      render: (item: CustomerProfile) => (
        <span className="font-heading font-black text-accent">${item.total_spent.toFixed(2)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: CustomerProfile) => (
        <button
          onClick={() => handleOpenDetails(item)}
          className="h-8 w-8 rounded-full border border-border/80 bg-muted/5 hover:bg-muted/15 flex items-center justify-center text-foreground transition"
          aria-label="View Details"
        >
          <Eye className="h-4 w-4" />
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
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
          Customer Database
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-0.5">
          Browse customer profile details, monitor total order counts, and review registration logs.
        </p>
      </div>

      {/* Customers List Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search customer name..."
        searchKeys={["full_name"]}
      />

      {/* Customer Details overlay dialog */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
          <div className="glass-card border border-border bg-[#0B0B0B]/95 p-6 md:p-8 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto relative text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-border/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-lg uppercase">
                  {selectedCustomer.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-heading text-base font-black text-white leading-none">
                    {selectedCustomer.full_name || "New Client"}
                  </h3>
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider mt-1 block">
                    Customer Account Overview
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="h-8 w-8 rounded-full border border-border/60 hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition"
                aria-label="Close dialog"
              >
                <XCircle className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Profile info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-2 bg-muted/5 border border-border/20 p-4 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Account ID
                </span>
                <span className="text-white truncate font-medium">{selectedCustomer.id}</span>
              </div>
              <div className="flex flex-col gap-2 bg-muted/5 border border-border/20 p-4 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone Number
                </span>
                <span className="text-white font-medium">{selectedCustomer.phone || "No phone linked."}</span>
              </div>
              <div className="flex flex-col gap-2 bg-muted/5 border border-border/20 p-4 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Registered On
                </span>
                <span className="text-white font-medium">
                  {new Date(selectedCustomer.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-muted/5 border border-border/20 p-4 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-accent" /> Total Spent
                </span>
                <span className="text-accent font-heading font-black">
                  ${selectedCustomer.total_spent.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Orders list */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" /> Order Transaction History
              </span>

              {loadingOrders ? (
                <div className="flex justify-center py-6">
                  <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              ) : customerOrders.length === 0 ? (
                <span className="text-[10px] text-muted-foreground font-light text-center py-4 bg-muted/5 rounded-2xl border border-border/10">
                  No orders associated with this account.
                </span>
              ) : (
                <div className="divide-y divide-border/10 border border-border/20 bg-muted/5 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="p-3.5 flex justify-between items-center text-xs font-semibold">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-white">{order.order_number}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                          order.status === "delivered" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-white font-heading font-black">${order.grand_total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
