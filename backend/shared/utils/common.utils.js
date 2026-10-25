const moment = require("moment");
const {
  AGENT_DATA_STATUS,
} = require("./constants.utils");
const {
  CONTRACTING_STATUS_MAP,
  CONTRACTING_STATUS,
  COURSE_STATUSES,
} = require("./constants.utils");
const fs = require("fs");
// const csv = require('csv-parser');

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

const generatePassword = (length = 12) => {
  // Stronger password: includes upper, lower, digits, and special characters
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specials = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  const all = upper + lower + digits + specials;

  if (length < 8) length = 8; // enforce minimum length

  // Ensure at least one character from each set
  let password = [
    upper.charAt(Math.floor(Math.random() * upper.length)),
    lower.charAt(Math.floor(Math.random() * lower.length)),
    digits.charAt(Math.floor(Math.random() * digits.length)),
    specials.charAt(Math.floor(Math.random() * specials.length))
  ];

  // Fill the rest with random characters from all sets
  for (let i = password.length; i < length; i++) {
    password.push(all.charAt(Math.floor(Math.random() * all.length)));
  }

  // Shuffle the password to avoid predictable positions
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function updateFields(existingData, newData) {
  const updatedFields = {};

  Object.keys(newData).forEach((key) => {
    const newValue = newData[key];

    // Skip if new value is null or undefined
    if (newValue == null) return;

    // Only update if existing value is different
    if (existingData[key] !== newValue) {
      updatedFields[key] = newValue;
    }
  });

  return updatedFields;
}

function validateEnumFields(fields) {
  const errors = [];

  for (const { name, value, allowed } of fields) {
    if (value && !allowed.includes(value)) {
      errors.push(`${name} must be one of: ${allowed.join(", ")}`);
    }
  }

  return errors;
}

const getStatusByExpiryDate = (expiryDate = "") => {
  const expiry = new Date(expiryDate);

  if (!expiryDate || isNaN(expiry.getTime())) return "";

  const today = new Date();
  const in60Days = moment(today).add(60, "days").toDate();

  if (expiry < today) {
    return "Expired";
  } else if (expiry <= in60Days) {
    return "Expiring Soon";
  }

  return "Active";
};

const getExactStatusByExpiryDate = (expiryDate = "") => {
  // const expiry = new Date(expiryDate);

  // if (!expiryDate || isNaN(expiry.getTime())) return "";

  // const today = new Date();
  // const in60Days = moment(today).add(60, "days").toDate();

  // if (expiry < today) {
  //   return AGENT_DATA_STATUS["Expired"] || "Expired";
  // } else if (expiry <= in60Days) {
  //   const daysLeft = moment(expiry).diff(moment(today), "days");
  //   return `Expiring in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  // }

  // return "";


  if (!expiryDate || isNaN(new Date(expiryDate).getTime())) return "";

  const expiry = moment(expiryDate).startOf("day");
  const today = moment().startOf("day");
  const in60Days = moment().add(60, "days").startOf("day");

  if (expiry.isAfter(in60Days)) {
    return AGENT_DATA_STATUS["Active"];
  } else if (expiry.isSameOrAfter(today) && expiry.isSameOrBefore(in60Days)) {
    const daysLeft = expiry.diff(today, "days");
    return `Expiring in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  } else if (expiry.isBefore(today)) {
    return AGENT_DATA_STATUS["Expired"] || "Expired";
  }

  return "";
};

const maskExceptLast4 = (value) => {
  if (!value) return "";

  const endDigits = value.slice(-4);
  const maskedLength = value.length - 4;
  const masked = "*".repeat(Math.max(maskedLength, 0));
  return masked + endDigits;
};

const getEnoExpiryDate = (expiryDate) => {
  const expiry = new Date(expiryDate);
  if (!expiryDate || isNaN(expiry.getTime())) return null;
  return moment(expiry).add(3, "y").toDate();
};

const sanitizeDateFields = (obj, dateFields) => {
  const sanitized = { ...obj };
  for (const field of dateFields) {
    if (sanitized[field] === "") {
      sanitized[field] = null;
    }
  }
  return sanitized;
};
const getLicenseExpiryDate = (expiryDate) => {
  const expiry = new Date(expiryDate);
  if (!expiryDate || isNaN(expiry.getTime())) return null;
  return moment(expiry).add(2, "y").toDate();
};

const getCarrierConditionalStatus = (item) => {
  if (!item) return item;
  const { status, acknowledgedByAgent, isSureLcSubmitted } = item;
  const statuses = [
    CONTRACTING_STATUS.Completed,
    CONTRACTING_STATUS.Discarded,
    CONTRACTING_STATUS.Deactivated,
  ];
  if (statuses.includes(item.status)) {
  }
  // else if (acknowledgedByAgent && !isSureLcSubmitted) {
  //   item.status = CONTRACTING_STATUS_MAP[CONTRACTING_STATUS.Acknowledged] || 'Acknowledged';
  //   item.statusCode = CONTRACTING_STATUS.Acknowledged;
  //   return item;
  // }
  // else if (isSureLcSubmitted && !acknowledgedByAgent) {
  //   item.status =
  //     CONTRACTING_STATUS_MAP[CONTRACTING_STATUS.AcknowledgedPending] ||
  //     "Ack Pending";
  //   item.statusCode = CONTRACTING_STATUS.AcknowledgedPending;
  //   return item;
  // }
  item.status = CONTRACTING_STATUS_MAP[status] || "--";
  item.statusCode = status;
  return item;
};
// function parseCommissionCsv(filePath) {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => results.push(data))
//       .on('end', () => resolve(results))
//       .on('error', (err) => reject(err));
//   });
// }

function formatAmount(amount) {
  if (amount !== null && amount !== undefined) {
    const cleaned = parseFloat(String(amount).replace(/[^\d.-]/g, ""));
    if (isNaN(cleaned)) return null;
    return cleaned;
  }
  return null;
}

const getLicenseStatusByExpiryDate = (expiryDate = "") => {
  if (!expiryDate || isNaN(new Date(expiryDate).getTime())) return "";

  const expiry = moment(expiryDate).startOf("day");
  const today = moment().startOf("day");
  const in60Days = moment().add(60, "days").startOf("day");

  if (expiry.isAfter(in60Days)) {
    return AGENT_DATA_STATUS["Active"];
  } else if (expiry.isSameOrAfter(today) && expiry.isSameOrBefore(in60Days)) {
    const daysLeft = expiry.diff(today, "days");
    return `Expiring in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
  } else if (expiry.isBefore(today)) {
    return AGENT_DATA_STATUS["Expired"] || "Expired";
  }

  return "";
};

function getChangedFields(keyDisplayMap = {}, shouldCompare, oldData, newData) {
  if (shouldCompare) {
    const formatKey = (key) =>
      keyDisplayMap[key] ||
      key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (s) => s.toUpperCase());

    const isEmpty = (val) => val === null || val === undefined || val === "";

    const changes = Object.keys(newData)
      .filter((key) => key in oldData)
      .filter((key) => {
        const oldVal = oldData[key];
        const newVal = newData[key];

        // ✅ Skip only if BOTH are empty
        if (isEmpty(oldVal) && isEmpty(newVal)) {
          return false;
        }

        // Compare as strings
        return String(oldVal) !== String(newVal);
      })
      .map((key, index) => {
        const displayKey = formatKey(key);
        const oldVal = oldData[key];
        const newVal = newData[key];

        const changeText = isEmpty(oldVal)
          ? `${displayKey}: ${String(newVal)}`
          : `${displayKey}: ${String(oldVal)} → ${String(newVal)}`;

        return index === 0 ? changeText : `\n  ${changeText}`;
      });

    return changes.length > 0 ? `(${changes.join(", ")})` : "";
  } else {
    return "";
  }
}

