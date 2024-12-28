export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold">
          {process.env.NEXT_PUBLIC_BUSINESS_NAME || "Business Name"}
        </h1>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Services will be dynamically injected */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">Service Example</h3>
            <p className="text-gray-600">
              Description of the service will be here.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Book an Appointment</h2>
        <div className="p-6 border rounded-lg">
          {/* Cal.com integration will be here */}
          <p className="text-gray-600">Booking system coming soon...</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
        <div className="p-6 border rounded-lg">
          <p className="text-gray-600">
            Contact information will be here...
          </p>
        </div>
      </section>
    </div>
  );
}
