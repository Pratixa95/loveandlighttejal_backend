import { pgTable, uuid, boolean } from "drizzle-orm/pg-core";

export const attendance = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id"),
  userId: uuid("user_id"),
  present: boolean("present").default(false),
});