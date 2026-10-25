/**
 * --------------------------------------------------------
 * File        : utils.js
 * Description : Common utility functions used across the app for formatting,
 *               validation, token management, string parsing, and more.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Includes helpers like number formatting, date formatting, text width measurement.
 * - Provides token storage and retrieval using sessionStorage.
 * - Used globally for simplifying repetitive tasks.
 */

import moment from "moment";
import { find } from "lodash";
import { routeAccessRules, TOKEN_KEY } from "../constants";
import { getStatusChip } from "./commonUtils";
import { Tooltip } from "react-tooltip";
import {
  subDays,
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
} from "date-fns";
const getTestId = (text) => {
  if (text && typeof text === "string") {
    return text?.replace(/ /g, "_")?.toLowerCase();
  }
  return "";
};
const dateRangeFormat = (startDate, endDate) => {
  if (startDate && endDate) {
    let dateString = `${moment(startDate).format("MM.DD.YYYY")} - ${moment(
      endDate,
    ).format("MM.DD.YYYY")}`;
    return dateString;
  }
  return "";
};

const numberFormat = (number) => {
  if (number) {
    let formattedNumber = Number(number).toLocaleString();
    return formattedNumber;
  }
  return number;
};
const getAbbreviation = (text) => {
  if (!text || typeof text !== "string") return "";
  const cleanedText = text.replace(/[^a-zA-Z\s]/g, "").trim();
  if (!cleanedText) return "";
  const words = cleanedText.split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  } else {
    return words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  }
};
const dateFormat = (date, format) => {
  if (date && format) {
    // parse as given string, not as JS Date object
    let dateString =moment.utc(date).format("DD MMM YYYY");
    return dateString;
  }
  return "--";
};

const toISODateString = (date) => {
  if (date) {
    let dateString = new Date(moment(date).add(5.5, "h")).toISOString();
    return dateString;
  }
  return "";
};
const findElementByKey = (list = [], key, keyName) => {
  if (list && key) {
    let element = find(list, (item) => item[keyName] === key);
    return element || "";
  }
  return {};
};

function getTextWidth(text, font) {
  if (!text) {
    return 0;
  }
  // if given, use cached canvas for better performance
  // else, create new canvas
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

const abbreviateNumber = (num, fixed) => {
  if (!num) {
    return "0";
  }
  num = num * 1;
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var precisionPower = num.toPrecision(2).split("e"), // get power
    floorValue =
      precisionPower?.length === 1
        ? 0
        : Math.floor(Math.min(precisionPower[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    decimalValue =
      floorValue < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, floorValue * 3)).toFixed(1 + fixed), // divide by power
    absoluteValue = decimalValue < 0 ? decimalValue : Math.abs(decimalValue), // enforce -0 is 0
    abbreviated = absoluteValue + ["", "K", "M", "B", "T"][floorValue]; // append power
  return abbreviated;
};

const abbreviateCount = (num, fixed) => {
  if (!num) {
    return "0";
  }
  num = num * 1;
  if (num > 99000) {
    return "99k+";
  }
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var precisionPower = num.toPrecision(2).split("e"), // get power
    floorValue =
      precisionPower?.length === 1
        ? 0
        : Math.floor(Math.min(precisionPower[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    decimalValue =
      floorValue < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, floorValue * 3)).toFixed(1 + fixed), // divide by power
    absoluteValue = decimalValue < 0 ? decimalValue : Math.abs(decimalValue); // enforce -0 is 0
  let stringNum = absoluteValue?.toString()?.split(".")[0];
  let abbreviated = stringNum + ["", "K", "M", "B", "T"][floorValue]; // append power
  if (parseFloat(stringNum) < parseFloat(absoluteValue)) {
    return abbreviated + "+"; // append power
  } else {
    return abbreviated;
  }
};

function numberWithCommas(num = 0, type) {
  if (num === null) num = 0;
  num *= 1;
  if (type) {
    return num.toLocaleString("en-US");
  }
  return Math.round(num).toLocaleString("en-US");
}

const formatAmount = (value, type) => {
  let amount = numberWithCommas(value, type);
  return `$${amount || 0}`;
};

const getLastNameInitials = (text) => {
  if (text) {
    let data = `${text}`;
    data = data.split(" ");
    if (data.length === 2) {
      return `${data[1].charAt(0).toUpperCase()},${data[0]}`;
    } else if (data.length === 1) {
      return data;
    }
  }
  return "";
};

const setToken = (token) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

const getToken = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token;
  }
  return "";
};
const validateEmail = (email) => {
  const pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  );
  return pattern.test(email);
};

