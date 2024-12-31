export default function HomePage() {
  return (
    <>
      <section className="hero-gradient text-white min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            Expert Plumbing Solutions
          </h1>
          <p className="text-2xl mb-12 max-w-2xl mx-auto">
            Professional plumbing services for your home and business
          </p>
          <div className="flex gap-6 justify-center">
            <button className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
              Get Emergency Service
            </button>
            <button className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
              Schedule Service
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <div className="bg-gray-50 p-8 text-center h-full">
                  <div className="text-5xl mb-6 text-accent group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-12">
            Contact us now for a free consultation
          </p>
          <div className="glass-effect p-8 rounded-2xl max-w-2xl mx-auto">
            <div className="text-3xl font-bold text-primary mb-4">
              24/7 Emergency Service
            </div>
            <a
              href="tel:+1234567890"
              className="text-2xl font-bold hover:text-accent transition-colors"
            >
              (123) 456-7890
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const services = [
  {
    title: "Emergency Repairs",
    description: "24/7 emergency plumbing services for urgent issues",
    icon: "🚨",
  },
  {
    title: "Installation",
    description: "Expert installation of fixtures and systems",
    icon: "🔧",
  },
  {
    title: "Maintenance",
    description: "Preventive maintenance to avoid future problems",
    icon: "⚡",
  },
];

const features = [
  {
    title: "Licensed & Insured",
    description: "Fully certified experts",
    icon: "📜",
  },
  {
    title: "24/7 Service",
    description: "Always available",
    icon: "⏰",
  },
  {
    title: "Fair Pricing",
    description: "Transparent quotes",
    icon: "💰",
  },
  {
    title: "Guaranteed Work",
    description: "100% satisfaction",
    icon: "✅",
  },
];
