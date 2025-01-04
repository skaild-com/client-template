import { generateBusinessContent } from "../aiContent";

async function testContentGeneration() {
  // Test cases avec différents types de business
  const testCases = [
    {
      name: "City Plumbers",
      type: "plumber",
    },
    {
      name: "ElectroTech",
      type: "electrician",
    },
    {
      name: "BeautySpace",
      type: "beauty_salon",
    },
  ];

  for (const test of testCases) {
    console.log(
      `\n🧪 Testing content generation for ${test.name} (${test.type})`
    );

    try {
      const content = await generateBusinessContent(test.name, test.type);

      console.log("\n✅ Generated Content:");
      console.log("\n🏷️ Hero Section:");
      console.log(`Title: ${content.hero.title}`);
      console.log(`Subtitle: ${content.hero.subtitle}`);
      console.log(
        `CTAs: ${content.hero.cta.primary} | ${content.hero.cta.secondary}`
      );

      console.log("\n🛠️ Services:");
      content.services.forEach((service, i) => {
        console.log(`${i + 1}. ${service.title} (${service.icon})`);
        console.log(`   ${service.description}`);
      });

      console.log("\n⭐ Features:");
      content.features.forEach((feature, i) => {
        console.log(`${i + 1}. ${feature.title} (${feature.icon})`);
        console.log(`   ${feature.description}`);
      });
    } catch (error) {
      console.error(`❌ Error testing ${test.name}:`, error);
    }
  }
}

// Exécuter le test
testContentGeneration();
