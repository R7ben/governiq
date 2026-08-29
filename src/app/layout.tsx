import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: "GovernIQ — ESG & Governance Intelligence",
  description: "Detect early signs of governance decline in Bursa Malaysia listed companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${dmSerif.variable} bg-zinc-950 text-zinc-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
