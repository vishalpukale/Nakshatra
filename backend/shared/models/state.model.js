/**
 * ---------------------------------
 * File: state.model.js
 * Description:
 * This file defines the schema for the "state" table using Drizzle ORM and provides a 
 * model for managing state records in the database. It includes methods for creating, 
 * retrieving, updating, deleting, and filtering states. The state records are linked to 
 * countries and are associated with certain attributes such as `name`, `code`, `isActive`, 
 * and `isDeleted`.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The `state` table contains information about states or regions, with fields like `name`, 
 *   `code`, and a reference to the `countryTable` for the country to which the state belongs.
 * - The `isActive` and `isDeleted` fields allow for soft deletion and filtering of active states.
 * - The model includes methods for:
 *     - `createState`: Creates a new state record in the table.
 *     - `getStateById`: Retrieves a state record by its unique ID.
 *     - `getAllStates`: Retrieves all active and non-deleted state records.
 *     - `updateState`: Updates an existing state record based on its ID.
 *     - `deleteState`: Soft deletes a state record by setting `isDeleted` to `true`.
 *     - `getStateByCountryId`: Retrieves all states for a given country ID.
 * - The `createdBy` and `updatedBy` fields store references to the user responsible for 
 *   creating or updating the record.
 * - Uses Drizzle ORM for all database operations with returning statements to get results 
 *   after each operation.
 * ---------------------------------
 */


const { pgTable, bigserial, varchar, boolean, bigint, timestamp } = require("drizzle-orm/pg-core");
const { countryTable } = require("./country.model");
const { eq, and, asc } = require("drizzle-orm");

// Define the state table schema
const stateTable = pgTable("state", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    countryId: bigint("country_id", { mode: 'number' }).references(() => countryTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
    isDeleted: boolean("is_deleted").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: bigint("created_by", { mode: 'number' }),
    updatedBy: bigint("updated_by", { mode: 'number' }),
    createdDate: timestamp("created_date").notNull().defaultNow(),
    updatedDate: timestamp("updated_date").notNull().defaultNow(),
});

class StateModel {
    constructor(db) {
        this.db = db;
    }
    /**
     * Creates a new state record in the database.
     * @param {Object} stateObject - The data to insert into the state table.
     * @returns {Object} - The created state record.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async createState(stateObject) {
        const [state] = await this.db.insert(stateTable).values(stateObject).returning();
        return state;
    }

    /**
     * Retrieves a state record by its ID.
     * @param {number} id - The ID of the state to fetch.
     * @returns {Object} - The state record.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getStateById(id) {
        const [state] = await this.db
            .select()
            .from(stateTable)
            .where(eq(stateTable.id, id));
        return state;
    }

    /**
     * Retrieves all active and non-deleted state records.
     * @returns {Array} - A list of all active and non-deleted state records.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getAllStates() {
        const states = await this.db
            .select({
                id: stateTable.id,
                countryId: stateTable.countryId,
                name: stateTable.name,
                code: stateTable.code,
                isDeleted: stateTable.isDeleted,
                isActive: stateTable.isActive,
            })
            .from(stateTable)
            .where(
                and(eq(stateTable.isDeleted, false), eq(stateTable.isActive, true))
            );
        return states;
    }

    /**
     * Updates a state record by its ID.
     * @param {number} id - The ID of the state to update.
     * @param {Object} stateObject - The data to update the state with.
     * @returns {Object} - The updated state record.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async updateState(id, stateObject) {
        const [state] = await this.db
            .update(stateTable)
            .set(stateObject)
            .where(eq(stateTable.id, id))
            .returning();
        return state;
    }

    /**
     * Soft deletes a state record by its ID.
     * @param {number} id - The ID of the state to delete.
     * @returns {Object} - The deleted state record (with isDeleted set to true).
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async deleteState(id) {
        const [state] = await this.db
            .update(stateTable)
            .set({ isDeleted: true })
            .where(eq(stateTable.id, id))
            .returning();
        return state;
    }

    /**
     * Retrieves all states for a specific country by country ID.
     * @param {number} countryId - The ID of the country to fetch states for.
     * @returns {Array} - A list of state records for the specified country.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getStateByCountryId(countryId) {
        const states = await this.db
            .select({
                id: stateTable.id,
                countryId: stateTable.countryId,
                name: stateTable.name,
                code: stateTable.code,
                isDeleted: stateTable.isDeleted,
                isActive: stateTable.isActive,
            })
            .from(stateTable)
            .where(eq(stateTable.countryId, countryId))
            .orderBy(asc(stateTable.name));
        return states;
    }

    async getCountryByStateIds(stateId) {
        const state = await this.db
            .select({
                countryId: stateTable.countryId, // you only need this to get the country
            })
            .from(stateTable)
            .where(eq(stateTable.id, stateId))
            .limit(1);

        return state[0]?.countryId || null;
    }

    async getStateByCode(code) {
        const [state] = await this.db
            .select()
            .from(stateTable)
            .where(eq(stateTable.code, code));
        return state;
    }
}

module.exports = { stateTable, StateModel };
