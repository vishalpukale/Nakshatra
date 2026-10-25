import fetchFromApiServer from "../../../services/api";

export function getAllCountry(requestObject) {
  const url = `api/registration/getAllCountries`;
  return fetchFromApiServer("GET", url, {}, requestObject);
}