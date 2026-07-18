import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { ThemeProvider } from "@/context/theme-provider";
import { CartDrawer } from "@/components/product/cart-drawer";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "HamzaTech | Aura X1 — Premium Wireless ANC Headphones",
    template: "%s | HamzaTech",
  },
  description: "Experience absolute acoustic luxury. The HamzaTech Aura X1 Premium Wireless ANC Headphones feature industry-leading noise cancellation, immersive spatial sound, and a futuristic design language.",
  keywords: ["HamzaTech", "Aura X1", "ANC Headphones", "Premium Audio", "Luxury Headphones", "Wireless ANC Headphones"],
  authors: [{ name: "HamzaTech" }],
  creator: "HamzaTech",
  publisher: "HamzaTech",
  metadataBase: new URL("https://aura.hamzatech.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aura.hamzatech.com",
    title: "HamzaTech | Aura X1 — Premium Wireless ANC Headphones",
    description: "Experience absolute acoustic luxury. The HamzaTech Aura X1 Premium Wireless ANC Headphones feature industry-leading noise cancellation, immersive spatial sound, and a futuristic design language.",
    siteName: "HamzaTech",
  },
  twitter: {
    card: "summary_large_image",
    title: "HamzaTech | Aura X1 — Premium Wireless ANC Headphones",
    description: "Experience absolute acoustic luxury. The HamzaTech Aura X1 Premium Wireless ANC Headphones feature industry-leading noise cancellation, immersive spatial sound, and a futuristic design language.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1 flex flex-col">{children}</main>
          <CartDrawer />
          <Toaster position="bottom-right" richColors closeButton theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
