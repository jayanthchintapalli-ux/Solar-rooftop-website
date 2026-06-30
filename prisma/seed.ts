import { prisma } from "../src/lib/prisma";
import { runSeed } from "../src/lib/seed";

async function main() {
  console.log("🌱 Seeding database...");
  const summary = await runSeed();
  console.log("✅ Seed complete.");
  console.log("------------------------------------------------------------");
  console.log("ADMIN LOGIN:");
  console.log(`   email:    ${summary.admin.email}`);
  console.log(`   password: ${summary.admin.password}`);
  console.log("INSTALLER LOGINS (all share the same password):");
  console.log(`   password: ${summary.installerPassword}`);
  summary.installers.forEach((i) => console.log(`   - ${i.email}  (${i.companyName})`));
  console.log("------------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
