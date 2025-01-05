import { fal } from "@fal-ai/client";
import { SiteContent, Service, Feature } from "@/app/config/types";
import { generateImage } from "./imageGeneration";

export async function generateBusinessContent(
  businessName: string,
  businessType: string
): Promise<SiteContent> {
  const prompt = `Generate professional content in English for a ${businessType} website named "${businessName}". Include:
  1. Business information:
     - Social media handles
     - Contact information
  2. Website content:
     - Hero section with title and subtitle
     - 3 key services
     - 4 features
  
  Return ONLY the JSON object without any markdown formatting or backticks. Format:
  {
    "social": {
      "twitter": "",
      "facebook": "",
      "instagram": ""
    },
    "contact": {
      "email": "",
      "phone": "",
      "address": ""
    },
    "business_name": "${businessName}",
    "hero": {
      "title": "",
      "subtitle": "",
      "cta": {"primary": "", "secondary": ""}
    },
    "services": [
      {"title": "", "description": ""}
    ],
    "features": [
      {"title": "", "description": ""}
    ]
  }`;

  try {
    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "openai/gpt-4o",
        prompt,
        system_prompt:
          "You are a professional business content writer. Return ONLY valid JSON without any markdown formatting or explanation.",
      },
      logs: true,
    });

    if (!result.data?.output) {
      throw new Error("No output in response");
    }

    // Nettoyer la sortie de tout formatage markdown
    const cleanOutput = result.data.output
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const generatedContent = JSON.parse(cleanOutput);
    console.log("🤖 Content generated successfully");

    // Validation du contenu généré
    if (
      !generatedContent.hero ||
      !generatedContent.services ||
      !generatedContent.features
    ) {
      console.warn("Generated content is incomplete, using fallback");
      return getFallbackContent(businessName, businessType);
    }

    // Générer les images pour les services
    console.log("🎨 Starting service image generation...");
    for (const service of generatedContent.services) {
      try {
        console.log(`\n📝 Generating image for service: ${service.title}`);
        const imagePrompt = createImagePromptFromService(service, businessType);
        const imageUrl = await generateImage({
          prompt: imagePrompt,
          aspectRatio: "4:3",
        });
        service.imageUrl = imageUrl;
        console.log(`✅ Image generated for ${service.title}: ${imageUrl}`);
      } catch (error) {
        console.warn(
          `❌ Failed to generate image for service ${service.title}:`,
          error
        );
      }
    }

    // Générer les images pour les features
    console.log("\n🎨 Starting feature image generation...");
    for (const feature of generatedContent.features) {
      try {
        if (!feature?.title) {
          console.warn("❌ Invalid feature object:", feature);
          continue;
        }

        console.log(`\n📝 Generating image for feature: ${feature.title}`);
        const imagePrompt = createImagePromptFromFeature(feature, businessType);
        const imageUrl = await generateImage({
          prompt: imagePrompt,
          aspectRatio: "1:1",
        });
        feature.imageUrl = imageUrl;
        console.log(`✅ Image generated for ${feature.title}: ${imageUrl}`);
      } catch (error) {
        console.warn(
          `❌ Failed to generate image for feature ${
            feature?.title || "unknown"
          }:`,
          error
        );
        feature.imageUrl = "https://placehold.co/400x400?text=Feature+Image";
      }
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
): SiteContent {
  return {
    hero: {
      title: `${businessName} - Professional ${
        businessType.charAt(0).toUpperCase() + businessType.slice(1)
      }`,
      subtitle: "Quality Services You Can Trust",
      cta: {
        primary: "Contact Us",
        secondary: "Learn More",
      },
    },
    services: [],
    features: [],
  };
}

function createImagePromptFromService(
  service: Service,
  businessType: string
): string {
  // Extraire les éléments clés du service
  const keywords = service.description
    .toLowerCase()
    .split(" ")
    .filter(
      (word) =>
        !["and", "the", "for", "to", "a", "of", "in", "with", "our"].includes(
          word
        )
    );

  const prompt = `Professional photograph of ${businessType} service in action: ${service.title.toLowerCase()}. 
    Scene showing ${keywords.slice(0, 5).join(" ")}. 
    Modern workplace setting, high-quality professional equipment, 
    natural lighting, 4K quality, professional photography`;

  console.log("\n🎨 Generated service prompt:");
  console.log("Title:", service.title);
  console.log("Original description:", service.description);
  console.log("Generated prompt:", prompt);

  return prompt;
}

function createImagePromptFromFeature(
  feature: Feature,
  businessType: string
): string {
  const conceptMap: { [key: string]: string } = {
    experience: "seasoned professional at work with confidence",
    quality: "premium tools and equipment in pristine condition",
    expertise: "professional using advanced techniques",
    satisfaction: "successful project completion",
    service: "attentive professional helping customer",
    support: "friendly customer interaction",
    available: "24/7 service vehicle ready for action",
    certified: "professional displaying certifications",
    guarantee: "handshake with customer",
    reliable: "dependable professional with tools ready",
    efficient: "swift professional work in progress",
    modern: "cutting-edge equipment in use",
    professional: "expert at work with precision",
    innovative: "latest technology being utilized",
  };

  const concept = Object.keys(conceptMap).find(
    (key) =>
      feature.title.toLowerCase().includes(key) ||
      feature.description.toLowerCase().includes(key)
  );

  const prompt = concept
    ? `Minimalist illustration of ${conceptMap[concept]} in ${businessType} context. 
       Clean vector style, iconic representation, professional setting`
    : `Modern illustration representing ${businessType} professional excellence. 
       ${feature.title}. Minimalist style, professional context`;

  console.log("\n✨ Generated feature prompt:");
  console.log("Title:", feature.title);
  console.log("Original description:", feature.description);
  console.log("Matched concept:", concept || "none");
  console.log("Generated prompt:", prompt);

  return prompt;
}
