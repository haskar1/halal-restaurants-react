import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

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
          {children}
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
