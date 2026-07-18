import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AURA — Premium Minimalist eCommerce",
    template: "%s | AURA",
  },
  description:
    "Experience premium, modern, and minimal online shopping. Handcrafted lifestyle goods, luxury accessories, and high-end apparel.",
  keywords: [
    "eCommerce",
    "luxury",
    "minimalist",
    "premium",
    "fashion",
    "lifestyle",
    "aura",
  ],
  authors: [{ name: "AURA Team" }],
  metadataBase: new URL("https://aura-shop.vercel.app"),
  openGraph: {
    title: "AURA — Premium Minimalist eCommerce",
    description:
      "Experience premium, modern, and minimal online shopping. Handcrafted lifestyle goods, luxury accessories, and high-end apparel.",
    url: "https://aura-shop.vercel.app",
    siteName: "AURA",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA — Premium Minimalist eCommerce",
    description:
      "Experience premium, modern, and minimal online shopping. Handcrafted lifestyle goods, luxury accessories, and high-end apparel.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster position="bottom-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
