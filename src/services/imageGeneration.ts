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
