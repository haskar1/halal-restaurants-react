import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Halal Restaurants Near Me",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-800 text-slate-100`}>
        <div className="xl:absolute xl:left-60 px-12 pt-28 w-fit mx-auto">
          {children}
        </div>

        <footer></footer>
      </body>
    </html>
  );
}
