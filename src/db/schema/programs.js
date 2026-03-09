import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price"),
  createdAt: timestamp("created_at").defaultNow(),
});