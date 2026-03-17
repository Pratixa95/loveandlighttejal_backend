import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const cohorts = pgTable("cohorts", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  /* 🔥 IMPORTANT FIXES */
  maxSeats: integer("max_seats").notNull(), // must exist
  seatsFilled: integer("seats_filled").notNull().default(0), // avoid null issues

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});