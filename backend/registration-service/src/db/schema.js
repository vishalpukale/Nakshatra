// Schema file for Drizzle migrations
// This file imports all models from shared

const { countryTable } = require("../../../shared/models/country.model");
const { stateTable } = require("../../../shared/models/state.model");
const { eventTable } = require("../../../shared/models/event.model");
const { registrationFormTable } = require("../../../shared/models/registrationForm.model");
const { registrationFormFieldTable } = require("../../../shared/models/registrationFormField.model");
const { registrationTable } = require("../../../shared/models/registration.model");
const { registrationAnswerTable } = require("../../../shared/models/registrationAnswer.model");

module.exports = {
  countryTable,
  stateTable,
  eventTable,
  registrationFormTable,
  registrationFormFieldTable,
  registrationTable,
  registrationAnswerTable,
};