const getConditionalContractStatus = (contract = {}, tevahContract = {}) => {
  const { stage } = contract
  if (stage === 'BGA') {
    if (tevahContract.acknowledgedByAgent) {
      return CONTRACTING_STATUS[stage] //Under Review
    }
    return CONTRACTING_STATUS["AcknowledgedPending"] //Ack Pending
  } else if (stage === 'Carrier') {
    if (tevahContract.acknowledgedByAgent) {
      return CONTRACTING_STATUS[stage] //At Carrier
    }
    return CONTRACTING_STATUS["AcknowledgedPending"] //Ack Pending
  } else if (stage === 'Completed') {
    if (tevahContract.acknowledgedByAgent) {
      return CONTRACTING_STATUS['Carrier'] //At Carrier
    }
    return CONTRACTING_STATUS["AcknowledgedPending"] //Ack Pending
  } else if (stage === 'Discarded') {
    return CONTRACTING_STATUS["Deactivated"] //Deactivated
  } else if (stage === 'Producer') {
    return CONTRACTING_STATUS[stage] //None (Exclude from app)
  }

}

const getStatusByProgressPercent = (percent = 0) => {
  let status = ''
  if (percent === 100) {
    status = COURSE_STATUSES.COMPLETED
  } else if (percent < 100 && percent > 0) {
    status = COURSE_STATUSES.INPROGRESS
  } else if (percent === 0) {
    status = COURSE_STATUSES.ENROLL
  }
  return status
}
const welcomeEmailTemplate = ({ name, email, password }) => `
Dear ${name},

Welcome to the GFI Back-Office Platform!

Your account has been created successfully. Below are your login details:

--------------------------------------
Email: ${email}
Temporary Password: ${password}
--------------------------------------

For your security, you will be asked to set a new password upon your first login.

If you have any questions or encounter any issues, please contact our support team.

Best regards,  
GFI Admin Team
`;

const getS3KeyFromUrl = (url) => {
  try {
    return new URL(url).pathname.slice(1);
  } catch {
    return null;
  }
};
const formatToUSD = (amount) => {
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;
  return `$ ${safeAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};


module.exports = {
  generateOtp,
  getKeyByValue,
  validateEmailFormat,
  updateFields,
  validateEnumFields,
  getStatusByExpiryDate,
  getExactStatusByExpiryDate,
  maskExceptLast4,
  getEnoExpiryDate,
  sanitizeDateFields,
  getLicenseExpiryDate,
  getCarrierConditionalStatus,
  // parseCommissionCsv,
  formatAmount,
  getLicenseStatusByExpiryDate,
  getChangedFields,
  getConditionalContractStatus,
  getStatusByProgressPercent,
  welcomeEmailTemplate,
  getS3KeyFromUrl,
  generatePassword,
  formatToUSD
};
