import { config } from "dotenv";
import { resolve } from "path";
import { generateBusinessContent } from "../aiContent";

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(__dirname, "../../../.env.local") });

async function testGeneration() {
  console.log("Environment check:");
  console.log("FAL_KEY present:", !!process.env.FAL_KEY);

  const testCases = [
    { name: "Express Plumbing", type: "plumber" },
    { name: "ElectroTech Pro", type: "electrician" },
  ]; // Réduisons le nombre de tests pour commencer

  console.log("\n🧪 Starting content generation tests...\n");

  for (const test of testCases) {
    console.log(`\n📝 Test for: ${test.name} (${test.type})`);
    console.log("----------------------------------------");

    try {
      const content = await generateBusinessContent(test.name, test.type);

      console.log("\n🎯 HERO:");
      console.log(`Title: ${content.hero.title}`);
      console.log(`Subtitle: ${content.hero.subtitle}`);
      console.log(
        `CTA: ${content.hero.cta.primary} | ${content.hero.cta.secondary}`
      );

      console.log("\n🛠 SERVICES:");
      content.services.forEach((service, i) => {
        console.log(`${i + 1}. ${service.title}`);
        console.log(`   ${service.description}`);
        if (service.imageUrl) {
          console.log(`   🖼 Image: ${service.imageUrl}`);
        }
      });

      console.log("\n✨ FEATURES:");
      content.features.forEach((feature, i) => {
        console.log(`${i + 1}. ${feature.title}`);
        console.log(`   ${feature.description}`);
        if (feature.imageUrl) {
          console.log(`   🖼 Image: ${feature.imageUrl}`);
        }
      });

      console.log("\n✅ Test successful!");
    } catch (error) {
      console.error("\n❌ Error:", error);
    }

    console.log("\n----------------------------------------\n");
  }
}

console.log("🚀 Starting tests...\n");
testGeneration()
  .then(() => console.log("✨ Tests completed!"))
  .catch(console.error);
