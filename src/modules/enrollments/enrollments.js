import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { programs } from "./programs.js";

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  programId: uuid("program_id").references(() => programs.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});
