import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  cohortId: uuid("cohort_id"),
  sessionDate: timestamp("session_date"),
});