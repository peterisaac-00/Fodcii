import { pgTable, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { problemsTable } from "./problems";

export const userFirstSolvesTable = pgTable(
  "user_first_solves",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    problemId: integer("problem_id")
      .notNull()
      .references(() => problemsTable.id, { onDelete: "cascade" }),
    solvedAt: timestamp("solved_at").notNull().defaultNow(),
    executionTime: integer("execution_time"),
  },
  (t) => [uniqueIndex("uf_user_problem_uniq").on(t.userId, t.problemId)]
);

export type UserFirstSolve = typeof userFirstSolvesTable.$inferSelect;
