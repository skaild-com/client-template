interface GeneratedContent {
  hero: {
    title: string;
    subtitle: string;
    cta: {
      primary: string;
      secondary: string;
    };
  };
  services: Array<{
    title: string;
    description: string;
  }>;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export async function generateBusinessContent(
  businessName: string,
  businessType: string
): Promise<GeneratedContent> {
  const prompt = `Generate professional content in English for a ${businessType} website named "${businessName}". Include:
  1. A catchy title and subtitle for the hero section
  2. 3 key services with descriptions (adapted to the business type)
  3. 4 unique selling points
  The content must be specifically adapted to a ${businessType} business.
  Expected JSON format: {
    "hero": {
      "title": "...",
      "subtitle": "...",
      "cta": {"primary": "...", "secondary": "..."}
    },
    "services": [
      {"title": "...", "description": "..."}
    ],
    "features": [
      {"title": "...", "description": "..."}
    ]
  }`;

  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found, using fallback content");
    return getFallbackContent(businessName, businessType);
  }

  console.log("OpenAI API Key present:", !!process.env.OPENAI_API_KEY);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorJson = JSON.parse(errorText);

      // Si l'erreur est liée au quota, on le log clairement
      if (errorJson.error?.code === "insufficient_quota") {
        console.warn("OpenAI API quota exceeded, using fallback content");
      } else {
        console.warn(`OpenAI API error: ${response.status}`, errorText);
      }

      return getFallbackContent(businessName, businessType);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid API response");
    }

    const generatedContent = JSON.parse(data.choices[0].message.content);
    console.log("Generated content:", generatedContent);

    // Validation du contenu généré
    if (
      !generatedContent.hero ||
      !generatedContent.services ||
      !generatedContent.features
    ) {
      console.warn("Generated content is incomplete, using fallback");
      return getFallbackContent(businessName, businessType);
    }

    return generatedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    return getFallbackContent(businessName, businessType);
  }
}

function getFallbackContent(
  businessName: string,
  businessType: string
): GeneratedContent {
  const contentByType: Record<string, Partial<GeneratedContent>> = {
    plumber: {
      hero: {
        title: `${businessName} - Professional Plumbing`,
        subtitle: "Fast repairs and quality installations",
        cta: {
          primary: "24/7 Emergency",
          secondary: "Free Quote",
        },
      },
      services: [
        {
          title: "Emergency Repairs",
          description: "Quick intervention for leaks and breakdowns",
        },
        {
          title: "Plumbing Installation",
          description: "New installations and renovations",
        },
        {
          title: "Heating Systems",
          description: "Boiler installation and maintenance",
        },
      ],
    },
    electrician: {
      hero: {
        title: `${businessName} - Professional Electrician`,
        subtitle: "Certified electrical installations and repairs",
        cta: {
          primary: "Emergency Call",
          secondary: "Our Services",
        },
      },
      services: [
        {
          title: "Emergency Repairs",
          description: "24/7 rapid intervention",
        },
        {
          title: "Safety Compliance",
          description: "Inspection and certification",
        },
        {
          title: "Installation",
          description: "New work and renovation",
        },
      ],
    },
    beauty_salon: {
      hero: {
        title: `${businessName} - Beauty Salon`,
        subtitle: "Your wellness and beauty space",
        cta: {
          primary: "Book Now",
          secondary: "Our Treatments",
        },
      },
      services: [
        {
          title: "Facial Care",
          description: "Personalized treatments",
        },
        {
          title: "Hairstyling",
          description: "Cuts and coloring",
        },
        {
          title: "Manicure",
          description: "Hand and nail care",
        },
      ],
    },
    restaurant: {
      hero: {
        title: `${businessName} - Restaurant gastronomique`,
        subtitle: "Une expérience culinaire unique",
        cta: {
          primary: "Réserver",
          secondary: "Notre carte",
        },
      },
      services: [
        {
          title: "Service midi",
          description: "Menu du jour fait maison",
        },
        {
          title: "Service soir",
          description: "Carte gastronomique",
        },
        {
          title: "Événements",
          description: "Privatisation possible",
        },
      ],
    },
    landscaper: {
      hero: {
        title: `${businessName} - Paysagiste professionnel`,
        subtitle: "Créez votre jardin de rêve",
        cta: {
          primary: "Devis gratuit",
          secondary: "Nos réalisations",
        },
      },
      services: [
        {
          title: "Aménagement paysager",
          description: "Conception et réalisation de jardins",
        },
        {
          title: "Entretien",
          description: "Tonte, taille et soins des végétaux",
        },
        {
          title: "Terrasse & Clôture",
          description: "Installation et rénovation",
        },
      ],
    },
    mechanic: {
      hero: {
        title: `${businessName} - Garage automobile`,
        subtitle: "Entretien et réparation toutes marques",
        cta: {
          primary: "Rendez-vous",
          secondary: "Nos services",
        },
      },
      services: [
        {
          title: "Réparation",
          description: "Diagnostic et réparation tous véhicules",
        },
        {
          title: "Entretien",
          description: "Révision et maintenance préventive",
        },
        {
          title: "Pneumatiques",
          description: "Changement et équilibrage",
        },
      ],
    },
  };

  // Default content for undefined types
  const defaultContent = {
    hero: {
      title: `${businessName} - Professional Service`,
      subtitle: "Quality and expertise at your service",
      cta: {
        primary: "Contact Us",
        secondary: "Learn More",
      },
    },
    services: [
      {
        title: "Main Service",
        description: "Our core expertise",
      },
      {
        title: "Custom Consulting",
        description: "Tailored guidance",
      },
      {
        title: "Customer Support",
        description: "Ongoing assistance",
      },
    ],
    features: [
      {
        title: "Experience",
        description: "Over 10 years of expertise",
      },
      {
        title: "Quality",
        description: "Premium service guaranteed",
      },
      {
        title: "Responsiveness",
        description: "Quick intervention",
      },
      {
        title: "Satisfaction",
        description: "Happy customers",
      },
    ],
  };

  const typeContent = contentByType[businessType] || defaultContent;

  return {
    ...defaultContent,
    ...typeContent,
    features: defaultContent.features,
  } as GeneratedContent;
}
