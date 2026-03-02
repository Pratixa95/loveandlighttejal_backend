import { db } from "../config/db.js";
import { roles } from "./schema/roles.js";

export const seedRoles = async () => {
  const existing = await db.select().from(roles);

  if (existing.length === 0) {
    await db.insert(roles).values([
      { name: "CUSTOMER" },
      { name: "VIP_CUSTOMER" },
      { name: "CO_HOST" },
      { name: "ADMIN" },
    ]);
    console.log("✅ Roles seeded");
  }
};
