import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        </body>
      </UserProvider>
    </html>
  );
}
