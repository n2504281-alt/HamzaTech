export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  image: string;
  description: string;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  location: string;
  avatar: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "apparel",
    name: "Minimal Apparel",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    count: 124,
  },
  {
    id: "watches",
    name: "Chrono Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    count: 42,
  },
  {
    id: "leather",
    name: "Leather Goods",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
    count: 85,
  },
  {
    id: "audio",
    name: "Pure Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    count: 36,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aura Premium Chronograph",
    category: "Chrono Watches",
    price: 349,
    oldPrice: 429,
    discount: 18,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Handcrafted surgical stainless steel casing with a sapphire glass lens, powered by a Swiss quartz movement.",
    isBestSeller: true,
  },
  {
    id: "p2",
    name: "Classic Saddle Leather Tote",
    category: "Leather Goods",
    price: 189,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    description: "Full-grain vegetable-tanned Italian leather with hand-stitched details and solid brass hardware.",
    isBestSeller: true,
  },
  {
    id: "p3",
    name: "H1 Wireless Over-Ear Headphones",
    category: "Pure Audio",
    price: 299,
    oldPrice: 350,
    discount: 15,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Active noise cancellation, 40-hour battery life, and custom studio-grade drivers.",
    isBestSeller: true,
    isFlashSale: true,
  },
  {
    id: "p4",
    name: "Minimalist Wool Trench Coat",
    category: "Minimal Apparel",
    price: 450,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    description: "Premium merino wool blend with a relaxed silhouette and clean tailored lines.",
    isBestSeller: true,
  },
  {
    id: "p5",
    name: "Sleek Aluminum Desk Organizer",
    category: "Lifestyle",
    price: 79,
    oldPrice: 99,
    discount: 20,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    description: "Precision-milled anodized aluminum organizer with modular magnetic trays.",
    isFlashSale: true,
  },
  {
    id: "p6",
    name: "Full-Grain Leather Passport Wallet",
    category: "Leather Goods",
    price: 65,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1627124118123-e4d31489d5cd?auto=format&fit=crop&w=800&q=80",
    description: "Sleek travel companion featuring RFID protection, coin pouch, and four card slots.",
    isFlashSale: true,
  },
  {
    id: "p7",
    name: "Handmade Ceramic Espresso Set",
    category: "Lifestyle",
    price: 45,
    oldPrice: 55,
    discount: 18,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description: "A pair of custom matte black finish stoneware cups with organic cork saucers.",
    isBestSeller: false,
    isFlashSale: true,
  },
  {
    id: "p8",
    name: "Premium Linen Lounge Shirt",
    category: "Minimal Apparel",
    price: 110,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    description: "Breathable 100% Belgian flax linen shirt designed for ultimate comfort and elegance.",
    isBestSeller: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Alexander Mercer",
    role: "Creative Director",
    content: "The attention to detail in these products is incredible. The packaging, the premium materials, and the timeless design feel like true luxury.",
    rating: 5,
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "t2",
    name: "Sophia Lindqvist",
    role: "Architect",
    content: "Minimalism is not about having less, it's about having only what matters. AURA products embody this philosophy flawlessly. My desk layout is finally complete.",
    rating: 5,
    location: "Stockholm, Sweden",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "t3",
    name: "René Takahashi",
    role: "Industrial Designer",
    content: "I appreciate the precision-milled aluminum organizer. From an engineering standpoint, the tolerances are incredibly tight and the finish is flawless.",
    rating: 5,
    location: "Tokyo, Japan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export const PARTNERS = [
  { name: "Vogue", logo: "VOGUE" },
  { name: "GQ", logo: "GQ" },
  { name: "Hypebeast", logo: "HYPEBEAST" },
  { name: "Highsnobiety", logo: "HIGHSNOBIETY" },
  { name: "Esquire", logo: "ESQUIRE" },
];

export const INSTAGRAM_IMAGES = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80",
];
