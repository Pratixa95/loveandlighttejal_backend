import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { roles } from "./roles.js";

export const userRoles = pgTable("user_roles", {
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  roleId: integer("role_id")
    .references(() => roles.id)
    .notNull(),
});
