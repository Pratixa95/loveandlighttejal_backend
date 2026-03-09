import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const cohorts = pgTable("cohorts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  maxSeats: integer("max_seats"),
  seatsFilled: integer("seats_filled").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});