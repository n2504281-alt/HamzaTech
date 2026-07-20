"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order, Address } from "@/types/database";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import {
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  User,
  FileText,
} from "lucide-react";

interface OrderItemWithProduct {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
  variant: string;
  products: {
    name: string;
    images: string[] | null;
  } | null;
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemWithProduct[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load orders";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    try {
      const supabase = createClient();
      
      // 1. Fetch Order Items with Product details
      const { data: items, error: itemsErr } = await supabase
        .from("order_items")
        .select("*, products(name, images)")
        .eq("order_id", order.id);

      if (itemsErr) throw itemsErr;
      setOrderItems((items as OrderItemWithProduct[]) || []);

      // 2. Fetch Shipping Address details if available
      if (order.shipping_address_id) {
        const { data: address, error: addressErr } = await supabase
          .from("addresses")
          .select("*")
          .eq("id", order.shipping_address_id)
          .single();

        if (!addressErr) setShippingAddress(address);
      } else {
        setShippingAddress(null);
      }
    } catch {
      toast.error("Failed to load order specification details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const supabase = createClient();

      const updateFields: Partial<Order> = { status: newStatus };
      if (newStatus === "shipped") {
        updateFields.shipping_status = "shipped";
      } else if (newStatus === "delivered") {
        updateFields.shipping_status = "delivered";
        updateFields.payment_status = "paid";
      }

      const { error } = await supabase
        .from("orders")
        .update(updateFields)
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...updateFields } : null));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update order state";
      toast.error(errMsg);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: Order["payment_status"]) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newPaymentStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast.success(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, payment_status: newPaymentStatus } : null));
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update payment status";
      toast.error(errMsg);
    }
  };

  const exportOrdersCSV = () => {
    if (!orders.length) {
      toast.error("No orders available to export.");
      return;
    }

    const headers = ["Order Number", "Date", "Status", "Payment Status", "Shipping Status", "Subtotal", "Tax", "Shipping Fee", "Grand Total"];
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString(),
      o.status,
      o.payment_status,
      o.shipping_status,
      o.subtotal,
      o.tax,
      o.shipping_fee,
      o.grand_total,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HamzaTech_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders CSV exported successfully!");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const columns = [
    {
      key: "order_number",
      label: "Order #",
      sortable: true,
      render: (item: Order) => (
        <span className="font-heading font-black text-foreground">{item.order_number}</span>
      ),
    },
    {
      key: "created_at",
      label: "Order Date",
      sortable: true,
      render: (item: Order) => (
        <span className="font-medium text-muted-foreground">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "grand_total",
      label: "Total Price",
      sortable: true,
      render: (item: Order) => (
        <span className="font-heading font-black text-foreground">${item.grand_total.toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Order) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
          item.status === "delivered"
            ? "bg-green-500/10 text-green-500 border border-green-500/20"
            : item.status === "cancelled"
            ? "bg-red-500/10 text-red-500 border border-red-500/20"
            : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "payment_status",
      label: "Payment",
      sortable: true,
      render: (item: Order) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
          item.payment_status === "paid"
            ? "bg-green-500/10 text-green-500 border border-green-500/20"
            : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {item.payment_status}
        </span>
      ),
    },
    {
      key: "shipping_status",
      label: "Shipping",
      sortable: true,
      render: (item: Order) => (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
          item.shipping_status === "delivered"
            ? "bg-green-500/10 text-green-500 border border-green-500/20"
            : item.shipping_status === "shipped"
            ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
            : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
        }`}>
          {item.shipping_status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Order) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenDetails(item)}
            className="h-8 w-8 rounded-full border border-border/80 bg-muted/5 hover:bg-muted/15 flex items-center justify-center text-foreground transition"
            aria-label="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {item.status !== "delivered" && item.status !== "cancelled" && (
            <>
              <button
                onClick={() => handleUpdateStatus(item.id, "shipped")}
                className="h-8 w-8 rounded-full border border-green-500/20 bg-green-500/5 hover:bg-green-500/15 flex items-center justify-center text-green-500 transition"
                aria-label="Mark Shipped"
                title="Mark as Shipped"
              >
                <Truck className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(item.id, "delivered")}
                className="h-8 w-8 rounded-full border-green-500/20 bg-green-500/5 hover:bg-green-500/15 flex items-center justify-center text-green-500 transition"
                aria-label="Mark Delivered"
                title="Mark as Delivered"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(item.id, "cancelled")}
                className="h-8 w-8 rounded-full border-red-500/20 bg-red-500/5 hover:bg-red-500/15 flex items-center justify-center text-red-500 transition"
                aria-label="Cancel Order"
                title="Cancel Order"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
            Order Management
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Process payments, manage shipping routes, cancel receipts, and inspect order invoices.
          </p>
        </div>

        <button
          onClick={exportOrdersCSV}
          className="h-10 rounded-full border border-border/60 bg-muted/10 hover:bg-muted/20 text-foreground text-xs font-bold px-5 transition flex items-center gap-2"
        >
          <FileText className="h-4 w-4 text-accent" /> Export Orders CSV
        </button>
      </div>

      {/* Orders List Table */}
      <DataTable
        columns={columns}
        data={orders}
        searchPlaceholder="Search order number..."
        searchKeys={["order_number"]}
        filterKey="status"
        filterOptions={[
          { label: "Pending Orders", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Shipped Orders", value: "shipped" },
          { label: "Delivered", value: "delivered" },
          { label: "Cancelled Receipts", value: "cancelled" },
        ]}
      />

      {/* Glassmorphic Order Details Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
          <div className="glass-card border border-border bg-[#0B0B0B]/95 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto relative text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-border/20 pb-4">
              <div>
                <span className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> {selectedOrder.status}
                </span>
                <h3 className="font-heading text-lg font-black text-white mt-1">
                  Order details {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full border border-border/60 hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition"
                aria-label="Close dialog"
              >
                <XCircle className="h-4.5 w-4.5" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-wider animate-pulse">Loading Details...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Meta details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="flex flex-col gap-2.5 bg-muted/5 border border-border/20 p-4.5 rounded-2xl">
                    <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> Delivery Address
                    </span>
                    {shippingAddress ? (
                      <div className="flex flex-col gap-0.5 text-white font-medium">
                        <span>{shippingAddress.street}</span>
                        <span>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</span>
                        <span>{shippingAddress.country}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-light">No physical address linked.</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5 bg-muted/5 border border-border/20 p-4.5 rounded-2xl">
                    <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Order Meta Details
                    </span>
                    <div className="flex flex-col gap-1 text-white">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-light">Created At:</span>
                        <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-light">Payment:</span>
                        <span className="font-bold text-accent">{selectedOrder.payment_status}</span>
                      </div>
                      {selectedOrder.order_notes && (
                        <div className="flex flex-col gap-0.5 mt-1 border-t border-border/10 pt-1">
                          <span className="text-muted-foreground font-light">Notes:</span>
                          <span className="italic font-light text-[10px] text-muted-foreground">{selectedOrder.order_notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Summary list */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">
                    Purchased Item Specifications
                  </span>
                  
                  <div className="divide-y divide-border/10 bg-muted/5 border border-border/20 rounded-2xl overflow-hidden">
                    {orderItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between text-xs font-semibold gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 border border-border/30 rounded-xl overflow-hidden shrink-0">
                            {item.products?.images && item.products.images.length > 0 ? (
                              <img src={item.products.images[0]} alt="Pic" className="w-full h-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-muted/20" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-white truncate">{item.products?.name || item.variant || "Aura X1"}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {item.products?.name ? `Color Variant: ${item.variant}` : "Special Accessory Set"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-right shrink-0">
                          <span className="text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="text-white font-heading font-black">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment breakdown */}
                <div className="flex flex-col gap-2.5 bg-muted/5 border border-border/20 p-4.5 rounded-2xl text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-light">Subtotal</span>
                    <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-light">Discount deductions</span>
                    <span className="text-red-500">-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-light">Estimated Tax (8%)</span>
                    <span className="text-white">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-light">Shipping Fee</span>
                    <span className="text-white">${selectedOrder.shipping_fee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border/10 my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-black">Grand Total</span>
                    <span className="text-accent font-heading font-black">${selectedOrder.grand_total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Status Manual Toggle & Print Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/15 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Payment Status:</span>
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, "paid")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                        selectedOrder.payment_status === "paid"
                          ? "bg-green-500/20 text-green-500 border-green-500/40"
                          : "bg-muted/10 text-muted-foreground hover:bg-muted/20 border-border/40"
                      }`}
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, "unpaid")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                        selectedOrder.payment_status === "unpaid"
                          ? "bg-orange-500/20 text-orange-500 border-orange-500/40"
                          : "bg-muted/10 text-muted-foreground hover:bg-muted/20 border-border/40"
                      }`}
                    >
                      Mark Unpaid
                    </button>
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, "refunded")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                        selectedOrder.payment_status === "refunded"
                          ? "bg-red-500/20 text-red-500 border-red-500/40"
                          : "bg-muted/10 text-muted-foreground hover:bg-muted/20 border-border/40"
                      }`}
                    >
                      Refunded
                    </button>
                  </div>

                  <button
                    onClick={handlePrintInvoice}
                    className="px-4 h-8 rounded-full border border-border/50 bg-muted/10 hover:bg-muted/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5 text-accent" /> Print Invoice
                  </button>
                </div>

                {/* Change shipping status inside modal */}
                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <div className="flex flex-wrap gap-3 border-t border-border/15 pt-4">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")}
                      className="px-5 h-10 rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md"
                    >
                      <Truck className="h-4 w-4" /> Ship Package
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                      className="px-5 h-10 rounded-full border border-green-500/20 bg-green-500/5 hover:bg-green-500/15 text-green-500 text-xs font-black transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark Delivered
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                      className="px-5 h-10 rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-500 text-xs font-black transition flex items-center gap-1.5 ml-auto"
                    >
                      <XCircle className="h-4 w-4" /> Cancel Invoice
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
