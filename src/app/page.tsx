"use client";

import React from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import Image from "next/image";

export default function HomePage() {
  const { config, loading, error } = useSiteConfig();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        <h2>Error loading site configuration:</h2>
        <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto">
          {error.message}
        </pre>
      </div>
    );
  if (!config)
    return (
      <div className="p-4 text-orange-500">
        <h2>Site not found</h2>
        <p>
          Domain:{" "}
          {typeof window !== "undefined" ? window.location.hostname : "N/A"}
        </p>
      </div>
    );

  return (
    <ThemeProvider config={config}>
      <section className="hero-gradient text-white min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            {config.content?.hero?.title || "Bienvenue sur notre site"}
          </h1>
          <p className="text-2xl mb-12 max-w-2xl mx-auto">
            {config.content?.hero?.subtitle ||
              "Découvrez nos services exceptionnels"}
          </p>
          <div className="flex gap-6 justify-center">
            <button className="btn btn-primary px-8 py-4 rounded-full text-lg">
              {config.content?.hero?.cta?.primary || "Commencer"}
            </button>
            <button className="btn btn-secondary px-8 py-4 rounded-full text-lg">
              {config.content?.hero?.cta?.secondary || "En savoir plus"}
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nos Services</h2>
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      onError={(e) => {
                        console.error("Error loading image:", service.imageUrl);
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={() =>
                        console.log("Image loaded:", service.imageUrl)
                      }
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">
                      Image en cours de génération...
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
            Nos Avantages
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

      <section className="section bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                <p>
                  <span className="font-semibold">Weekdays:</span>{" "}
                  {config.business?.hours?.weekdays || "9:00 AM - 5:00 PM"}
                </p>
                <p>
                  <span className="font-semibold">Weekends:</span>{" "}
                  {config.business?.hours?.weekends || "Closed"}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {config.business?.phone || "Contact number not available"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {config.business?.email || "Email not available"}
                </p>
                {config.business?.address?.street && (
                  <div>
                    <span className="font-semibold">Address:</span>
                    <p>{config.business.address.street}</p>
                    <p>
                      {config.business.address.city},{" "}
                      {config.business.address.state}{" "}
                      {config.business.address.zip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
}
