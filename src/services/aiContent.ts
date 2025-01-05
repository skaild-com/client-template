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
     - 3 key services that:
        * Are specific to ${businessType} industry
        * Include clear value propositions
        * Have detailed but concise descriptions (2-3 sentences)
        * Focus on customer benefits
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
        const imagePrompt = await createImagePromptFromService(
          service,
          businessType
        );
        console.log("Generated prompt:", imagePrompt);

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
        const imagePrompt = await createImagePromptFromFeature(
          feature,
          businessType
        );
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

async function createOptimizedImagePrompt(
  title: string,
  description: string,
  type: "service" | "feature",
  businessType: string
): Promise<string> {
  const prompt = `Transforme la description suivante en un prompt concis pour générer une ${
    type === "service" ? "photo professionnelle" : "icône ou illustration"
  }. Inclue les éléments visuels clés, le style souhaité et les couleurs.

Contexte: Site web pour ${businessType}
Titre: ${title}
Description: ${description}

Le prompt doit être en anglais et optimisé pour la génération d'image.`;

  try {
    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "openai/gpt-4o",
        prompt,
        system_prompt:
          "Tu es un expert en direction artistique, spécialisé dans la création de prompts pour la génération d'images.",
      },
    });

    if (!result.data?.output) {
      throw new Error("No response from GPT-4");
    }

    return result.data.output;
  } catch (error) {
    console.warn("Failed to generate optimized prompt:", error);
    return `Professional ${
      type === "service" ? "photograph" : "illustration"
    } of ${businessType} ${title.toLowerCase()}. Modern style, high quality.`;
  }
}

function createImagePromptFromService(
  service: Service,
  businessType: string
): Promise<string> {
  return createOptimizedImagePrompt(
    service.title,
    service.description,
    "service",
    businessType
  );
}

function createImagePromptFromFeature(
  feature: Feature,
  businessType: string
): Promise<string> {
  return createOptimizedImagePrompt(
    feature.title,
    feature.description,
    "feature",
    businessType
  );
}
