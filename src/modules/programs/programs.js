import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  isVipAvailable: boolean("is_vip_available").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
