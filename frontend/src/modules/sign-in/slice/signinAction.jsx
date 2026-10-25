/**
 * --------------------------------------------------------
 * File        : authService.js
 * Description : Defines all API interaction functions related to
 *               authentication (Admin & Agent), OTP, account creation,
 *               and advertisement fetching.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-15
 * --------------------------------------------------------
 * Notes:
 * - Uses centralized `fetchFromApiServer` method for HTTP calls.
 * - All endpoints point to authentication or onboarding APIs.
 */

import fetchFromApiServer from "../../../services/api";

// Sign in as an admin user using email/password credentials.
export function signInAdminUser(data) {
  var url = "api/auth/signInAsAdmin";
  return fetchFromApiServer("POST", url, data);
}

/**
 * Sends an OTP to the provided mobile/email for agent login.
 * @param {Object} data - Contains { mobile, email, type }
 * @returns {Promise}
 */
export function fetchOTP(data) {
  var url = "api/auth/sendOtpToAgent";
  return fetchFromApiServer("POST", url, data);
}

/**
 * Sign in as an agent using OTP-based login flow.
 * @param {Object} data - Contains { mobile, otp, email }
 * @returns {Promise}
 */
export function signInAgentUser(data) {
  var url = "api/auth/signInAsAgent";
  return fetchFromApiServer("POST", url, data);
}

/**
 * Creates a new agent account using basic profile info.
 * @param {Object} data - Contains { userId, firstName, lastName, email }
 * @returns {Promise}
 */
export function createAgent(data) {
  var url = "api/auth/createAgentAccount";
  return fetchFromApiServer("POST", url, data);
}

/**
 * Fetches a list of advertisements to show in the login UI.
 * @returns {Promise}
 */
export function getAdvertisementBYforScreen(data) {
  const params = new URLSearchParams(data).toString();
  const url = `api/master/getAllAdvertiseByScreen?${params}`;
  return fetchFromApiServer("GET", url, data);

}

/**
 * Fetches a list of country to show in the login UI.
 * @returns {Promise}
 */
export function getAllCountry(requestObject) {
    const url = `api/master/getAllCountry`;
    return fetchFromApiServer("GET", url, requestObject);
}
/**
 * Fetches a list of advertisements to display on the login screen based on given parameters.
 * @param {Object} data - Query parameters to filter advertisements by screen.
 * @returns {Promise} - Resolves with advertisement data from the API.
 */
export function deleteAgent(data) {
  const url = `api/auth/deleteUser`;
  return fetchFromApiServer("PUT", url, data)
}

export function activateAgent(data) {
  const url = `api/auth/activateUser`;
  return fetchFromApiServer("PUT", url, data)
}

/**
 * Retrieves the modules that a user has access to, filtered by user ID and country ID.
 * @param {Object} requestObject - Contains userId and countryId for access check.
 * @param {string|number} requestObject.userId - The ID of the user.
 * @param {string|number} requestObject.countryId - The ID of the country.
 * @returns {Promise} - Resolves with the list of accessible modules for the user.
 */
export function getUserAccessModule(requestObject) {
  const { userId,countryId } = requestObject;
    const url = `api/auth/getUserAccessModule/${userId}/${countryId}`;
  return fetchFromApiServer("GET", url, requestObject);
}

/**
 * Sends a request to reset the password of an admin user.
 * @param {Object} requestObject - Contains necessary data for password reset.
 * @returns {Promise} - Resolves with response from the API.
 */
export function resetAdminPassword(requestObject) {
  const url = "api/auth/resetAdminPassword";
  return fetchFromApiServer("POST", url, requestObject);
}