import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { cohorts } from "./cohorts.js";

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id", { mode: "string" })
    .references(() => users.id)
    .notNull(),

  cohortId: uuid("cohort_id", { mode: "string" })
    .references(() => cohorts.id)
    .notNull(),

  status: varchar("status", { length: 50 }).default("active"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at"),

  completedAt: timestamp("completed_at"),
});