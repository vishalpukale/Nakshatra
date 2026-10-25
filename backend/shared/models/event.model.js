const {
  pgTable,
  bigserial,
  varchar,
  text,
  boolean,
  numeric,
  bigint,
  timestamp
} = require("drizzle-orm/pg-core");
const { stateTable } = require("./state.model");

const eventTable = pgTable("events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  stateId: bigint("state_id", { mode: "number" }).references(() => stateTable.id),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 200 }).notNull(),
  description: text("description"),
  paymentRequired: boolean("payment_required").default(false).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("INR"),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

module.exports = { eventTable };

