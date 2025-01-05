import { config } from "dotenv";
import { resolve } from "path";
import { generateHeroIllustration } from "../imageGeneration";

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(__dirname, "../../../.env.local") });

async function testIdeogramGeneration() {
  try {
    console.log("🧪 Testing Ideogram hero illustration generation...");
    console.log("FAL_KEY present:", !!process.env.FAL_KEY);

    const testCases = [
      {
        businessName: "City Plumbers",
        businessType: "plumber",
      },
      {
        businessName: "ElectroTech Pro",
        businessType: "electrician",
      },
    ];

    for (const test of testCases) {
      console.log("\n📝 Testing for:", test.businessName);
      console.log("Business type:", test.businessType);

      const imageUrl = await generateHeroIllustration(
        test.businessType,
        test.businessName
      );
      console.log("✅ Illustration generated successfully!");
      console.log("🔗 URL:", imageUrl);
      console.log("------------------------");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Exécuter le test
testIdeogramGeneration();
