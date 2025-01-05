"use client";

import React from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import Image from "next/image";

export default function HomePage() {
  const { config, loading, error } = useSiteConfig();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!config) return <div className="p-4">Site not found</div>;

  return (
    <ThemeProvider config={config}>
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-white">
          {config.business?.name || "Business Name"}
        </h1>
      </div>

      <section className="hero-section relative">
        {config.content?.hero?.backgroundUrl && (
          <div className="hero-background">
            <Image
              src={config.content.hero.backgroundUrl}
              alt="Background"
              fill
              priority
              className="object-cover"
              quality={90}
            />
          </div>
        )}
        <div className="hero-content relative z-10">
          <div className="container mx-auto px-4 py-20 flex items-center justify-between">
            <div className="text-white max-w-2xl">
              <h1 className="text-6xl font-bold mb-6 animate-fade-in">
                {config.content?.hero?.title || "Welcome"}
              </h1>
              <p className="text-2xl mb-12">
                {config.content?.hero?.subtitle ||
                  "Discover our exceptional services"}{" "}
                {config.business?.address?.city && (
                  <span className="text-secondary-light">
                    in {config.business.address.city}
                  </span>
                )}
              </p>
              <div className="flex gap-6">
                <button className="btn btn-primary px-8 py-4 rounded-full text-lg">
                  {config.content?.hero?.cta?.primary || "Request Service"}
                </button>
                <button className="btn btn-secondary px-8 py-4 rounded-full text-lg">
                  {config.content?.hero?.cta?.secondary || "Contact Us"}
                </button>
              </div>
            </div>

            {config.content?.hero?.illustrationUrl && (
              <div className="relative w-[500px] h-[500px] hidden lg:block">
                <Image
                  src={config.content.hero.illustrationUrl}
                  alt="Hero Illustration"
                  fill
                  className="object-contain"
                  priority
                  quality={90}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config?.content?.services?.map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {service.imageUrl ? (
                  <div className="mb-4 overflow-hidden rounded-lg h-48 relative">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                      quality={75}
                      onError={(e) => {
                        console.error("Error loading image:", service.imageUrl);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">
                      Image is being generated...
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config?.content?.features?.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {feature.imageUrl && (
                  <div className="mb-4 overflow-hidden rounded-lg h-48 relative">
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
                      className="object-cover"
                      onLoad={() =>
                        console.log("Feature image loaded:", feature.imageUrl)
                      }
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">
                {config.business?.name || "Business Name"}
              </h3>
              <p className="text-gray-400">
                Professional {config.business?.businessType || "services"} in{" "}
                {config.business?.address?.city || "your area"}
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <span className="font-semibold">Address:</span>
                  <br />
                  {config.business?.address?.street}
                  <br />
                  {config.business?.address?.city},{" "}
                  {config.business?.address?.state}{" "}
                  {config.business?.address?.zip}
                </li>
                <li className="text-gray-400">
                  <span className="font-semibold">Phone:</span>
                  <br />
                  {config.business?.phone}
                </li>
                <li className="text-gray-400">
                  <span className="font-semibold">Email:</span>
                  <br />
                  {config.business?.email}
                </li>
              </ul>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <span className="font-semibold">Weekdays:</span>
                  <br />
                  {config.business?.hours?.weekdays}
                </li>
                <li className="text-gray-400">
                  <span className="font-semibold">Weekends:</span>
                  <br />
                  {config.business?.hours?.weekends}
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} {config.business?.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </ThemeProvider>
  );
}
