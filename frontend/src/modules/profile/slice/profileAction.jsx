/**
 * --------------------------------------------------------
 * File        : apiService.js
 * Description : Contains API service functions related to agent profile,
 *               documents, licenses, notifications, certificates, etc.
 * Authors     : Developer Team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-24
 * --------------------------------------------------------
 * Notes:
 * - Each function defines a specific API call to fetch or update agent data.
 * - Handles profile, E&O, licenses, certificates, documents, and carrier info.
 * - Uses a common API helper (`fetchFromApiServer`) for request dispatch.
 */

import fetchFromApiServer from "../../../services/api";

// Fetch profile data by user ID
export function getProfileDataById(requestObject) {
  const { userId } = requestObject;
  const url = `api/onboarding/getProfileDetail/${userId}`;
  return fetchFromApiServer("GET", url, requestObject);
}

// Fetch agent address by agent ID
export function getAgentAddressByAgentId(requestObject) {
  const { agentId } = requestObject;
  const url = `api/onboarding/getAgentAddressDetails/${agentId}`;
  return fetchFromApiServer("GET", url, requestObject);
}

// Update agent profile details
export function updateProfileDetails(requestObject) {
  const url = `api/agent/updateAgentProfile`;
  return fetchFromApiServer("PUT", url, requestObject);
}

// get direct deposit information
export function getDirectDepositById(requestObject) {
  const { agentId } = requestObject;
  const url = `api/agent/getDirectDeposit/${agentId}`;
  return fetchFromApiServer("GET", url, requestObject);
}

// Update direct deposit information
export function updateDirectDeposit(requestObject) {
  const url = `api/agent/updateDirectDeposit`;
  return fetchFromApiServer("PUT", url, requestObject);
}

// Fetch E&O (Errors and Omissions) insurance data
export function getEAndODataById(requestObject) {
  const { agentId } = requestObject;
  const url = `api/agent/getEAndODetail/${agentId}`;
  return fetchFromApiServer("GET", url,{}, requestObject);
}

// Fetch state license details for an agent 
export function getStateLicenseById(requestObject) {
  const { agentId } = requestObject;
  const url = `api/agent/getStateLicenseDetail/${agentId}`;
  return fetchFromApiServer("GET", url,{},requestObject);
}


export function getLicenseById(requestObject) {
  const { agentId } = requestObject;
  const url = `api/agent/getLicenseDetail/${agentId}`;
  return fetchFromApiServer("GET", url,{},requestObject);
}

// Get notifications for a specific agent
export function getNotificationData(requestObject) {
  const { agentId } = requestObject;
  const url = `api/agent/getNotificationData/${agentId}`;
  return fetchFromApiServer("GET", url, requestObject);
}

// Update E&O insurance information (multipart)
export function updateEAndO(requestObject) {
  const url = `api/agent/updateEAndO`;
  return fetchFromApiServer("MULTIPART_PUT", url, requestObject);
}

// Update state license information (multipart)
export function updateStateLicense(requestObject) {
  const url = `api/agent/updateStateLicense`;
  return fetchFromApiServer("MULTIPART", url, requestObject);
}

// Update agent request status
export function getAllAgent({ agentId, ...rest }) {
  const url = `api/agent/getAllAgentRequest/${agentId}`;
  return fetchFromApiServer("GET", url, {}, rest);
}

// Update agent request status
export function updateStatus({ id, status }) {
  const url = `api/agent/updateRequestStatus/${id}`;
  return fetchFromApiServer("PUT", url, { status });
}

// Fetch carrier appointment information for an agent
export function getAgentCarrier({ agentId, ...restObject }) {
  const url = `api/agent/agentCarriers/${agentId}`;
  return fetchFromApiServer("GET", url, {}, restObject);
}

// Fetch uploaded agent documents
export function getAgentDocuments(requestObject) {
  const { agentId } = requestObject;
  const url = `api/agent/getAgentDocuments/${agentId}`;
  return fetchFromApiServer("GET", url);
}

// Fetch activity log of an agent
export function getActivityLog({ userId }) {
  const url = `api/agent/getActivityLog/${userId}`;
  return fetchFromApiServer("GET", url);
}

// Create a new certificate
export function createCertificate(requestObject) {
  const url = `api/agent/createCertificate`;
  return fetchFromApiServer("POST", url, {}, requestObject);
}

// Get all certificate
export function getAllCertificate(requestObject) {
  const url = `api/agent/getAllCertificate`;
  return fetchFromApiServer("GET", url, {}, requestObject);
}

// Get certificate by ID
export function getCertificateById(requestObject) {
  const { id } = requestObject;
  const url = `api/agent/certificate/${id}`;
  return fetchFromApiServer("GET", url, {}, requestObject);
}

// Update an existing certificate (multipart)
export function updateCertificate(requestObject) {
  const url = `api/agent/certificate`;
  return fetchFromApiServer("MULTIPART_PUT", url, requestObject);
}

// Delete a certificate by ID
export function deleteCertificate(requestObject) {
  const { id } = requestObject;
  const url = `api/agent/certificate/${id}`;
  return fetchFromApiServer("DELETE", url, {}, requestObject);
}

// Fetch certificates for a specific agent by certificate code
export function fetchAgentCertificatesByCode({ code, agentId }) {
  const url = `api/agent/certificateByCode/${code}/${agentId}`;
  return fetchFromApiServer("GET", url);
}

// Get all agent level options
export function fetchAllAgentLevels(requestObject) {
  const url = `api/agent/getAllLevel`;
  return fetchFromApiServer("GET", url, requestObject);
}

// Update agent level
export function updateLevel(requestObject) {
  const url = `api/agent/updateAgentLevel`;
  return fetchFromApiServer("PUT", url, requestObject);
}

// gets multiple agent'd data based on agent id
export function getUplineAgentAndTopAgentData(requestObject) {
  const url = `api/admin/getUplineAgentAndTopAgentData`;
  return fetchFromApiServer("POST", url, requestObject);
}
