import { config } from "dotenv";
import { resolve } from "path";
import { generateImage } from "../imageGeneration";

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(__dirname, "../../../.env.local") });

async function testImageGeneration() {
  try {
    console.log("🧪 Testing image generation...");
    console.log("FAL_KEY present:", !!process.env.FAL_KEY);

    const testCases = [
      {
        prompt:
          "A professional plumber fixing a sink, modern style, high quality",
        aspectRatio: "4:3" as const,
      },
      {
        prompt: "A modern beauty salon interior with elegant styling stations",
        aspectRatio: "16:9" as const,
      },
    ];

    for (const test of testCases) {
      console.log("\n📝 Testing prompt:", test.prompt);
      console.log("Aspect ratio:", test.aspectRatio);

      const imageUrl = await generateImage(test);
      console.log("✅ Image generated successfully!");
      console.log("🔗 URL:", imageUrl);
      console.log("------------------------");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testImageGeneration();
