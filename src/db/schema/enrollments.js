import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull(),

  cohortId: uuid("cohort_id").notNull(),

  status: varchar("status", { length: 50 }),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at"),

  completedAt: timestamp("completed_at"),
});