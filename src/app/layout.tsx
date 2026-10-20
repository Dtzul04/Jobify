import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jobify",
  description: "Search jobs and get plain-language summaries",
};

// Wraps all pages: font, global styles, and Footer below {children}.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
