const {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  timestamp,
  bigserial,
  bigint,
  text,
  decimal,
} = require("drizzle-orm/pg-core");
const { eq, desc } = require("drizzle-orm");
const { agentTable } = require("./agent.model");
const { membershipTable } = require("./membership.model");

const transactionTable = pgTable("transaction", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  agentId: bigint("agent_id", { mode: "number" }).references(
    () => agentTable.id
  ),
  membershipId: bigint("membership_id", { mode: "number" }).references(
    () => membershipTable.id
  ),
  amount: decimal("amount"),
  status: varchar("status"),
  membershipContractUrl: varchar("membership_contract_url"),
  paymentIntentId: varchar("payment_intent_id"),
  isDeleted: boolean("is_deleted").default(false),
  stripeDetail: text("stripe_detail"),
  createdBy: bigint("created_by", { mode: "number" }),
  updatedBy: bigint("updated_by", { mode: "number" }),
  createdDate: timestamp("created_date").defaultNow(),
  updatedDate: timestamp("updated_date").defaultNow(),
  repaymentRequired: boolean("repayment_required").default(false),
  
});

class TransactionModel {
  constructor(db) {
    this.db = db;
  }
  async createTransaction(transactionObject) {
    const [transaction] = await this.db
      .insert(transactionTable)
      .values(transactionObject)
      .returning();
    return transaction;
  }
  async getTransactionById(id) {
    const [transaction] = await this.db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.id, id));
    return transaction;
  }
  async getTransactionByAgentId(id) {
    const [transaction] = await this.db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.agentId, id))
      .orderBy(desc(transactionTable.updatedDate));
    return transaction;
  }
  async getAllTransactions() {
    const transaction = await this.db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.isDeleted, false));
    return transaction;
  }
  async updateTransaction(id, transactionObject) {
    const [transaction] = await this.db
      .update(transactionTable)
      .set(transactionObject)
      .where(eq(transactionTable.id, id))
      .returning();
    return transaction;
  }
  async deleteTransaction(id) {
    const [transaction] = await this.db
      .update(transactionTable)
      .set({ isDeleted: true })
      .where(eq(transactionTable.id, id))
      .returning();
    return transaction;
  }
  async getMembershipUrl(id) {
    const transactions = await this.db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.agentId, id))
      .orderBy(transactionTable.id);
    return transactions.at(-1)?.membershipContractUrl;
  }
  async getLastTransactionByAgentId(id) {
    const transaction = await this.db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.agentId, id))
      .orderBy(transactionTable.id);
    return transaction?.at(-1);
  }
}

module.exports = { transactionTable, TransactionModel };
