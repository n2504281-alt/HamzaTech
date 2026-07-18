import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { BestSellingProducts } from "@/components/sections/best-selling-products";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { PromotionalBanner } from "@/components/sections/promotional-banner";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { FlashSale } from "@/components/sections/flash-sale";
import { CustomerTestimonials } from "@/components/sections/customer-testimonials";
import { BrandPartners } from "@/components/sections/brand-partners";
import { Newsletter } from "@/components/sections/newsletter";
import { InstagramGallery } from "@/components/sections/instagram-gallery";
import { Footer } from "@/components/sections/footer";

import { CartSidebar } from "@/components/cart-sidebar";
import { WishlistSidebar } from "@/components/wishlist-sidebar";
import { SearchModal } from "@/components/search-modal";

export default function Home() {
  return (
    <>
      {/* Navigation & Layout States */}
      <Header />
      <CartSidebar />
      <WishlistSidebar />
      <SearchModal />

      {/* Page Sections */}
      <main className="flex-1">
        <Hero />
        <BrandPartners />
        <FeaturedCategories />
        <BestSellingProducts />
        <FeaturedCollection />
        <PromotionalBanner />
        <FlashSale />
        <WhyChooseUs />
        <CustomerTestimonials />
        <Newsletter />
        <InstagramGallery />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
