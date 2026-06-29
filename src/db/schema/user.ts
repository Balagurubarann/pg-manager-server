import { uuid, varchar, pgTable, timestamp } from "drizzle-orm/pg-core";

const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  phone: varchar("phone", { length: 10 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
});

export default User;
