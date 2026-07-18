"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/admin/stat-card";
import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, DollarSign, Award, Inbox, Star } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  stock: number;
  pendingOrders: number;
}

import { Order, Review } from "@/types/database";

interface RecentReview extends Review {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    revenue: 0,
    stock: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();

        // 1. Fetch Orders Count & Total Paid Revenue
        const { data: allOrders } = await supabase
          .from("orders")
          .select("grand_total, status, payment_status");

        const totalOrders = allOrders?.length || 0;
        const revenue = allOrders
          ?.filter((o) => o.payment_status === "paid")
          .reduce((sum, o) => sum + o.grand_total, 0) || 0;

        const pendingOrders = allOrders?.filter((o) => o.status === "pending").length || 0;

        // 2. Fetch Products Inventory Stock
        const { data: products } = await supabase
          .from("products")
          .select("stock");
        const stock = products?.reduce((sum, p) => sum + p.stock, 0) || 0;

        setStats({
          totalOrders,
          revenue,
          stock,
          pendingOrders,
        });

        // 3. Fetch Recent Orders
        const { data: ordersList } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        setRecentOrders(ordersList || []);

        // 4. Fetch Recent Reviews
        const { data: reviewsList } = await supabase
          .from("reviews")
          .select("*, profiles(full_name, avatar_url)")
          .order("created_at", { ascending: false })
          .limit(4);
        setRecentReviews(reviewsList || []);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse text-left">
        <div className="h-10 w-48 bg-muted/20 rounded-full mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/15 rounded-3xl" />
          ))}
        </div>
        <div className="h-[280px] bg-muted/15 rounded-3xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none">
      
      {/* Title Header */}
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
          Aura Control Panel
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-0.5">
          General overview and transaction highlights for HamzaTech Aura X1.
        </p>
      </div>

      {/* Analytics KPI Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+18.4%"
          changeType="increase"
          icon={ShoppingBag}
          description="from last month"
        />
        <StatCard
          title="Paid Revenue"
          value={`$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="+24.1%"
          changeType="increase"
          icon={DollarSign}
          description="from last month"
        />
        <StatCard
          title="Average Conversion"
          value="3.82%"
          change="-0.5%"
          changeType="decrease"
          icon={Award}
          description="from last week"
        />
        <StatCard
          title="Product Inventory"
          value={`${stats.stock} Units`}
          change={stats.stock < 15 ? "Low Stock" : "Healthy"}
          changeType={stats.stock < 15 ? "decrease" : "increase"}
          icon={Inbox}
          description="headphone reserves"
        />
      </div>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <AnalyticsChart />
        </div>

        {/* Small pending card */}
        <StatCard
          title="Active Pending Orders"
          value={`${stats.pendingOrders} Orders`}
          change={stats.pendingOrders > 0 ? "Action Required" : "Up to date"}
          changeType={stats.pendingOrders > 0 ? "decrease" : "neutral"}
          icon={ShoppingBag}
          description="waiting ship processing"
        />
      </div>

      {/* Split Recent Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        
        {/* Recent Orders List */}
        <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border/20 pb-4">
            <h3 className="font-heading text-sm font-black text-foreground uppercase tracking-wide">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-[10px] text-accent hover:underline font-bold"
            >
              Manage Orders
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground font-light py-4 text-center">No orders placed yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-foreground">{order.order_number}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      order.status === "delivered"
                        ? "bg-green-500/10 text-green-500"
                        : order.status === "cancelled"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-orange-500/10 text-orange-500"
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-heading font-black text-foreground">
                      ${order.grand_total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reviews List */}
        <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border/20 pb-4">
            <h3 className="font-heading text-sm font-black text-foreground uppercase tracking-wide">
              Recent Reviews
            </h3>
            <Link
              href="/admin/reviews"
              className="text-[10px] text-accent hover:underline font-bold"
            >
              Verify Reviews
            </Link>
          </div>

          <div className="flex flex-col gap-4.5">
            {recentReviews.length === 0 ? (
              <p className="text-xs text-muted-foreground font-light py-4 text-center">No customer reviews yet.</p>
            ) : (
              recentReviews.map((rev) => (
                <div key={rev.id} className="flex gap-3 text-xs">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold uppercase shrink-0">
                    {rev.profiles?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-foreground truncate">
                        {rev.profiles?.full_name || "Anonymous Tester"}
                      </span>
                      <div className="flex items-center gap-0.5 text-accent font-bold text-[10px]">
                        <Star className="h-3 w-3 fill-accent shrink-0" />
                        {rev.rating}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-light leading-relaxed line-clamp-2">
                      &quot;{rev.review}&quot;
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
