import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional Plumbing Services | Your City",
  description:
    "Expert plumbing solutions for residential and commercial properties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-primary text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="font-bold text-xl">Pro Plumbing</div>
            <div className="space-x-6">
              <a href="#services" className="hover:text-gray-200">
                Services
              </a>
              <a href="#contact" className="hover:text-gray-200">
                Contact
              </a>
              <a
                href="tel:+1234567890"
                className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-gray-100"
              >
                Call Now
              </a>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; {new Date().getFullYear()} Pro Plumbing. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
