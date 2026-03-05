import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  programId: uuid("program_id").notNull(),
  stripeSessionId: text("stripe_session_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").default("inr"),
  status: text("status").notNull(), // pending | paid | failed
  createdAt: timestamp("created_at").defaultNow(),
});