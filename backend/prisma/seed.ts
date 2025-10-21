import bcrypt from "bcrypt";
import { prisma } from "../src/config/db";

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
      plan: "pro",
    },
  });
}

main();
