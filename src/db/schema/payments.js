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

  stripeSessionId: varchar("stripe_session_id", { length: 255 }),

  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),

  amount: integer("amount").notNull(),

  currency: varchar("currency", { length: 10 }),

  status: varchar("status", { length: 50 }),

  cohortId: uuid("cohort_id"),

  createdAt: timestamp("created_at").defaultNow(),
});