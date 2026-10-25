const { pgTable, bigserial, text, bigint, timestamp } = require("drizzle-orm/pg-core");
const { registrationTable } = require("./registration.model");
const { registrationFormFieldTable } = require("./registrationFormField.model");

const registrationAnswerTable = pgTable("registration_answers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  registrationId: bigint("registration_id", { mode: "number" }).notNull().references(() => registrationTable.id, { onDelete: "cascade" }),
  fieldId: bigint("field_id", { mode: "number" }).notNull().references(() => registrationFormFieldTable.id, { onDelete: "cascade" }),
  value: text("value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

module.exports = { registrationAnswerTable };

