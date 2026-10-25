const { pgTable, bigserial, varchar, boolean, integer, jsonb, bigint, timestamp } = require("drizzle-orm/pg-core");
const { registrationFormTable } = require("./registrationForm.model");

const registrationFormFieldTable = pgTable("registration_form_fields", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  formId: bigint("form_id", { mode: "number" }).notNull().references(() => registrationFormTable.id, { onDelete: "cascade" }),
  fieldKey: varchar("field_key", { length: 100 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  inputType: varchar("input_type", { length: 50 }).notNull(),
  isRequired: boolean("is_required").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  options: jsonb("options"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

module.exports = { registrationFormFieldTable };

