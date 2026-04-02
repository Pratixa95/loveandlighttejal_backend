import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull(),
  cohortId: uuid("cohort_id").notNull(),

  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),

  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("inr"),

  status: varchar("status", { length: 50 }).default("pending"),

  createdAt: timestamp("created_at").defaultNow(),
});