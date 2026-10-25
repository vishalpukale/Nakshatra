/**
 * ---------------------------------
 * File: country.model.js
 * Description:
 * This file defines the schema for the "country" table using Drizzle ORM and provides
 * a model for CRUD operations related to countries. It includes methods for creating,
 * fetching, updating, and deleting countries, along with filtering for active and
 * non-deleted records.
 *
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 *
 * Notes:
 * - The `country` table includes fields such as `name`, `code`, `isDeleted`,
 *   `isActive`, `identificationCode`, and timestamps for tracking creation and updates.
 * - The model provides methods for creating, retrieving, updating, and deleting countries.
 * - The `isActive` field is used to manage a country's active status, while `isDeleted`
 *   helps manage soft deletes.
 * - The `identificationCode` is used to store a unique identification code for the country.
 * - Methods include:
 *     - `createCountry`: Inserts a new country into the database.
 *     - `getCountryById`: Retrieves a country by its ID.
 *     - `getAllCountries`: Retrieves all active and non-deleted countries.
 *     - `updateCountry`: Updates a country by its ID.
 *     - `deleteCountry`: Deletes a country by its ID (soft delete functionality).
 * - Soft delete functionality is implemented with the `isDeleted` field, allowing you
 *   to mark a country as deleted without actually removing it from the database.
 * - Uses Drizzle ORM for database operations with returning statements to get the result
 *   after each operation.
 * ---------------------------------
 */

const {
  pgTable,
  bigserial,
  varchar,
  boolean,
  timestamp,
  bigint,
} = require("drizzle-orm/pg-core");
const { eq, and, asc, ilike,sql } = require("drizzle-orm");

// Define the "country" table schema
const countryTable = pgTable("country", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: bigint("created_by", { mode: "number" }),
  updatedBy: bigint("updated_by", { mode: "number" }),
  createdDate: timestamp("created_date").notNull().defaultNow(),
  updatedDate: timestamp("updated_date").notNull().defaultNow(),
  identificationCode: varchar("identification_code"),
  mailSubject: varchar("mail_subject"),
  mailBody: varchar("mail_body"),
  phoneCode: varchar("phone_code"),
});

class CountryModel {
  constructor(db) {
    this.db = db;
  }
  /**
   * Creates a new country.
   * @param {Object} countryObject - The country data to insert.
   * @returns {Object} - The created country object.
   */
  async createCountry(countryObject) {
    const [country] = await this.db
      .insert(countryTable)
      .values(countryObject)
      .returning();
    return country;
  }

  /**
   * Fetches a country by its ID.
   * @param {number} id - The ID of the country to retrieve.
   * @returns {Object} - The country object.
   */
  async getCountryById(id) {
    const [country] = await this.db
      .select()
      .from(countryTable)
      .where(eq(countryTable.id, id));
    return country;
  }

  // async getCountryByIdForMail(id) {

  //   const id = filters?.countryId;
  //   const [country] = await  this.db
  //     .select()
  //     .from(countryTable)
  //     .where(eq(countryTable.id, id));
  //   return country;
  // }

  /**
   * Fetches all active and non-deleted countries.
   * @returns {Array} - List of countries.
   */
  async getAllCountries() {
    const countries = await this.db
      .select({
        id: countryTable.id,
        name: countryTable.name,
        code: countryTable.code,
        phoneCode: countryTable.phoneCode,
        identificationCode: countryTable.identificationCode,
        isDeleted: countryTable.isDeleted,
        isActive: countryTable.isActive,
          displayName: sql`${countryTable.code} || ' ' || ${countryTable.phoneCode}`,
      })
      .from(countryTable)
      .where(
        and(eq(countryTable.isDeleted, false), eq(countryTable.isActive, true))
      )
      .orderBy(asc(countryTable.name));
    return countries;
  }

  /**
   * Updates a country by its ID.
   * @param {number} id - The ID of the country to update.
   * @param {Object} countryObject - The updated country data.
   * @returns {Object} - The updated country object.
   */
  async updateCountry(id, countryObject) {
    const [country] = await this.db
      .update(countryTable)
      .set(countryObject)
      .where(eq(countryTable.id, id))
      .returning();
    return country;
  }

  /**
   * Deletes a country by its ID.
   * @param {number} id - The ID of the country to delete.
   * @returns {Object} - The deleted country object.
   */
  async deleteCountry(id) {
    const [country] = await this.db
      .delete(countryTable)
      .where(eq(countryTable.id, id))
      .returning();
    return country;
  }

  async getCountryByCode(code) {
    const [country] = await this.db
      .select()
      .from(countryTable)
      .where(ilike(countryTable.code, code));
    return country;
  }
}

module.exports = { countryTable, CountryModel };
