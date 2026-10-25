const { agentTable } = require("./agent.model");
const { stateTable } = require("./state.model");
const { cityTable } = require("./city.model");
const { countryTable } = require("./country.model");
const { eventTable } = require("./event.model");
const { regestrationTable } = require("./registration.model");
const { registrationAnswerTable } = require("./registrationAnswer.model");
const { regestrationFormTable } = require("./registrationForm.model");
const { regestrationFormFieldTable } = require("./registrationFormField.model");
const { stateTable } = require("./state.model");
const { transactionTable } = require("./transaction.model");

module.exports = {
  //Schemas
  agentTable,
  stateTable,
  cityTable,
  countryTable,
  eventTable,
  regestrationTable,
  registrationAnswerTable,
  regestrationFormTable,
  regestrationFormFieldTable,
  stateTable,
  transactionTable,
};
