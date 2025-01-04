import { generateBusinessContent } from "../aiContent";

async function testGeneration() {
  const testCases = [
    { name: "Express Plumbing", type: "plumber" },
    { name: "ElectroTech Pro", type: "electrician" },
    { name: "Beauty & Zen", type: "beauty_salon" },
    { name: "Corner Restaurant", type: "restaurant" },
    { name: "GreenGarden", type: "landscaper" },
    { name: "AutoPro", type: "mechanic" },
  ];

  console.log("🧪 Starting content generation tests...\n");

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
      });

      console.log("\n✨ FEATURES:");
      content.features.forEach((feature, i) => {
        console.log(`${i + 1}. ${feature.title}`);
        console.log(`   ${feature.description}`);
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
