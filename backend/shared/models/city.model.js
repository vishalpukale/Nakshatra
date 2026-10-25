/**
 * ---------------------------------
 * File: city.model.js
 * Description:
 * This file defines the schema for the "city" table using Drizzle ORM and provides
 * a model for CRUD operations related to cities. It includes methods for creating,
 * fetching, updating, and deleting cities, as well as fetching cities based on a state
 * ID and filtering out deleted cities.
 *
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 *
 * Notes:
 * - The `city` table includes fields such as `stateId`, `name`, `code`, `isDeleted`,
 *   `isActive`, and timestamps for tracking creation and updates.
 * - The model provides methods for creating, retrieving, updating, and deleting cities.
 * - The `isActive` field is used to manage a city's active status, while `isDeleted`
 *   helps manage soft deletes.
 * - The `stateId` references the `stateTable`, establishing a relationship between
 *   cities and states.
 * - Methods include:
 *     - `createCity`: Inserts a new city.
 *     - `getCityById`: Retrieves a city by its ID.
 *     - `getAllCities`: Retrieves all active and non-deleted cities.
 *     - `updateCity`: Updates a city by its ID.
 *     - `deleteCity`: Deletes a city by its ID.
 *     - `getCityByStateId`: Fetches cities by a specific state ID, useful for filtering
 *       cities within a state.
 * - Soft delete functionality is implemented with the `isDeleted` field, allowing you
 *   to mark a city as deleted without actually removing it from the database.
 * - Uses Drizzle ORM for database operations with returning statements to get the result
 *   after each operation.
 * ---------------------------------
 */

const {
  pgTable,
  bigserial,
  varchar,
  bigint,
  boolean,
  integer,
  timestamp,
} = require("drizzle-orm/pg-core");
const { eq, and, asc, ilike } = require("drizzle-orm");
const { stateTable } = require("./state.model");

// Define the "city" table schema
const cityTable = pgTable("city", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  stateId: bigint("state_id", { mode: "number" }).references(
    () => stateTable.id
  ),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: bigint("created_by", { mode: "number" }),
  updatedBy: bigint("updated_by", { mode: "number" }),
  createdDate: timestamp("created_date").notNull().defaultNow(),
  updatedDate: timestamp("updated_date").notNull().defaultNow(),
});

class CityModel {
  constructor(db) {
    this.db = db;
  }
  /**
   * Creates a new city.
   * @param {Object} cityObject - The city data to insert.
   * @returns {Object} - The created city object.
   */
  async createCity(cityObject) {
    const [city] = await this.db.insert(cityTable).values(cityObject).returning();
    return city;
  }

  /**
   * Fetches a city by its ID.
   * @param {number} id - The ID of the city to retrieve.
   * @returns {Object} - The city object.
   */
  async getCityById(id) {
    const city = await this.db.select().from(cityTable).where(eq(cityTable.id, id));
    return city;
  }

  /**
   * Fetches all active and non-deleted cities.
   * @returns {Array} - List of cities.
   */
  async getAllCities() {
    const cities = await this.db
      .select({
        id: cityTable.id,
        stateId: cityTable.stateId,
        name: cityTable.name,
        code: cityTable.code,
        isDeleted: cityTable.isDeleted,
        isActive: cityTable.isActive,
      })
      .from(cityTable)
      .where(and(eq(cityTable.isDeleted, false), eq(cityTable.isActive, true)));
    return cities;
  }

  /**
   * Updates a city by its ID.
   * @param {number} id - The ID of the city to update.
   * @param {Object} cityObject - The updated city data.
   * @returns {Object} - The updated city object.
   */
  async updateCity(id, cityObject) {
    const [city] = await this.db
      .update(cityTable)
      .set(cityObject)
      .where(eq(cityTable.id, id))
      .returning();
    return city;
  }

  /**
   * Deletes a city by its ID.
   * @param {number} id - The ID of the city to delete.
   * @returns {Object} - The deleted city object.
   */
  async deleteCity(id) {
    const [city] = await this.db
      .update(cityTable)
      .set({ isDeleted: true })
      .where(eq(cityTable.id, id))
      .returning();
    return city;
  }

  /**
   * Fetches all cities by a specific state ID.
   * @param {number} stateId - The ID of the state to filter cities by.
   * @returns {Array} - List of cities in the specified state.
   */
  async getCityByStateId(stateId) {
    const cities = await this.db
      .select({
        id: cityTable.id,
        stateId: cityTable.stateId,
        name: cityTable.name,
        code: cityTable.code,
        isDeleted: cityTable.isDeleted,
        isActive: cityTable.isActive,
      })
      .from(cityTable)
      .where(eq(cityTable.stateId, stateId))
      .orderBy(asc(cityTable.name));
    return cities;
  }

  async getCityByName(name) {
    const [city] = await this.db
      .select()
      .from(cityTable)
      .where(ilike(cityTable.name, name));
    return city;
  }
}

module.exports = { cityTable, CityModel };
