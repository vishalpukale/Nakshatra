const { pgTable, bigserial, varchar, numeric, bigint, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eventTable } = require("./event.model");
const { stateTable } = require("./state.model");
const { registrationFormTable } = require("./registrationForm.model");

const registrationTable = pgTable("registrations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  eventId: bigint("event_id", { mode: "number" }).notNull().references(() => eventTable.id),
  stateId: bigint("state_id", { mode: "number" }).references(() => stateTable.id),
  formId: bigint("form_id", { mode: "number" }).references(() => registrationFormTable.id),
  fullName: varchar("full_name", { length: 255 }),
  email: varchar("email", { length: 150 }),
  phone: varchar("phone", { length: 20 }),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).default("0"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by", { length: 255 }),
  updatedBy: varchar("updated_by", { length: 255 }),
});

module.exports = { registrationTable };

