import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HyderabadSolar — Free rooftop solar savings & subsidy calculator",
    template: "%s | HyderabadSolar",
  },
  description:
    "Find out how much you can save with rooftop solar in Hyderabad, understand your PM Surya Ghar subsidy, and connect with verified local installers — 100% free.",
  keywords: [
    "rooftop solar Hyderabad",
    "PM Surya Ghar subsidy",
    "solar calculator",
    "solar installers Hyderabad",
    "Telangana solar subsidy",
  ],
  openGraph: {
    title: "HyderabadSolar — Rooftop solar savings & subsidy calculator",
    description:
      "Estimate your savings and government subsidy, then connect with verified installers in Hyderabad. Free for homeowners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
