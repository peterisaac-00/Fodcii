import { pgTable, serial, integer, timestamp, date } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const userStatsTable = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  points: integer("points").notNull().default(0),
  solvedCount: integer("solved_count").notNull().default(0),
  totalSubmissions: integer("total_submissions").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: date("last_activity_date"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserStats = typeof userStatsTable.$inferSelect;