const validateMobileNum = (mobile) => {
  const pattern = new RegExp(/^[0-9]{10}$/);
  return pattern.test(mobile);
};
const validatefromSpace = (string) => {
  const pattern = new RegExp(/^(?!\s)(?!.*\s$).+$/);
  return pattern.test(string);
};

const validateName = (name) => {
  const pattern = new RegExp(/^[A-Za-z]+( [A-Za-z]+)*$/);
  return pattern.test(name);
};

const validateZipcode = (zipcode) => {
  const regex = /^[A-Za-z0-9]{3,9}$/;
  return regex.test(zipcode);
};

const formatIndianNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

const getNameInitials = (text) => {
  if (!text) return "";

  const words = text.trim().split(/\s+/); // handles multiple spaces
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else {
    // first + last word initials
    return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
  }
};

const getItemsMargin = (itemLength = 0) => {
  if (window.innerHeight < 722) {
    if (itemLength === 1) {
      return "";
    } else if (itemLength === 2) {
      return "";
    } else if (itemLength === 3) {
      return "";
    } else if (itemLength === 4) {
      return "-mt-mbp-182";
    } else if (itemLength === 5) {
      return "-mt-mbp-215";
    } else if (itemLength > 5) {
      return "-mt-mbp-222";
    }
    return "";
  }
};
const isValidString = (str) => {
  return !/[~`!#$%()@^&*+=\\[\]\\';,/{}|\\":<>?]/g.test(str);
};

const formatInput = (input) => {
  // Remove non-digits
  const digits = input.replace(/\D/g, "").slice(0, 9);
  // Format as 111-222-333
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 3));
  if (digits.length > 3) parts.push(digits.slice(3, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 9));
  return parts.join("-");
};
const maskNumber = (value, hideLength = -4) => {
  const endDigits = value?.slice(hideLength);
  return endDigits?.padStart(value?.length, "*");
};

const maskExceptLast4 = (value) => {
  if (!value) return "";

  const endDigits = value.slice(-4);
  const maskedLength = value.length - 4;
  const masked = "*".repeat(Math.max(maskedLength, 0));
  return masked + endDigits;
};

const capitalizeFirstLetter = (val) => {
  if (!val?.trim()) {
    return "";
  }

  return val
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
};

const truncateText = (text, wordLimit = 7) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + " . . .";
};

const truncateByChars = (text, charLimit = 13) => {
  if (!text) return "";
  return text.length > charLimit ? text.slice(0, charLimit - 1) + "…" : text;
};

const getDateRangeFromOption = (selected) => {
  const today = new Date();
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  switch (selected?.id) {
    case "today":
      return {
        from: formatDate(today),
        to: formatDate(today),
      };
    case "yesterday": {
      const yesterday = subDays(today, 1);
      return {
        from: formatDate(yesterday),
        to: formatDate(yesterday),
      };
    }
    case "this_week":
      return {
        from: formatDate(startOfWeek(today, { weekStartsOn: 1 })), // Monday
        to: formatDate(today),
      };
    case "this_month":
      return {
        from: formatDate(startOfMonth(today)),
        to: formatDate(today),
      };
    case "ytd":
      return {
        from: formatDate(startOfYear(today)),
        to: formatDate(today),
      };
    case "custom":
      if (selected?.from && selected?.to) {
        return {
          from: formatDate(new Date(selected.from)),
          to: formatDate(new Date(selected.to)),
        };
      }
      return null;

    case "custom_range":
      if (selected?.from && selected?.to) {
        return {
          from: formatDate(new Date(selected.from)),
          to: formatDate(new Date(selected.to)),
        };
      }
      return null;
    default:
      return null;
  }
};

const formatDetailsToJson = (data) => {
  if (!data) return [];

  const isValidValue = (val) =>
    val !== null &&
    val !== undefined &&
    val !== "" &&
    !(typeof val === "string" && val.trim() === "");

  const formatLabel = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to camel Case
      .replace(/_/g, " ") // snake_case to snake case
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize words
  };

  const isEmail = (val) => typeof val === "string" && val.includes("@");
  const isUrl = (val) => typeof val === "string" && /^https?:\/\//.test(val);
  const isDate = (val) =>
    typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val);
  const isCurrencyField = (key) =>
    /amount|value/i.test(key) && !isNaN(parseFloat(data[key]));

  return Object.keys(data)
    .filter((key) => isValidValue(data[key]))
    .map((key) => {
      const rawValue = data[key];
      let value = rawValue;
      let isLink = false;

      if (isEmail(rawValue)) {
        value = `mailto:${rawValue}`;
        isLink = true;
      } else if (isUrl(rawValue)) {
        value = rawValue;
        isLink = true;
      } else if (isDate(rawValue)) {
        value = new Date(rawValue).toLocaleDateString();
      } else if (isCurrencyField(key)) {
        value = `$${parseFloat(rawValue).toFixed(2)}`;
      }

      return {
        label: formatLabel(key),
        value,
        isLink,
      };
    });
};

const extractDateFields = (dataArray) => {
  const isDate = (val) =>
    typeof val === "string" &&
    !isNaN(Date.parse(val)) &&
    /\d{4}-\d{2}-\d{2}|\d{1,2} [A-Za-z]{3,9} \d{4}|\d{1,2}\/\d{1,2}\/\d{4}/.test(
      val,
    );

  const isValidValue = (val) =>
    val !== null &&
    val !== undefined &&
    val !== "" &&
    !(typeof val === "string" && val.trim() === "");

  const formatLabel = (key) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return dataArray.map((entry) => {
    let policyEffDate = null;

    // Check top-level keys
    Object.entries(entry).forEach(([key, val]) => {
      if (
        formatLabel(key) === "Policy Effective Date" &&
        isValidValue(val) &&
        isDate(val)
      ) {
        policyEffDate = {
          label: "Policy Effective Date",
          value: new Date(val).toLocaleDateString(),
        };
      }
    });

    // Check inside additionalDetails (if not already found)
    if (!policyEffDate && entry.additionalDetails) {
      try {
        const details = JSON.parse(entry.additionalDetails);
        Object.entries(details).forEach(([key, val]) => {
          if (
            formatLabel(key) === "Policy Effective Date" &&
            isValidValue(val) &&
            isDate(val)
          ) {
            policyEffDate = {
              label: "Policy Effective Date",
              value: new Date(val).toLocaleDateString(),
            };
          }
        });
      } catch (err) {
        console.warn("Invalid JSON in additionalDetails:", err);
      }
    }

    // Return object or null
    return policyEffDate ?? null;
  });
};

const extractingPolicyEffectiveDate = (dataStr) => {
  try {
    const details = JSON.parse(dataStr);
    return (
      details?.PolicyEffectiveDate ||
      details?.policyEffDte ||
      details?.policyEffDate ||
      null
    );
  } catch {
    return null;
  }
};
const getColorByAction = (actionName) => {
  switch (actionName) {
    case "ACS":
      return;
    case "ACP": // Approved
      return "green";
    case "RJC": // Rejected
      return "red";
    case "IRV": // In Review
      return;
    default:
      return;
  }
};

function formatToUSD(value) {
  if (value === null || value === undefined || value === "" || value === 0)
    return "$0.00";

  const number = parseFloat(value);
  if (isNaN(number)) return "$0.00";

  const absValue = Math.abs(number).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (number < 0) {
    // Negative: wrap in parentheses
    return `(${absValue})`;
  }
  return absValue;
}
function formatToMillion(value) {
  if (value === null || value === undefined || value === "" || value === 0)
    return "$0.00";

  const number = parseFloat(value);
  if (isNaN(number)) return "--";

  let formatted;
  const absNumber = Math.abs(number);

  if (absNumber >= 1_000_000) {
    // Convert to millions and keep 2 decimal places
    formatted = `$${(absNumber / 1_000_000).toFixed(2)}M`;
  } else {
    // Regular currency formatting
    formatted = absNumber.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  if (number < 0) {
    // Negative: wrap in parentheses
    return `(${formatted})`;
  }
  return formatted;
}

// Generates a random password string of specified length.
// If no length is provided, the default password length is 6 characters

function generatePassword(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*-";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const formatDuration = (seconds) => {
  const duration = moment.duration(seconds, "seconds");
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (hours > 0 && minutes > 0) {
    return `${hours} h ${minutes} m`;
  } else if (hours > 0) {
    return `${hours} h`;
  } else if (minutes > 0) {
    return `${minutes} m`;
  } else {
    return "0 m";
  }
};

function isValidUrl(url) {
  if (!url) return false;
  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch (error) {
    console.log("error in url validation: ", error);
    return false;
  }
}

const canAccessRoute = (path, status) => {
  const allowedStatuses = routeAccessRules[path];
  if (!allowedStatuses) return true; // If not defined, allow by default
  return allowedStatuses.includes(status);
};
const extractPolicyEffectiveDate = (item) => {
  const parseDetails = (details) => {
    try {
      return typeof details === "string" ? JSON.parse(details) : details || {};
    } catch {
      return {};
    }
  };

  if (item?.policyEffectiveDate) {
    return dateFormat(item.policyEffectiveDate, "DD MMM YYYY");
  }

  const details = parseDetails(item?.extraDetails);

  const possibleKeys = ["policyEffDte", "policyEffectiveDate"];
  for (const key of possibleKeys) {
    if (details?.[key]) {
      return dateFormat(details[key], "DD MMM YYYY");
    }
  }

  const dynamicKey = Object.keys(details).find((key) => {
    const lowerKey = key.toLowerCase();
    return (
      lowerKey.includes("policy") &&
      lowerKey.includes("eff") &&
      !!Date.parse(details[key])
    );
  });

  if (dynamicKey) {
    return dateFormat(details[dynamicKey], "DD MMM YYYY");
  }

  return "--";
};

function formatToTitleCase(name) {
  if (name == null) return null;
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
function addYearsToDate(date, years = 1) {
  if (!date) return null;

  const originalDate = new Date(date);
  if (isNaN(originalDate)) return null; // Invalid date check

  const newDate = new Date(originalDate);
  newDate.setFullYear(originalDate.getFullYear() + years);

  const day = String(newDate.getDate()).padStart(2, "0");
  const month = newDate.toLocaleString("en-US", { month: "short" }); // "Sep"
  const year = newDate.getFullYear();

  return `${day} ${month} ${year}`; // "30 Sep 2025"
}

const getDateRange = (selectedDateCode) => {
  const today = moment().startOf("day");

  const formatDate = (date) => moment(date).format("YYYY-MM-DD");
  const formatLabel = (start, end) =>
    `${moment(start).format("D MMM")} - ${moment(end).format("D MMM")}`;

  switch (selectedDateCode) {
    case "today": {
      const start = today;
      const end = moment(today).endOf("day");
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: formatLabel(start, end),
      };
    }

    case "last7days": {
      const start = moment(today).subtract(7, "days").startOf("day");
      const end = moment(today).subtract(1, "day").endOf("day");
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: formatLabel(start, end),
      };
    }

    case "last7weeks": {
      const start = moment(today).subtract(7, "weeks").startOf("week");
      const end = moment(today).subtract(1, "week").endOf("week");
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: formatLabel(start, end),
      };
    }

    case "last12months": {
      const start = moment(today).subtract(12, "months").startOf("month");
      const end = moment(today).subtract(1, "month").endOf("month");
      return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        label: formatLabel(start, end),
      };
    }

    case "yeartodate": {
  const start = moment(today).startOf("year");
  const end = moment(today).endOf("day"); // include today (current month)
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    label: formatLabel(start, end),
  };
}

    default:
      throw new Error(`Unknown selectedDateCode: ${selectedDateCode}`);
  }
};

export {
  getToken,
  getTextWidth,
  getTestId,
  numberFormat,
  dateRangeFormat,
  dateFormat,
  toISODateString,
  findElementByKey,
  formatAmount,
  numberWithCommas,
  abbreviateCount,
  abbreviateNumber,
  getLastNameInitials,
  getNameInitials,
  getItemsMargin,
  isValidString,
  validateEmail,
  validateName,
  setToken,
  formatInput,
  validateZipcode,
  maskNumber,
  capitalizeFirstLetter,
  formatIndianNumber,
  truncateText,
  maskExceptLast4,
  getStatusChip,
  getDateRangeFromOption,
  formatDetailsToJson,
  truncateByChars,
  validatefromSpace,
  getColorByAction,
  formatToUSD,
  getAbbreviation,
  validateMobileNum,
  generatePassword,
  formatDuration,
  isValidUrl,
  canAccessRoute,
  extractPolicyEffectiveDate,
  formatToTitleCase,
  formatToMillion,
  addYearsToDate,
  extractDateFields,
  extractingPolicyEffectiveDate,
  getDateRange,
};
