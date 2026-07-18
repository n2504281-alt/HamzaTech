import { create } from "zustand";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AdminState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  addNotification: (title: string, message: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  orderFilter: "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  setOrderFilter: (filter: "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled") => void;
  reviewFilter: "all" | "approved" | "pending" | "rejected";
  setReviewFilter: (filter: "all" | "approved" | "pending" | "rejected") => void;
  customerSearch: string;
  setCustomerSearch: (query: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  notifications: [
    {
      id: "1",
      title: "New Order #HT-4829-AX1",
      message: "Alexander Mercer placed an order for Aura X1 Carbon Black.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: "2",
      title: "Stock Alert: Aura X1",
      message: "Inventory level for Ceramic White has dropped below 10 units.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "New Product Review",
      message: "Elena Rostova posted a 5-star review on Aura X1.",
      time: "3 hours ago",
      read: true,
    },
  ],
  addNotification: (title, message) =>
    set((state) => ({
      notifications: [
        {
          id: Math.random().toString(),
          title,
          message,
          time: "Just now",
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  clearNotifications: () => set({ notifications: [] }),
  orderFilter: "all",
  setOrderFilter: (filter) => set({ orderFilter: filter }),
  reviewFilter: "all",
  setReviewFilter: (filter) => set({ reviewFilter: filter }),
  customerSearch: "",
  setCustomerSearch: (query) => set({ customerSearch: query }),
}));
