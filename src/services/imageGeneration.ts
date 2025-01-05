import { fal } from "@fal-ai/client";

// Définir les ratios d'aspect acceptés par l'API FAL
type AspectRatio = "1:1" | "4:3" | "16:9" | "3:4" | "9:16";

interface ImageGenerationParams {
  prompt: string;
  aspectRatio?: AspectRatio;
}

interface ImageGenerationError {
  message: string;
  code?: string;
  details?: unknown;
}

interface FalResponse {
  data?: {
    images?: Array<{
      url?: string;
    }>;
  };
}

export async function generateImage({
  prompt,
  aspectRatio = "1:1",
}: ImageGenerationParams): Promise<string> {
  try {
    const result = (await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        num_images: 1,
      },
      pollInterval: 1000,
      timeout: 30000,
    })) as FalResponse;

    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    return result.data.images[0].url;
  } catch (error) {
    const imgError = error as ImageGenerationError;
    console.error("Failed to generate image:", imgError.message);
    throw imgError;
  }
}

export async function generateHeroBackground(
  businessType: string
): Promise<string> {
  const prompt = `Modern abstract background for a ${businessType} website. Gradient style with professional business colors, subtle patterns, elegant and corporate look. Highly detailed, ultra high quality, 16:9 ratio.`;

  return generateImage({
    prompt,
    aspectRatio: "16:9",
  });
}

export async function generateHeroIllustration(
  businessType: string,
  businessName: string
): Promise<string> {
  // Générer le prompt pour l'illustration
  const prompt = `A minimalist vector illustration of a professional ${businessType}, wearing a branded uniform with "${businessName}" logo. Corporate art style, clean lines, flat design with subtle gradients. The character is shown from a 3/4 angle, with a confident and approachable posture. Use professional color palette: elegant business tones with subtle gradients. The illustration should be simple yet sophisticated, matching the website's corporate identity and color scheme.`;

  try {
    const result = await fal.subscribe("fal-ai/ideogram/v2", {
      input: {
        prompt,
        style: "design",
        aspect_ratio: "1:1",
        expand_prompt: true,
      },
      logs: true,
    });

    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    return result.data.images[0].url;
  } catch (error) {
    console.error("Failed to generate hero illustration:", error);
    throw error;
  }
}
