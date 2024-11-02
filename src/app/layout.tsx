import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAdsense from "@/components/GoogleAdsense";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`${inter.className}`}>
          <div className="page-content">
            <header>
              <Navbar />
            </header>

            {children}
          </div>

          <Footer />
          <Analytics />
          <SpeedInsights />
        </body>
      </UserProvider>
      <GoogleAdsense pId={`${process.env.GOOGLE_ADSENSE_ID}`} />
    </html>
  );
}
