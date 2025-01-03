"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ThemeProvider } from "./components/ThemeProvider";

export default function HomePage() {
  const { config, loading, error } = useSiteConfig();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading site configuration</div>;
  if (!config) return <div>Site not found</div>;

  return (
    <ThemeProvider config={config}>
      <section className="hero-gradient text-white min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            {config.content.hero.title}
          </h1>
          <p className="text-2xl mb-12 max-w-2xl mx-auto">
            {config.content.hero.subtitle}
          </p>
          <div className="flex gap-6 justify-center">
            <button className="btn btn-primary px-8 py-4 rounded-full text-lg">
              {config.content.hero.cta.primary}
            </button>
            <button className="btn btn-secondary px-8 py-4 rounded-full text-lg">
              {config.content.hero.cta.secondary}
            </button>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.content.services.map((service, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {config.content.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
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
                  {config.business.hours.weekdays}
                </p>
                <p>
                  <span className="font-semibold">Weekends:</span>{" "}
                  {config.business.hours.weekends}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {config.business.phone}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {config.business.email}
                </p>
                {config.business.address.street && (
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
