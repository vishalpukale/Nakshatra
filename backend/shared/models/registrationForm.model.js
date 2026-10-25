const { pgTable, bigserial, varchar, boolean, bigint, timestamp } = require("drizzle-orm/pg-core");
const { stateTable } = require("./state.model");
const { eventTable } = require("./event.model");

const registrationFormTable = pgTable("registration_forms", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  stateId: bigint("state_id", { mode: "number" }).references(() => stateTable.id),
  eventId: bigint("event_id", { mode: "number" }).references(() => eventTable.id),
  name: varchar("name", { length: 200 }).notNull(),
  isDefault: boolean("is_default").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

module.exports = { registrationFormTable };

