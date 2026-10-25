const {
  pgTable,
  index,
  integer,
  varchar,
  boolean,
  timestamp,
  bigint,
  bigserial,
  date,
  alias,
} = require("drizzle-orm/pg-core");
const moment = require("moment");
const {
  eq,
  and,
  ne,
  ilike,
  gte,
  lte,
  or,
  count,
  inArray,
  lt,
  gt,
  asc,
  desc,
  isNotNull,
  max,
  isNull,
} = require("drizzle-orm");
const { sql } = require("drizzle-orm");
const { stateTable } = require("./state.model");
const { countryTable } = require("./country.model");
const { cityTable } = require("./city.model");
const {
  ONBOARDING_STATUS,
} = require("../utils/constants.utils");
const { map } = require("lodash");
const {
  getExactStatusByExpiryDate,
  maskExceptLast4,
  getCarrierConditionalStatus,
} = require("../utils/common.utils");

const agentTable = pgTable(
  "agent",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" }).references(
      () => usersTable.id
    ),
    supervisorAgentId: bigint("supervisor_agent_id", {
      mode: "number",
    }).references(() => agentTable.id),
    sureLcAgentId: bigint("sure_lc_agent_id", { mode: "number" }),
    teachableUserId: bigint("teachable_user_id", { mode: "number" }),
    firstName: varchar("first_name", { length: 100 }),
    middleName: varchar("middle_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    email: varchar("email", { length: 255 }).unique(),
    dob: date("dob"),
    maritalStatus: varchar("marital_status"),
    title: varchar("title"),
    suffix: varchar("suffix"),
    gender: varchar("gender"),
    spouseName: varchar("spouse_name"),
    code: varchar("code"),
    roleId: integer("role_id"),
    reference: varchar("reference"),
    ssn: varchar("ssn"),
    npn: varchar("npn"),
    address: varchar("address"),
    countryId: bigint("country_id", { mode: "number" }).references(
      () => countryTable.id
    ),
    stateId: bigint("state_id", { mode: "number" }).references(
      () => stateTable.id
    ),
    residentialStateId: bigint("residential_state_id", { mode: "number" }),
    zipCode: varchar("zip_code"),
    cityId: bigint("city_id", { mode: "number" }).references(
      () => cityTable.id
    ),
    onboardingPosition: integer("onboarding_position").default(1),
    contractingPosition: integer("contracting_position").default(1),
    status: varchar("status").default(ONBOARDING_STATUS.SIGN_IN),
    isDeleted: boolean("is_deleted").default(false),
    createdBy: bigint("created_by", { mode: "number" }),
    updatedBy: bigint("updated_by", { mode: "number" }),
    createdDate: timestamp("created_date").defaultNow(),
    updatedDate: timestamp("updated_date").defaultNow(),
    identificationCode: varchar("identification_code"),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    amlStatus: varchar("aml_status", { length: 50 }),
    eoStatus: varchar("eo_status", { length: 50 }),
    licenseStatus: varchar("license_status", { length: 50 }),
    level: varchar("level", { length: 50 }),
    amlDate: date("aml_date"),
    eoDate: date("eo_date"),
    licenseDate: date("license_date"),
    teachableLastSignInIp: varchar("teachable_last_sign_in_ip", {
      length: 100,
    }),
    leaderId: bigint("leader_id", { mode: "number" }),
    leaderAgentCode: varchar("leader_agent_code"),
    approvalRequest: bigint("approval_request", { mode: "number" }),
    tktRelatedLevel: integer("tkt_related_level"),
    tktDistance: integer("tkt_distance"),
    tktGeneration: integer("tkt_generation"),
    referralAgentId: bigint("referral_agent_id", { mode: "number" }).references(
      () => agentTable.id
    ),
    supervisorAgentCode: varchar("supervisor_agent_code"),
    spouseFirstName: varchar("spouse_first_name", { length: 100 }),
    spouseLastName: varchar("spouse_last_name", { length: 100 }),
    onboardedDate: timestamp("onboarded_date").defaultNow(),
    onboardApprovedDate: timestamp("onboard_approved_date").defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index("agent_user_id_idx").on(table.userId),
      supervisorAgentIdx: index("agent_supervisor_agent_id_idx").on(
        table.supervisorAgentId
      ),
      countryIdIdx: index("agent_country_id_idx").on(table.countryId),
      stateIdIdx: index("agent_state_id_idx").on(table.stateId),
      cityIdIdx: index("agent_city_id_idx").on(table.cityId),
      emailIdx: index("agent_email_idx").on(table.email),
      statusIdx: index("agent_status_idx").on(table.status),
    };
  }
);

class AgentModel {
  constructor(db) {
    this.db = db;
  }

}

module.exports = {
  agentTable,
  AgentModel,
};
