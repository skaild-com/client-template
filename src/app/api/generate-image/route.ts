import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

interface FalError {
  name?: string;
  message?: string;
  status?: number;
  body?: unknown;
}

export async function POST(request: Request) {
  console.log("🚀 API Route - Starting...");

  try {
    const { prompt, aspectRatio } = await request.json();

    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      throw new Error("FAL_KEY not configured");
    }

    // Configuration explicite du client FAL
    fal.config({
      credentials: falKey,
      proxyUrl: "https://gateway.fal.ai", // Ajout de l'URL explicite
    });

    console.log("🔑 FAL client configured, calling API...");

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        num_images: 1,
      },
      pollInterval: 1000,
      timeout: 30000,
    });

    if (!result.data?.images?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    return NextResponse.json({
      imageUrl: result.data.images[0].url,
      success: true,
    });
  } catch (error) {
    // Typage de l'erreur
    const falError = error as FalError;

    // Log plus détaillé de l'erreur
    console.error("❌ FAL API error:", {
      name: falError.name,
      message: falError.message,
      status: falError.status,
      body: falError.body,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: falError.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
