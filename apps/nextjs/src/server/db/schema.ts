// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `quickpull_${name}`);

export const account_type = pgEnum("account_type", ["standard", "premium"]);

export const collections = createTable("collections", {
  id: varchar("id", { length: 256 }).primaryKey(),
  user_id: varchar("user_id", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  items: jsonb("items").$type<CollectionItem[]>().notNull(),
  item_count: integer("item_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = createTable("users", {
  clerk_id: varchar("clerk_id", { length: 256 }).primaryKey(),
  account_type: account_type("account_type").default("standard").notNull(),
  customer_id: varchar("customer_id", { length: 256 }),
});

export const collection_relations = relations(collections, ({ one }) => ({
  user: one(users, {
    fields: [collections.user_id],
    references: [users.clerk_id],
  }),
}));

export const user_relations = relations(users, ({ many }) => ({
  collections: many(collections),
}));
