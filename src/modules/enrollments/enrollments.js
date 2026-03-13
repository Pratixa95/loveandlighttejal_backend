import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { cohorts } from "./cohorts.js";

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  cohortId: uuid("cohort_id")
    .references(() => cohorts.id)
    .notNull(),

  status: varchar("status", { length: 20 }).default("active"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});