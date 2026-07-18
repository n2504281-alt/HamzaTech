"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/database";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Upload,
} from "lucide-react";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Specifications state helper
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  
  // Features state helper
  const [newFeature, setNewFeature] = useState("");
  
  // Manual URL helper
  const [manualImageUrl, setManualImageUrl] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      if (data && data.length > 0) {
        setSelectedProduct(data[0]);
        setEditedProduct(JSON.parse(JSON.stringify(data[0]))); // deep clone
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load products";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditedProduct(JSON.parse(JSON.stringify(product)));
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setEditedProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim() || !editedProduct) return;
    const currentFeatures = editedProduct.features || [];
    handleFieldChange("features", [...currentFeatures, newFeature.trim()]);
    setNewFeature("");
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editedProduct) return;
    const currentFeatures = [...(editedProduct.features || [])];
    currentFeatures.splice(idx, 1);
    handleFieldChange("features", currentFeatures);
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim() || !editedProduct) return;
    const currentSpecs = { ...(editedProduct.specifications || {}) };
    currentSpecs[specKey.trim()] = specVal.trim();
    handleFieldChange("specifications", currentSpecs);
    setSpecKey("");
    setSpecVal("");
  };

  const handleRemoveSpec = (key: string) => {
    if (!editedProduct) return;
    const currentSpecs = { ...(editedProduct.specifications || {}) };
    delete currentSpecs[key];
    handleFieldChange("specifications", currentSpecs);
  };

  const handleAddManualImage = () => {
    if (!manualImageUrl.trim() || !editedProduct) return;
    const currentImages = editedProduct.images || [];
    handleFieldChange("images", [...currentImages, manualImageUrl.trim()]);
    setManualImageUrl("");
    toast.success("Image URL added to list");
  };

  const handleRemoveImage = (idx: number) => {
    if (!editedProduct) return;
    const currentImages = [...(editedProduct.images || [])];
    currentImages.splice(idx, 1);
    handleFieldChange("images", currentImages);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editedProduct) return;

    try {
      setUploading(true);
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload attempt
      const { error: uploadErr } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      let bucket = "products";
      if (uploadErr) {
        // Fallback upload attempt
        const { error: fallbackErr } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (fallbackErr) {
          throw new Error("Ensure a 'products' or 'images' storage bucket is created in Supabase.");
        }
        bucket = "images";
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const currentImages = editedProduct.images || [];
      handleFieldChange("images", [...currentImages, publicUrl]);
      toast.success("Image uploaded successfully.");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "File upload failed.";
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editedProduct) return;
    try {
      setSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from("products")
        .update({
          name: editedProduct.name,
          slug: editedProduct.slug,
          description: editedProduct.description,
          short_description: editedProduct.short_description,
          price: Number(editedProduct.price),
          compare_price: editedProduct.compare_price ? Number(editedProduct.compare_price) : null,
          stock: Number(editedProduct.stock),
          sku: editedProduct.sku,
          category: editedProduct.category,
          images: editedProduct.images,
          specifications: editedProduct.specifications,
          features: editedProduct.features,
          status: editedProduct.status,
        })
        .eq("id", editedProduct.id);

      if (error) throw error;
      toast.success("Product saved successfully!");
      fetchProducts();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to update product details";
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse text-left">
        <div className="h-8 w-64 bg-muted/20 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] bg-muted/15 rounded-3xl" />
          <div className="h-[400px] bg-muted/15 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none">
      
      {/* Title Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
            Product Management
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Configure catalog specifications, pricing lists, stock alerts, and media contents.
          </p>
        </div>

        {editedProduct && (
          <button
            onClick={handleSaveProduct}
            disabled={saving}
            className="h-11 px-6 rounded-full bg-accent hover:bg-accent/90 text-white text-xs font-black transition flex items-center gap-2 self-start sm:self-center shadow-lg disabled:opacity-50"
          >
            <Save className="h-4.5 w-4.5" />
            {saving ? "Saving Changes..." : "Save Product Details"}
          </button>
        )}
      </div>

      {/* Selector dropdown if multiple products exist */}
      {products.length > 1 && (
        <div className="flex gap-2 items-center bg-muted/10 p-2 rounded-2xl border border-border/50 self-start">
          <span className="text-[10px] font-black uppercase text-muted-foreground px-2">Edit Product:</span>
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProduct(p)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedProduct?.id === p.id ? "bg-accent text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {!editedProduct ? (
        <div className="glass-card border border-border p-12 rounded-3xl text-center text-xs text-muted-foreground">
          No product loaded. Click update catalog to create first product.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main settings forms - Left 2 Columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* General Information Card */}
            <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3">
                General Product Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Product Title</label>
                  <input
                    type="text"
                    value={editedProduct.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">URL Slug</label>
                  <input
                    type="text"
                    value={editedProduct.slug || ""}
                    onChange={(e) => handleFieldChange("slug", e.target.value)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Short Summary</label>
                <input
                  type="text"
                  value={editedProduct.short_description || ""}
                  onChange={(e) => handleFieldChange("short_description", e.target.value)}
                  className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Description Details</label>
                <textarea
                  value={editedProduct.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  rows={4}
                  className="bg-muted/10 border border-border/80 rounded-2xl p-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 resize-y"
                />
              </div>
            </div>

            {/* Inventory and Pricing Details */}
            <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3">
                Pricing & Reserves Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Retail Price ($)</label>
                  <input
                    type="number"
                    value={editedProduct.price || 0}
                    onChange={(e) => handleFieldChange("price", Number(e.target.value))}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Compare Price ($)</label>
                  <input
                    type="number"
                    value={editedProduct.compare_price || ""}
                    onChange={(e) => handleFieldChange("compare_price", e.target.value ? Number(e.target.value) : null)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">SKU Reference</label>
                  <input
                    type="text"
                    value={editedProduct.sku || ""}
                    onChange={(e) => handleFieldChange("sku", e.target.value)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Stock Reserves</label>
                  <input
                    type="number"
                    value={editedProduct.stock || 0}
                    onChange={(e) => handleFieldChange("stock", Number(e.target.value))}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Category</label>
                  <input
                    type="text"
                    value={editedProduct.category || ""}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Listing Visibility</label>
                  <select
                    value={editedProduct.status || "draft"}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 cursor-pointer"
                  >
                    <option value="draft" className="bg-card text-foreground">Draft / Hidden</option>
                    <option value="published" className="bg-card text-foreground">Published / Visible</option>
                    <option value="out_of_stock" className="bg-card text-foreground">Sold Out / out_of_stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bullet features manager */}
            <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3">
                Promotional Bullet Features
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter unique product highlight..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="h-11 px-5 rounded-2xl bg-accent hover:bg-accent/90 text-white text-xs font-bold transition flex items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {(editedProduct.features || []).length === 0 ? (
                    <span className="text-[10px] text-muted-foreground font-light text-center py-2">No product highlights defined.</span>
                  ) : (
                    (editedProduct.features || []).map((feat: string, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/10 border border-border/30 px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground">
                        <span className="truncate pr-4">{feat}</span>
                        <button
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-red-500 hover:text-red-600 transition shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Technical Specifications Spec Sheet */}
            <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3">
                Technical Specifications Sheet
              </h3>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Specification Key (e.g. Battery)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. 40 Hours)"
                      value={specVal}
                      onChange={(e) => setSpecVal(e.target.value)}
                      className="flex-1 bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                    />
                    <button
                      onClick={handleAddSpec}
                      className="h-11 px-5 rounded-2xl bg-accent hover:bg-accent/90 text-white text-xs font-bold transition flex items-center justify-center gap-1 shrink-0"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {Object.keys(editedProduct.specifications || {}).length === 0 ? (
                    <span className="text-[10px] text-muted-foreground font-light text-center py-2">No specs recorded in the sheet.</span>
                  ) : (
                    Object.entries(editedProduct.specifications || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center bg-muted/10 border border-border/30 px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground">
                        <div className="flex gap-4">
                          <span className="text-muted-foreground font-bold shrink-0">{key}:</span>
                          <span>{String(val)}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSpec(key)}
                          className="text-red-500 hover:text-red-600 transition shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Media Images & Card Previews - Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Image Gallery Manager */}
            <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3">
                Product Image Catalog
              </h3>

              {/* Upload to storage */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Upload from file</label>
                <div className="relative border-2 border-dashed border-border/50 hover:border-accent/40 rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    aria-label="Upload product image"
                  />
                  <Upload className="h-6 w-6 text-accent/80 animate-pulse" />
                  <span className="text-[10px] font-bold text-foreground">
                    {uploading ? "Uploading to Supabase..." : "Select product image file"}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-light">Supports PNG, JPG, WebP</span>
                </div>
              </div>

              <div className="border-t border-border/10 my-1" />

              {/* Manual URL Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground">Add image URL manually</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/image.webp"
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    className="flex-1 bg-muted/10 border border-border/80 rounded-2xl h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                  />
                  <button
                    onClick={handleAddManualImage}
                    className="h-11 px-4 rounded-2xl bg-muted/20 hover:bg-muted/30 border border-border/80 text-foreground text-xs font-bold transition flex items-center justify-center shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Thumbnails grid */}
              <div className="grid grid-cols-3 gap-3.5 mt-2">
                {(editedProduct.images || []).length === 0 ? (
                  <div className="col-span-3 border border-border/30 rounded-2xl p-6 text-center text-[10px] text-muted-foreground font-light">
                    No images in catalog.
                  </div>
                ) : (
                  (editedProduct.images || []).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative aspect-square border border-border/30 rounded-2xl overflow-hidden group">
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 hover:text-red-500 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Live Catalog Preview Card */}
            <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4">
              <h3 className="font-heading text-xs font-black text-foreground uppercase tracking-widest border-b border-border/20 pb-3">
                Live Storefront Card Preview
              </h3>

              <div className="border border-border/30 rounded-3xl overflow-hidden bg-card/40 flex flex-col gap-4 relative group">
                <div className="aspect-square bg-muted/5 overflow-hidden flex items-center justify-center relative">
                  {(editedProduct.images || []).length > 0 ? (
                    <img
                      src={editedProduct.images[0]}
                      alt="Preview"
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  )}
                  <span className="absolute top-4 left-4 bg-accent text-[9px] font-black uppercase text-white px-2.5 py-1 rounded-full tracking-wider">
                    {editedProduct.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <h4 className="font-heading font-black text-sm text-foreground">{editedProduct.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-light leading-relaxed line-clamp-2">
                    {editedProduct.short_description}
                  </p>
                  
                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="font-heading font-black text-base text-foreground">${editedProduct.price}</span>
                    {editedProduct.compare_price && (
                      <span className="text-[10px] text-muted-foreground line-through font-semibold">
                        ${editedProduct.compare_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
